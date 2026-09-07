from pathlib import Path

from ..api.router import create_router
from ..core.config import Config
from ..core.logger import logger

from ..memory.conversation import ConversationMemory

from ..loaders.pdf_loader import PDFLoader
from ..loaders.text_loader import TextLoader
from ..loaders.website_loader import WebsiteLoader

from ..rag.chunker import TextChunker
from ..prompts.builder import PromptBuilder


from ..rag.retriever import Retriever

from ..ingestion.ingestor import Ingestor
from ..factories.provider_factory import ProviderFactory

from ..plugins.manager import PluginManager

from ..agents.assistant import AssistantAgent
from ..agents.rag_agent import RAGAgent



class MadhuAI:

    def __init__(self, config: Config | None = None):

        self.config = config or Config()

        self.logger = logger

        self.memory = ConversationMemory()

        self.loader = None
        self.pdf_loader = None
        self.website_loader = None

        self.chunker = TextChunker()

        self.embedding_model = None
        self.vector_db = None
        self.retriever = None
        self.provider = None

        self.ingestor = None

        self.plugins = PluginManager()

        self.assistant = AssistantAgent(self)
        self.rag = RAGAgent(self)

        self.logger.info("MadhuAI initialized.")

            
    def get_embedding_model(self):

        if self.embedding_model is None:

            self.logger.info("Loading embedding model...")
            
            from ..embeddings.sentence_transformer import EmbeddingModel

            self.embedding_model = EmbeddingModel

        return self.embedding_model
    
    def get_vector_db(self):

        if self.vector_db is None:
            
            self.logger.info("Loading ChromaDB")
            
            from ..vectorstores.chroma_store import ChromaStore
            
            self.vector_db = ChromaStore

        return self.vector_db
    
    def get_provider(self):

        if self.provider is None:

            self.logger.info("Loading provider...")
            
            self.provider = ProviderFactory.create(
                self.config
            )
            

        return self.provider
    
    def get_retriever(self):

        if self.retriever is None:

            self.retriever = Retriever(
                self.get_embedding_model(),
                self.get_vector_db(),
            )

        return self.retriever

    def chat(self, message: str, user_id: str, project_id: str,) -> str:

        retriever = self.get_retriever()

        try:
            results = retriever.retrieve(message,project_id,)
            
            self.logger.info(f"RAG results found: {len(results)}")
            self.logger.info(f"RAG context: {results[:1]}")

        except Exception:
            self.logger.exception("Retriever failed")
            results = []

        self.memory.load_user(user_id)
        
        context = "\n\n".join(str(result) for result in results)
        
        prompt = PromptBuilder.build(
            context=context,
            question=message,
        )

        self.memory.add_user_message(prompt)

        history = self.memory.get_messages()

        self.logger.info(f"Generating response for: {message[:60]}")

        provider = self.get_provider()

        reply = provider.chat(history)

        self.memory.add_assistant_message(reply)

        return reply

    def stream(self, message: str, user_id: str, project_id: str,):

        self.logger.info("Streaming response...")

        retriever = self.get_retriever()

        try:
            results = retriever.retrieve(message, project_id,)

            self.logger.info(f"RAG results found: {len(results)}")
            self.logger.info(f"RAG context: {results[:1]}")

        except Exception:
            self.logger.exception("Retriever failed")
            results = []

        self.memory.load_user(user_id)

        provider = self.get_provider()

        context = "\n\n".join(results)

        prompt = PromptBuilder.build(
            context=context,
            question=message,
        )
        self.memory.add_user_message(prompt)

        full_response = ""

        for token in provider.stream(
            self.memory.get_messages()
        ):
            full_response += token
            yield token

        self.memory.add_assistant_message(full_response)

    def mount(self, app):
        app.include_router(create_router(self))

    def add_text(self, path):

        if self.loader is None:

            self.loader = TextLoader()
        self.get_retriever()
        
        text = self.loader.load(path)

        return self._index_document(text)

    def add_pdf(self, path: str, project_id: str,):

        if self.pdf_loader is None:

            self.pdf_loader = PDFLoader()

        self.get_retriever()

        text = self.pdf_loader.load(path)

        return self._index_document(text, project_id,)

    def add_website(self, url: str):

        if self.website_loader is None:

            self.website_loader = WebsiteLoader()

        self.get_retriever()

        text = self.website_loader.load(url)

        return self._index_document(text)

    def _index_document(self, text: str, project_id:str,):
        
        embedding_model = self.get_embedding_model()
        
        vector_db = self.get_vector_db()
        
        chunks = self.chunker.split(text)

        self.logger.info(
            f"Created {len(chunks)} chunks."
            f"for project {project_id}."
        )

        for chunk in chunks:

            embedding = embedding_model.embed(chunk)

            vector_db.add(
                chunk,
                embedding,
                project_id,
            )

        return len(chunks)

    def ingest(self, path):
        
        if self.ingestor is None:
            
            self.ingestor = Ingestor(self)
        return self.ingestor.ingest(path)

    def load_knowledge(self):

        knowledge = Path(__file__).resolve().parents[2] / "knowledge"

        if not knowledge.exists():

            self.logger.info(
                "No knowledge folder found."
            )

            return

        self.logger.info(
            "Loading knowledge..."
        )

        self.ingest(knowledge)

        self.logger.info(
            "Knowledge loaded."
        )

    def run_agent(
        self,
        agent_name: str,
        task: str,
    ):

        if agent_name == "assistant":
            return self.assistant.run(task)

        if agent_name == "rag":
            return self.rag.run(task)

        raise ValueError("Unknown agent")
