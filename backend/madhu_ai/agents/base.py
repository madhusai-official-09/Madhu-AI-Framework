from abc import ABC, abstractmethod

class BaseAgent(ABC):

    name = "agent"

    @abstractmethod
    def run(self, task: str):
        pass