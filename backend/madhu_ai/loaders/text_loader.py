from pathlib import Path
from ..exceptions.loader import DocumentNotFoundError


class TextLoader:

    def load(self, path: str) -> str:

        file_path = Path(path)

        if not file_path.exists():
            raise DocumentNotFoundError(
                f"Document '{path}' was not found."
            )

        return file_path.read_text(
            encoding="utf-8",
            errors="ignore",
        )