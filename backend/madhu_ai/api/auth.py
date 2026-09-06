from fastapi import Header, HTTPException
from firebase_admin import auth


def get_current_user(authorization: str | None = Header(default=None)):
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Missing Authorization header",
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid Authorization header",
        )

    token = authorization.split("Bearer ", 1)[1].strip()

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Missing Firebase ID token",
        )

    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token

    except Exception as e:
        print(f"Firebase token verification failed: {type(e).__name__}: {e}")

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired Firebase ID token",
        )