from pypdf import PdfReader


class PDFLoader:

    def load(self, path: str) -> str:

        reader = PdfReader(path)

        text = ""

        for page in reader.pages:

            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

        return text