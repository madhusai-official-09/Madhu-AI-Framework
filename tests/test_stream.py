from madhu_ai import MadhuAI

bot = MadhuAI()

for token in bot.stream("Explain AI in 5 lines"):
    print(token, end="", flush=True)