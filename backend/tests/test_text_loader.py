from madhu_ai import MadhuAI
from madhu_ai.loaders.text_loader import TextLoader

bot = MadhuAI()

for token in bot.stream("Explain AI in 5 lines."):
    print(token, end="", flush=True)
    
loader = TextLoader()

text = loader.load("madhu_ai/docs/about.txt")

print(text)