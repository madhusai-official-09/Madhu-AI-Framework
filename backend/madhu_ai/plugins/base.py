from abc import ABC, abstractmethod

class BasePlugin(ABC):
    name: str

    @abstractmethod
    def run(self, **kwargs):
        pass