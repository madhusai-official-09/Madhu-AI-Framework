from madhu_ai.loaders.text_loader import TextLoader
from madhu_ai.rag.chunker import TextChunker

loader = TextLoader()

text = loader.load("madhu_ai/docs/about.txt")

chunker = TextChunker(
    chunk_size=50
)

chunks = chunker.split(text)

for i, chunk in enumerate(chunks):

    print("="*40)

    print(f"Chunk {i+1}")

    print(chunk)