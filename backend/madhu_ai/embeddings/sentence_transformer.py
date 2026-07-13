from threading import Lock

from ..config import config

from sentence_transformers import SentenceTransformer

class EmbeddingModel:
    _model = None
    _lock = Lock()

    @classmethod
    def _get_model(cls):
        if cls._model is None:
            with cls._lock:
                if cls._model is None:
                    print("Loading SentenceTransformer...")
                    try:
                        from sentence_transformers import SentenceTransformer
                    except Exception as e:
                        raise ImportError(
                            "sentence_transformers is required to use EmbeddingModel: "
                            + str(e)
                        )

                    cls._model = SentenceTransformer(config.embedding_model)

        return cls._model

    @classmethod
    def embed(cls, text):
        model = cls._get_model()
        return model.encode(text).tolist()