import json, os
import firebase_admin
from firebase_admin import credentials

if not firebase_admin._apps:
    raw = os.getenv("FIREBASE_CREDENTIALS_JSON")
    cred = (
        credentials.Certificate(json.loads(raw))
        if raw
        else credentials.ApplicationDefault()
    )
    firebase_admin.initialize_app(cred, {"projectId": "madhu-ai"})