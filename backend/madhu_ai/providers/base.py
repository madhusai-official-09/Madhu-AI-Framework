from abc import ABC, abstractmethod


class BaseProvider(ABC):

    @abstractmethod
    def chat(self, messages):
        pass

    @abstractmethod
    def stream(self, messages):
        pass