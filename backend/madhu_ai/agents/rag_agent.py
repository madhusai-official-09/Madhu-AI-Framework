from .base import BaseAgent

class RAGAgent(BaseAgent):

    name = "rag"

    def __init__(self, bot):
        self.bot = bot

    def run(self, task: str):
        return self.bot.chat(task)