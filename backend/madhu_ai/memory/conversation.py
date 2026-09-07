import json
from collections import deque
from pathlib import Path


class ConversationMemory:
    def __init__(self, max_messages=20):
        self.max_messages = max_messages

        self.system_message = {
            "role": "system",
            "content": "You are MadhuAI, a helpful AI assistant.",
        }

        self.messages = deque(maxlen=max_messages)
        self.user_id = None

        self.storage_dir = (
            Path(__file__).resolve().parents[2]
            / "data"
            / "conversations"
        )

    def _file_path(self, user_id: str) -> Path:
        safe_user_id = "".join(
            c for c in user_id if c.isalnum() or c in "-_"
        )

        if not safe_user_id:
            raise ValueError("Invalid Firebase user ID")

        return self.storage_dir / f"{safe_user_id}.json"

    def load_user(self, user_id: str):
        self.user_id = user_id
        self.messages.clear()

        self.storage_dir.mkdir(parents=True, exist_ok=True)

        path = self._file_path(user_id)

        if not path.exists():
            return

        try:
            data = json.loads(path.read_text(encoding="utf-8"))

            if isinstance(data, list):
                for message in data:
                    if (
                        isinstance(message, dict)
                        and message.get("role") in {"user", "assistant"}
                        and isinstance(message.get("content"), str)
                    ):
                        self.messages.append(
                            {
                                "role": message["role"],
                                "content": message["content"],
                            }
                        )
        except Exception:
            self.messages.clear()

    def _save(self):
        if not self.user_id:
            return

        self.storage_dir.mkdir(parents=True, exist_ok=True)

        path = self._file_path(self.user_id)

        path.write_text(
            json.dumps(
                list(self.messages),
                ensure_ascii=False,
                indent=2,
            ),
            encoding="utf-8",
        )

    def add_user_message(self, message):
        self.messages.append(
            {
                "role": "user",
                "content": message,
            }
        )

        self._save()

    def add_assistant_message(self, message):
        self.messages.append(
            {
                "role": "assistant",
                "content": message,
            }
        )

        self._save()

    def get_messages(self):
        return [self.system_message, *list(self.messages)]

    def clear(self):
        self.messages.clear()
        self._save()