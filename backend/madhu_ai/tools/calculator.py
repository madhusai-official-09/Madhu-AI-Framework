from .base import BaseTool

class CalculatorTool(BaseTool):
    name = "calculator"
    description = "Perform mathematical calculations"

    def run(self, expression: str):
        return eval(expression)