from .base import BasePlugin

class WeatherPlugin(BasePlugin):

    name = "weather"

    def run(self, city):
        return f"Weather lookup for {city} is not implemented yet."