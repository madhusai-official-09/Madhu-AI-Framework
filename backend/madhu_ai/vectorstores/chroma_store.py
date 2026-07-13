import uuid

import chromadb

from ..core.constants import DEFAULT_DB, DEFAULT_COLLECTION


class ChromaStore:

    def __init__(self):

        self.client = chromadb.PersistentClient(
            path=DEFAULT_DB
        )

        self.collection = self.client.get_or_create_collection(
            name=DEFAULT_COLLECTION
        )

    def add(self, text, embedding):

        self.collection.add(
            documents=[text],
            embeddings=[embedding.tolist()],
            ids=[str(uuid.uuid4())],
        )

    def search(self, embedding, top_k=3):

        results = self.collection.query(
            query_embeddings=[embedding.tolist()],
            n_results=top_k,
        )

        return results["documents"][0]