from fastapi import APIRouter
from pathlib import Path

router = APIRouter(prefix="/knowledge", tags=["Knowledge"])


@router.get("/")
def list_files():
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
def delete_file(filename: str):
    path = Path("knowledge") / filename

    if path.exists():
        path.unlink()

    return {
        "success": True
    }