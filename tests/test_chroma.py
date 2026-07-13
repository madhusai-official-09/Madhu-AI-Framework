from madhu_ai.embeddings.sentence_transformer import EmbeddingModel
from madhu_ai.vectorstores.chroma_store import ChromaStore

model = EmbeddingModel()
db = ChromaStore()

docs = [
    "I build AI applications.",
    "I develop Next.js websites.",
    "I love Python."
]

for doc in docs:
    db.add(doc, model.embed(doc))

query = model.embed("Artificial Intelligence")

results = db.search(query)

print(results)