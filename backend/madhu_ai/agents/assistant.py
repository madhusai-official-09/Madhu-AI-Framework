from .base import BaseAgent

class AssistantAgent(BaseAgent):

    name = "assistant"

    def __init__(self, bot):
        self.bot = bot

    def run(self, task: str):
        return self.bot.chat(task)