from fastembed import TextEmbedding


class EmbeddingModel:
    _model = None

    @classmethod
    def _get_model(cls):
        if cls._model is None:
            cls._model = TextEmbedding(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )
        return cls._model

    @classmethod
    def embed(cls, text):
        model = cls._get_model()
        return next(iter(model.embed([text]))).tolist()

    @classmethod
    def embed_batch(cls, texts):
        model = cls._get_model()
        return [v.tolist() for v in model.embed(texts)]