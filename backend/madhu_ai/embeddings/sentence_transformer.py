from threading import Lock

from sentence_transformers import SentenceTransformer

from ..config import config


class EmbeddingModel:
    _model = None
    _lock = Lock()

    @classmethod
    def _get_model(cls):
        if cls._model is None:
            with cls._lock:
                if cls._model is None:
                    print("Loading SentenceTransformer...")

                    cls._model = SentenceTransformer(
                        config.embedding_model
                    )

                    print("SentenceTransformer loaded successfully.")

        return cls._model

    @classmethod
    def embed(cls, text):
        model = cls._get_model()
        return model.encode(text).tolist()