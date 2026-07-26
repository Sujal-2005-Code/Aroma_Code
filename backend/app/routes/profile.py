from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.database.db import db
from app.dependencies.auth import get_current_user
from app.utils.security import hash_password, verify_password

router = APIRouter()


def get_users_collection():

    if db is None:
        return None

    return db["users"]


class UpdateProfileRequest(BaseModel):

    full_name: str


class ChangePasswordRequest(BaseModel):

    old_password: str

    new_password: str


@router.get("/profile")
def get_profile(
    current_user=Depends(get_current_user)
):

    users = get_users_collection()

    user = users.find_one({

        "email": current_user["email"]

    })

    if user is None:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {

        "full_name": user["full_name"],

        "email": user["email"],

        "role": user["role"]
    }


@router.put("/profile")
def update_profile(

    request: UpdateProfileRequest,

    current_user=Depends(get_current_user)

):

    users = get_users_collection()

    users.update_one(

        {

            "email": current_user["email"]

        },

        {

            "$set": {

                "full_name": request.full_name

            }

        }

    )

    return {

        "message": "Profile updated successfully"

    }


@router.put("/change-password")
def change_password(

    request: ChangePasswordRequest,

    current_user=Depends(get_current_user)

):

    users = get_users_collection()

    user = users.find_one({

        "email": current_user["email"]

    })

    if not verify_password(

        request.old_password,

        user["password"]

    ):

        raise HTTPException(

            status_code=400,

            detail="Old password incorrect"

        )

    users.update_one(

        {

            "_id": user["_id"]

        },

        {

            "$set": {

                "password": hash_password(

                    request.new_password

                )

            }

        }

    )

    return {

        "message": "Password changed successfully"

    }