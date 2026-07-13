from ..core.logger import logger


class Retriever:

    def __init__(self, embedding_model, vector_db):
        self.embedding_model = embedding_model
        self.vector_db = vector_db

    def retrieve(self, question, top_k=3):
        try:
            embedding = self.embedding_model.embed(question)

            documents = self.vector_db.search(
                embedding,
                top_k
            )

            return documents

        except Exception as e:
            logger.exception(f"Retriever Error: {e}")
            return []