import uuid
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter


class ProjectStore:
    def __init__(self):
        self.col = firestore.client().collection("projects")

    def create(self, user_id, name):
        pid = str(uuid.uuid4())
        project = {
            "id": pid,
            "user_id": user_id,
            "name": name,
            "widget_key": f"madhu_{uuid.uuid4().hex}",
        }
        self.col.document(pid).set(project)
        return project

    def get(self, project_id):
        d = self.col.document(project_id).get()
        return d.to_dict() if d.exists else None

    def get_by_widget_key(self, widget_key):
        q = self.col.where(filter=FieldFilter("widget_key", "==", widget_key)).limit(1)
        for d in q.stream():
            return d.to_dict()
        return None

    def belongs_to_user(self, project_id, user_id):
        p = self.get(project_id)
        return bool(p) and p["user_id"] == user_id

    def list_for_user(self, user_id):
        q = self.col.where(filter=FieldFilter("user_id", "==", user_id))
        return [d.to_dict() for d in q.stream()]