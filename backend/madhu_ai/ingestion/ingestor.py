from pathlib import Path
from ..exceptions.loader import UnsupportedFileTypeError


class Ingestor:

    def __init__(self, bot):

        self.bot = bot

    def ingest(self, path):

        path = Path(path)

        if path.is_dir():

            for file in path.rglob("*"):

                if file.is_file():

                    self.ingest(file)

            return
        self.bot.logger.info(f"Ingesting file: {path}")
        
        suffix = path.suffix.lower()

        if suffix == ".txt":

            return self.bot.add_text(str(path))

        elif suffix == ".pdf":

            return self.bot.add_pdf(str(path))

        else:

            raise UnsupportedFileTypeError(
                f"{suffix} files are not supported."
            )