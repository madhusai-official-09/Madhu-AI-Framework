from madhu_ai.embeddings.sentence_transformer import EmbeddingModel
from madhu_ai.vectorstores.memory_store import MemoryVectorStore

model = EmbeddingModel()
store = MemoryVectorStore()

docs = [
    "I build AI applications.",
    "I develop Next.js websites.",
    "I love Python.",
    "I play cricket."
]

for doc in docs:
    store.add(doc, model.embed(doc))

query = model.embed("Artificial Intelligence")

results = store.search(query)

for score, text in results:
    print(score)
    print(text)
    print("-" * 30)