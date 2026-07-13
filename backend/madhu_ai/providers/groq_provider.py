from dotenv import load_dotenv
from openai import OpenAI

from .base import BaseProvider

load_dotenv()


class GroqProvider(BaseProvider):

    def __init__(self, config):
        self.config = config

        self.client = OpenAI(
            api_key=config.api_key,
            base_url="https://api.groq.com/openai/v1",
        )

    def chat(self, messages):
        response = self.client.chat.completions.create(
            model=self.config.model,
            messages=messages,
            temperature=self.config.temperature,
            max_tokens=self.config.max_tokens,
        )

        return response.choices[0].message.content

    def stream(self, messages):
        response = self.client.chat.completions.create(
            model=self.config.model,
            messages=messages,
            temperature=self.config.temperature,
            max_tokens=self.config.max_tokens,
            stream=True,
        )

        for chunk in response:
            delta = chunk.choices[0].delta.content

            if delta:
                yield delta