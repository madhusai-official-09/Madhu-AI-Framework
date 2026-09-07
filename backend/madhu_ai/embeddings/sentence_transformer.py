import os

import numpy as np
from huggingface_hub import InferenceClient


class EmbeddingModel:
    _client = None

    @classmethod
    def _get_client(cls):
        if cls._client is None:
            token = os.getenv("HF_TOKEN")

            if not token:
                raise RuntimeError("HF_TOKEN is not configured.")

            cls._client = InferenceClient(
                provider="hf-inference",
                api_key=token,
            )

        return cls._client

    @classmethod
    def embed(cls, text):
        client = cls._get_client()

        result = client.feature_extraction(
            text,
            model="sentence-transformers/all-MiniLM-L6-v2",
        )

        result = np.asarray(result)

        # Hugging Face may return token-level embeddings:
        # [tokens, dimensions]
        # Convert them into one sentence embedding:
        # [dimensions]
        if result.ndim == 2:
            result = result.mean(axis=0)

        return result.tolist()