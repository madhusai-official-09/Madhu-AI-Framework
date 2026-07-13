from pathlib import Path


def create_project(name):

    root = Path(name)

    root.mkdir(exist_ok=True)

    (root / "knowledge").mkdir(exist_ok=True)

    (root / ".env").write_text(
        "GROQ_API_KEY=\n"
    )

    (root / "README.md").write_text(
        f"# {name}\n"
    )

    (root / "requirements.txt").write_text(
        "madhu-ai\n"
    )

    app = """
from madhu_ai import MadhuAI

bot = MadhuAI()

print(bot.chat("Hello"))
"""

    (root / "app.py").write_text(app)

    print(f"✅ Project '{name}' created successfully!")