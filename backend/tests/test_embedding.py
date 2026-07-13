from sentence_transformers import util
from madhu_ai.embeddings.sentence_transformer import EmbeddingModel

model = EmbeddingModel()

v1 = model.embed("I build AI applications.")
v2 = model.embed("I develop artificial intelligence software.")

score = util.cos_sim(v1, v2)

print(score)