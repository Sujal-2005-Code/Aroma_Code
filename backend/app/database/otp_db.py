from datetime import datetime
from app.database.db import db
from app.utils.otp import generate_otp, calculate_expiry_time
from typing import Optional


def get_otps_collection():
    """Get the OTPs collection from MongoDB."""
    if db is None:
        return None
    return db["otps"]


def create_otp(email: str, purpose: str = "email_verification") -> Optional[str]:
    """
    Create and store an OTP for a given email and purpose.
    
    Args:
        email: User's email address
        purpose: Purpose of the OTP (email_verification, password_reset, etc.)
        
    Returns:
        Generated OTP code if successful, None otherwise
    """
    otps = get_otps_collection()
    if otps is None:
        return None
    
    # Generate OTP
    otp_code = generate_otp()
    expiry_time = calculate_expiry_time()
    
    # Store OTP in database
    otp_doc = {
        "email": email,
        "otp": otp_code,
        "purpose": purpose,
        "created_at": datetime.utcnow(),
        "expires_at": expiry_time,
        "is_used": False
    }
    
    # Delete any existing unused OTPs for this email and purpose
    otps.delete_many({
        "email": email,
        "purpose": purpose,
        "is_used": False
    })
    
    # Insert new OTP
    otps.insert_one(otp_doc)
    
    return otp_code


def delete_otp(email: str, otp: str, purpose: str = "email_verification") -> None:
    """Remove a specific unused OTP when its email could not be delivered."""
    otps = get_otps_collection()
    if otps is None:
        return

    otps.delete_one({
        "email": email,
        "otp": otp,
        "purpose": purpose,
        "is_used": False,
    })


def verify_otp(email: str, otp: str, purpose: str = "email_verification") -> bool:
    """
    Verify an OTP for a given email and purpose.
    
    Args:
        email: User's email address
        otp: OTP code to verify
        purpose: Purpose of the OTP
        
    Returns:
        True if OTP is valid, False otherwise
    """
    otps = get_otps_collection()
    if otps is None:
        return False
    
    # Find matching OTP
    otp_doc = otps.find_one({
        "email": email,
        "otp": otp,
        "purpose": purpose,
        "is_used": False
    })
    
    if not otp_doc:
        return False
    
    # Check if OTP has expired
    if datetime.utcnow() > otp_doc["expires_at"]:
        # Delete expired OTP
        otps.delete_one({"_id": otp_doc["_id"]})
        return False
    
    # Mark OTP as used
    otps.update_one(
        {"_id": otp_doc["_id"]},
        {"$set": {"is_used": True}}
    )
    
    return True


def cleanup_expired_otps():
    """
    Clean up expired OTPs from the database.
    This should be called periodically (e.g., via a cron job).
    """
    otps = get_otps_collection()
    if otps is None:
        return
    
    otps.delete_many({
        "expires_at": {"$lt": datetime.utcnow()}
    })
