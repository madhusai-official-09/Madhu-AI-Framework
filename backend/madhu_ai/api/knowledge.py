from fastapi import APIRouter, Depends, HTTPException, Query

from .auth import get_current_user
from ..memory.projects import ProjectStore
from ..vectorstores.chroma_store import ChromaStore


router = APIRouter(prefix="/knowledge", tags=["Knowledge"])


def _check_owner(project_id: str, user_id: str):
    if not ProjectStore().belongs_to_user(project_id, user_id):
        raise HTTPException(
            status_code=403,
            detail="Project not found or access denied",
        )


@router.get("")
def list_files(
    project_id: str = Query(...),
    current_user=Depends(get_current_user),
):
    _check_owner(project_id, current_user["uid"])
    return ChromaStore.list_documents(project_id)


@router.delete("/{filename}")
def delete_file(
    filename: str,
    project_id: str = Query(...),
    current_user=Depends(get_current_user),
):
    _check_owner(project_id, current_user["uid"])
    ChromaStore.delete_document(project_id, filename)
    return {"success": True}