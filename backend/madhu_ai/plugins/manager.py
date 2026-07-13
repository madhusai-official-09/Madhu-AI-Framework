from pathlib import Path
import importlib

class PluginManager:

    def __init__(self):
        self.plugins = {}

    def register(self, plugin):
        self.plugins[plugin.name] = plugin

    def get(self, name):
        return self.plugins.get(name)

    def list(self):
        return list(self.plugins.keys())