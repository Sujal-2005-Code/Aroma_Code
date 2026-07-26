from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from app.database.db import db
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter()


def get_users_collection():

    if db is None:
        return None

    return db["users"]


class RegisterRequest(BaseModel):

    full_name: str

    email: EmailStr

    password: str

    role: str = "student"


class LoginRequest(BaseModel):

    email: EmailStr

    password: str


@router.post("/register")
def register(request: RegisterRequest):

    if request.role not in {"student", "recruiter"}:
        raise HTTPException(
            status_code=400,
            detail="Only student and recruiter accounts can be self-registered"
        )

    users = get_users_collection()

    if users is None:
        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    existing = users.find_one(
        {"email": request.email}
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user = {

        "full_name": request.full_name,

        "email": request.email,

        "password": hash_password(
            request.password
        ),

        "role": request.role,

        "is_active": True
    }

    result = users.insert_one(user)

    return {

        "message": "Registration successful",

        "user_id": str(result.inserted_id)
    }



@router.post("/login")
def login(request: LoginRequest):

    users = get_users_collection()

    if users is None:

        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    user = users.find_one(
        {"email": request.email}
    )

    if user is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        request.password,
        user["password"]
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token({

        "user_id": str(user["_id"]),

        "email": user["email"],

        "role": user["role"]
    })

    return {

        "message": "Login successful",

        "access_token": token,

        "token_type": "bearer",

        "role": user["role"],

        "full_name": user["full_name"]
    }
