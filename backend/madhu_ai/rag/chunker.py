class TextChunker:
    def __init__(self, chunk_size=700, overlap=100):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def split(self, text: str):
        text = " ".join(text.split())
        step = self.chunk_size - self.overlap
        chunks = (text[i:i + self.chunk_size] for i in range(0, len(text), step))
        return [c for c in chunks if c.strip()]