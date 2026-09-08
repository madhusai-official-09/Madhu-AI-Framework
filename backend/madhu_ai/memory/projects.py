import json
import uuid
from pathlib import Path


class ProjectStore:

    def __init__(self):
        self.path = (
            Path(__file__).resolve().parents[2]
            / "data"
            / "projects.json"
        )

        self.path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

    def _load(self):
        if not self.path.exists():
            return {}

        try:
            with open(
                self.path,
                "r",
                encoding="utf-8",
            ) as file:
                projects = json.load(file)

            changed = False

            for project in projects.values():
                if "widget_key" not in project:
                    project["widget_key"] = f"madhu_{uuid.uuid4().hex}"
                    changed = True

            if changed:
                self._save(projects)

            return projects

        except (json.JSONDecodeError, OSError):
            return {}

    def _save(self, projects):
        with open(
            self.path,
            "w",
            encoding="utf-8",
        ) as file:
            json.dump(
                projects,
                file,
                indent=2,
            )

    def create(self, user_id, name):
        projects = self._load()

        project_id = str(uuid.uuid4())
        widget_key = f"madhu_{uuid.uuid4().hex}"

        projects[project_id] = {
            "id": project_id,
            "user_id": user_id,
            "name": name,
            "widget_key": widget_key,
        }

        self._save(projects)

        return projects[project_id]

    def get(self, project_id):
        projects = self._load()
        return projects.get(project_id)
    
    def get_by_widget_key(self, widget_key):
        projects = self._load()

        for project in projects.values():
            if project.get("widget_key") == widget_key:
                return project

        return None
    
    def belongs_to_user(self, project_id, user_id):
        project = self.get(project_id)

        if not project:
            return False

        return project["user_id"] == user_id

    def list_for_user(self, user_id):
        projects = self._load()

        return [
            project
            for project in projects.values()
            if project["user_id"] == user_id
        ]