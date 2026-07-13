import requests
from bs4 import BeautifulSoup


class WebsiteLoader:

    def load(self, url: str) -> str:

        response = requests.get(
            url,
            timeout=15,
            headers={
                "User-Agent": "MadhuAI/1.0"
            }
        )

        response.raise_for_status()

        soup = BeautifulSoup(
            response.text,
            "html.parser"
        )

        # Remove unwanted elements
        for tag in soup(["script", "style", "noscript"]):
            tag.decompose()

        text = soup.get_text(separator="\n")

        # Clean blank lines
        lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
        ]

        return "\n".join(lines)