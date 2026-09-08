from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth


security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Missing Firebase ID token",
        )

    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token

    except Exception as e:
        print(
            f"Firebase token verification failed: "
            f"{type(e).__name__}: {e}"
        )

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired Firebase ID token",
        )