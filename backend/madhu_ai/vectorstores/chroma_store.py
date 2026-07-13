import uuid
from threading import Lock

import chromadb

from ..config import config
from ..core.constants import DEFAULT_COLLECTION


class ChromaStore:
    _client = None
    _collection = None
    _lock = Lock()

    @classmethod
    def _initialize(cls):
        if cls._client is None:
            with cls._lock:
                if cls._client is None:
                    print("Loading ChromaDB...")

                    cls._client = chromadb.PersistentClient(
                        path=config.chroma_path
                    )

                    cls._collection = cls._client.get_or_create_collection(
                        name=DEFAULT_COLLECTION
                    )

    @classmethod
    def add(cls, text, embedding):
        cls._initialize()

        if hasattr(embedding, "tolist"):
            embedding = embedding.tolist()

        cls._collection.add(
            documents=[text],
            embeddings=[embedding],
            ids=[str(uuid.uuid4())],
        )

    @classmethod
    def search(cls, embedding, top_k=3):
        cls._initialize()

        if hasattr(embedding, "tolist"):
            embedding = embedding.tolist()

        results = cls._collection.query(
            query_embeddings=[embedding],
            n_results=top_k,
        )

        return results["documents"][0]