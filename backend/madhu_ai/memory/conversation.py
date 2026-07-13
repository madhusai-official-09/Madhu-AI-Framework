from collections import deque


class ConversationMemory:
    def __init__(self, max_messages=20):
        self.system_message = {
            "role": "system",
            "content": "You are MadhuAI, a helpful AI assistant."
        }

        self.messages = deque(maxlen=max_messages)

    def add_user_message(self, message):
        self.messages.append({
            "role": "user",
            "content": message
        })

    def add_assistant_message(self, message):
        self.messages.append({
            "role": "assistant",
            "content": message
        })

    def get_messages(self):
        return [self.system_message, *list(self.messages)]

    def clear(self):
        self.messages.clear()