from fastapi import APIRouter, Depends, Query

from .auth import get_current_user
from ..memory.projects import ProjectStore
from ..vectorstores.chroma_store import ChromaStore


router = APIRouter(prefix="/knowledge", tags=["Knowledge"])


@router.get("/")
def list_files(
    project_id: str = Query(...),
    current_user=Depends(get_current_user),
):
    if not ProjectStore().belongs_to_user(project_id, current_user["uid"]):
        return []

    return ChromaStore.list_documents(project_id)


@router.delete("/{filename}")
def delete_file(
    filename: str,
    project_id: str = Query(...),
    current_user=Depends(get_current_user),
):
    if not ProjectStore().belongs_to_user(project_id, current_user["uid"]):
        return {
            "success": False,
            "error": "Project not found.",
        }

    ChromaStore.delete_document(project_id, filename)

    return {
        "success": True,
    }