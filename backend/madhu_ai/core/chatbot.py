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

SYSTEM = {
    "role": "system",
    "content": "You are MadhuAI, a helpful AI assistant.",
}


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
            self.provider = ProviderFactory.create(self.config)
        return self.provider

    def get_retriever(self):
        if self.retriever is None:
            self.retriever = Retriever(
                self.get_embedding_model(),
                self.get_vector_db(),
            )
        return self.retriever

    def _build_messages(self, message, project_id, history):
        try:
            results = self.get_retriever().retrieve(
                message, project_id, top_k=3
            )
        except Exception:
            self.logger.exception("Retriever failed")
            results = []

        self.logger.info(f"RAG results found: {len(results)}")

        context = "\n\n".join(str(r) for r in results)
        prompt = PromptBuilder.build(context=context, question=message)

        return [SYSTEM, *history[-4:], {"role": "user", "content": prompt}]

    def chat(self, message, user_id, project_id, history=None):
        mem = None

        if history is None:
            mem = ConversationMemory()
            mem.load_user(user_id)
            history = list(mem.messages)

        reply = self.get_provider().chat(
            self._build_messages(message, project_id, history)
        )

        if mem:
            mem.add_user_message(message)
            mem.add_assistant_message(reply)

        return reply

    def stream(self, message, user_id, project_id):
        mem = ConversationMemory()
        mem.load_user(user_id)

        full = ""

        for token in self.get_provider().stream(
            self._build_messages(message, project_id, list(mem.messages))
        ):
            full += token
            yield token

        mem.add_user_message(message)
        mem.add_assistant_message(full)

    def mount(self, app):
        app.include_router(create_router(self))

    def add_text(self, path, project_id: str, metadata=None):
        if self.loader is None:
            self.loader = TextLoader()
        self.get_retriever()
        text = self.loader.load(path)
        return self._index_document(text, project_id, metadata)

    def add_pdf(self, path: str, project_id: str, metadata=None):
        if self.pdf_loader is None:
            self.pdf_loader = PDFLoader()
        self.get_retriever()
        text = self.pdf_loader.load(path)
        return self._index_document(text, project_id, metadata)

    def add_website(self, url: str, project_id: str, metadata=None):
        if self.website_loader is None:
            self.website_loader = WebsiteLoader()
        self.get_retriever()
        text = self.website_loader.load(url)
        return self._index_document(text, project_id, metadata)

    def _index_document(self, text: str, project_id: str, metadata=None):
        embedding_model = self.get_embedding_model()
        vector_db = self.get_vector_db()

        chunks = self.chunker.split(text)

        self.logger.info(
            f"Created {len(chunks)} chunks for project {project_id}."
        )

        for chunk in chunks:
            embedding = embedding_model.embed(chunk)
            vector_db.add(chunk, embedding, project_id, metadata)

        return len(chunks)

    def ingest(self, path):
        if self.ingestor is None:
            self.ingestor = Ingestor(self)
        return self.ingestor.ingest(path)

    def load_knowledge(self):
        knowledge = Path(__file__).resolve().parents[2] / "knowledge"

        if not knowledge.exists():
            self.logger.info("No knowledge folder found.")
            return

        self.logger.info("Loading knowledge...")
        self.ingest(knowledge)
        self.logger.info("Knowledge loaded.")

    def run_agent(self, agent_name: str, task: str):
        if agent_name == "assistant":
            return self.assistant.run(task)

        if agent_name == "rag":
            return self.rag.run(task)

        raise ValueError("Unknown agent")