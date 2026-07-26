import random
import string
from datetime import datetime, timedelta
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

OTP_LENGTH = int(os.getenv("OTP_LENGTH", 6))
OTP_EXPIRY_MINUTES = int(os.getenv("OTP_EXPIRY_MINUTES", 10))


def generate_otp(length: int = OTP_LENGTH) -> str:
    """
    Generate a random numeric OTP.
    
    Args:
        length: Length of the OTP (default: 6)
        
    Returns:
        Random numeric OTP string
    """
    return ''.join(random.choices(string.digits, k=length))


def calculate_expiry_time(minutes: int = OTP_EXPIRY_MINUTES) -> datetime:
    """
    Calculate expiry time for OTP.
    
    Args:
        minutes: Minutes until expiry (default: 10)
        
    Returns:
        Datetime object representing expiry time
    """
    return datetime.utcnow() + timedelta(minutes=minutes)


def is_otp_expired(expiry_time: datetime) -> bool:
    """
    Check if OTP has expired.
    
    Args:
        expiry_time: Expiry datetime of the OTP
        
    Returns:
        True if expired, False otherwise
    """
    return datetime.utcnow() > expiry_time


def validate_otp_format(otp: str, length: int = OTP_LENGTH) -> bool:
    """
    Validate OTP format (numeric and correct length).
    
    Args:
        otp: OTP string to validate
        length: Expected length of OTP
        
    Returns:
        True if valid format, False otherwise
    """
    return otp.isdigit() and len(otp) == length
