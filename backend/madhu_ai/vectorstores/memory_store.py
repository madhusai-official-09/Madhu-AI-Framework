from sentence_transformers import util


class MemoryVectorStore:

    def __init__(self):
        self.documents = []

    def add(self, text, embedding):

        self.documents.append(
            {
                "text": text,
                "embedding": embedding
            }
        )

    def search(self, query_embedding, top_k=3):

        scores = []

        for doc in self.documents:

            score = util.cos_sim(
                query_embedding,
                doc["embedding"]
            ).item()

            scores.append(
                (
                    score,
                    doc["text"]
                )
            )

        scores.sort(reverse=True)

        return scores[:top_k]