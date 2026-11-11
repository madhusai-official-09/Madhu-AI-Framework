from threading import Lock

from openai import OpenAI

from .base import BaseProvider


class GroqProvider(BaseProvider):
    _client = None
    _lock = Lock()

    def __init__(self, config):
        self.config = config

    def _get_client(self):
        if GroqProvider._client is None:
            with GroqProvider._lock:
                if GroqProvider._client is None:
                    GroqProvider._client = OpenAI(
                        api_key=self.config.api_key,
                        base_url="https://api.groq.com/openai/v1",
                    )
        return GroqProvider._client

    def _params(self, messages, stream=False):
        return dict(
            model=self.config.model,
            messages=messages,
            temperature=self.config.temperature,
            max_tokens=self.config.max_tokens,
            stream=stream,
            extra_body={"reasoning_effort": "low"},
        )

    def chat(self, messages):
        response = self._get_client().chat.completions.create(
            **self._params(messages)
        )
        return response.choices[0].message.content or ""

    def stream(self, messages):
        response = self._get_client().chat.completions.create(
            **self._params(messages, stream=True)
        )

        for chunk in response:
            if not chunk.choices:
                continue

            delta = chunk.choices[0].delta.content

            if delta:
                yield delta