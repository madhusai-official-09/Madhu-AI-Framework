import re
import uuid
from threading import Lock

import chromadb

from ..config import config


class ChromaStore:
    _client = None
    _collections = {}
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

    @classmethod
    def _collection_name(cls, project_id):
        safe_project_id = re.sub(
            r"[^a-zA-Z0-9_-]",
            "_",
            project_id,
        )

        return f"madhuai_project_{safe_project_id}"

    @classmethod
    def _get_collection(cls, project_id):
        cls._initialize()

        if not project_id:
            raise ValueError("project_id is required.")

        if project_id not in cls._collections:
            with cls._lock:
                if project_id not in cls._collections:
                    name = cls._collection_name(project_id)

                    cls._collections[project_id] = (
                        cls._client.get_or_create_collection(
                            name=name
                        )
                    )

        return cls._collections[project_id]

    @classmethod
    def add(cls, text, embedding, project_id, metadata=None):
        collection = cls._get_collection(project_id)

        if hasattr(embedding, "tolist"):
            embedding = embedding.tolist()

        collection.add(
            documents=[text],
            embeddings=[embedding],
            ids=[str(uuid.uuid4())],
            metadatas=[metadata or {}],
        )

    @classmethod
    def search(cls, embedding, project_id, top_k=3):
        collection = cls._get_collection(project_id)

        if hasattr(embedding, "tolist"):
            embedding = embedding.tolist()

        results = collection.query(
            query_embeddings=[embedding],
            n_results=top_k,
        )

        return results["documents"][0]
    
    @classmethod
    def list_documents(cls, project_id):
        collection = cls._get_collection(project_id)

        data = collection.get(include=["metadatas"])

        documents = {}

        for metadata in data.get("metadatas", []):
            metadata = metadata or {}
            filename = metadata.get("filename")

            if not filename:
                continue

            if filename not in documents:
                documents[filename] = {
                    "filename": filename,
                    "size": metadata.get("size", 0),
                    "status": metadata.get("status", "indexed"),
                    "chunks": 0,
                }

            documents[filename]["chunks"] += 1

        return list(documents.values())
    
    @classmethod
    def delete_document(cls, project_id, filename):
        collection = cls._get_collection(project_id)

        collection.delete(
            where={"filename": filename}
        )

        return True