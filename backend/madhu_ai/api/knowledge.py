from fastapi import APIRouter, Depends
from pathlib import Path

from .auth import get_current_user

router = APIRouter(prefix="/knowledge", tags=["Knowledge"])


@router.get("/")
def list_files(current_user=Depends(get_current_user)):
    folder = Path("knowledge")

    folder.mkdir(exist_ok=True)

    return [
        {
            "name": f.name,
            "size": f.stat().st_size,
        }
        for f in folder.iterdir()
        if f.is_file()
    ]


@router.delete("/{filename}")
def delete_file(
    filename: str,
    current_user=Depends(get_current_user),
):
    path = Path("knowledge") / filename

    if path.exists():
        path.unlink()

    return {
        "success": True
    }