from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.utils.security import verify_access_token

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    payload = verify_access_token(credentials.credentials)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    return payload


def admin_required(
    current_user=Depends(get_current_user)
):

    if current_user["role"] != "admin":

        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user


def student_required(
    current_user=Depends(get_current_user)
):

    if current_user["role"] != "student":

        raise HTTPException(
            status_code=403,
            detail="Student access required"
        )

    return current_user


def recruiter_required(
    current_user=Depends(get_current_user)
):
    if current_user["role"] != "recruiter":
        raise HTTPException(
            status_code=403,
            detail="Recruiter access required"
        )
    return current_user
