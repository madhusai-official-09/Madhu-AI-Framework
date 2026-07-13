from madhu_ai.loaders.pdf_loader import PDFLoader

loader = PDFLoader()

text = loader.load("madhu_ai/docs/Madhu Resume 2026 latest.pdf")

print(text)
