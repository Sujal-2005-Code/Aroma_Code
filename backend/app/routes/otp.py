from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from app.database.otp_db import verify_otp
from app.utils.email import send_otp_email

router = APIRouter()


class SendOTPRequest(BaseModel):
    email: EmailStr
    purpose: str = "email_verification"


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str
    purpose: str = "email_verification"


@router.post("/send-otp")
async def send_otp(request: SendOTPRequest):
    """
    Send OTP to user's email for verification.
    
    Purpose options:
    - email_verification: For email verification during registration
    - password_reset: For password reset functionality
    """
    if request.purpose not in ["email_verification", "password_reset"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid purpose. Must be 'email_verification' or 'password_reset'"
        )
    
    otp_code = await send_otp_email(request.email, request.purpose)
    
    if not otp_code:
        raise HTTPException(
            status_code=503,
            detail="Unable to deliver the verification email. Please try again later."
        )
    
    return {
        "message": "OTP sent successfully",
        "purpose": request.purpose
    }


@router.post("/verify-otp")
def verify_otp_endpoint(request: VerifyOTPRequest):
    """
    Verify OTP code provided by user.
    
    Purpose options:
    - email_verification: For email verification during registration
    - password_reset: For password reset functionality
    """
    if request.purpose not in ["email_verification", "password_reset"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid purpose. Must be 'email_verification' or 'password_reset'"
        )
    
    is_valid = verify_otp(request.email, request.otp, request.purpose)
    
    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired OTP"
        )
    
    return {
        "message": "OTP verified successfully",
        "purpose": request.purpose
    }
