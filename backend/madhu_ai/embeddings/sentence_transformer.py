from sentence_transformers import SentenceTransformer


class EmbeddingModel:
    def __init__(self):
        self.model = None

    def _load(self):
        if self.model is None:
            print("Loading embedding model...")
            self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def embed(self, text):
        self._load()
        return self.model.encode(text).tolist()