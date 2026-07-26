from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from typing import List
import logging
import os
from dotenv import load_dotenv
from app.database.otp_db import create_otp, delete_otp

load_dotenv()

email_config = ConnectionConfig(
    MAIL_USERNAME=os.getenv("SMTP_USERNAME"),
    MAIL_PASSWORD=os.getenv("SMTP_PASSWORD"),
    MAIL_FROM=os.getenv("EMAIL_FROM"),
    MAIL_PORT=int(os.getenv("SMTP_PORT", 587)),
    MAIL_SERVER=os.getenv("SMTP_HOST"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fastmail = FastMail(email_config)
logger = logging.getLogger(__name__)


async def send_email(
    subject: str,
    email_to: EmailStr,
    body: str,
    html_body: str = None
):
    """
    Send an email using SMTP configuration.
    
    Args:
        subject: Email subject line
        email_to: Recipient email address
        body: Plain text body content
        html_body: Optional HTML body content
    """
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=body,
        subtype="plain"
    )
    
    if html_body:
        message = MessageSchema(
            subject=subject,
            recipients=[email_to],
            body=html_body,
            subtype="html"
        )
    
    await fastmail.send_message(message)


async def send_welcome_email(email_to: EmailStr, full_name: str):
    """
    Send welcome email to new users.
    """
    subject = "Welcome to AROMA!"
    body = f"""
    Hello {full_name},
    
    Welcome to AROMA - AI Powered Talent Intelligence Platform!
    
    We're excited to have you on board. AROMA helps bridge the gap between 
    students and recruiters with AI-powered skill verification, career mentoring, 
    and smart hiring tools.
    
    If you have any questions, feel free to reach out to our support team.
    
    Best regards,
    The AROMA Team
    """
    
    html_body = f"""
    <html>
    <body>
        <h2>Welcome to AROMA!</h2>
        <p>Hello {full_name},</p>
        <p>Welcome to AROMA - AI Powered Talent Intelligence Platform!</p>
        <p>We're excited to have you on board. AROMA helps bridge the gap between 
        students and recruiters with AI-powered skill verification, career mentoring, 
        and smart hiring tools.</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The AROMA Team</p>
    </body>
    </html>
    """
    
    await send_email(subject, email_to, body, html_body)


async def send_password_reset_email(email_to: EmailStr, reset_token: str):
    """
    Send password reset email with token.
    """
    subject = "Password Reset Request"
    body = f"""
    You requested a password reset for your AROMA account.
    
    Your reset token is: {reset_token}
    
    If you did not request this, please ignore this email.
    """
    
    html_body = f"""
    <html>
    <body>
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your AROMA account.</p>
        <p><strong>Your reset token is: {reset_token}</strong></p>
        <p>If you did not request this, please ignore this email.</p>
    </body>
    </html>
    """
    
    await send_email(subject, email_to, body, html_body)


async def send_otp_email(email_to: EmailStr, purpose: str = "email_verification") -> str:
    """
    Generate and send OTP to user's email.
    
    Args:
        email_to: Recipient email address
        purpose: Purpose of the OTP (email_verification, password_reset, etc.)
        
    Returns:
        OTP code if successful, None otherwise
    """
    otp_code = create_otp(email_to, purpose)
    
    if not otp_code:
        return None
    
    if purpose == "email_verification":
        subject = "Verify Your Email - AROMA"
        body = f"""
        Your verification code is: {otp_code}
        
        This code will expire in 10 minutes.
        
        If you did not request this, please ignore this email.
        """
        
        html_body = f"""
        <html>
        <body>
            <h2>Verify Your Email</h2>
            <p>Your verification code is: <strong>{otp_code}</strong></p>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
        </body>
        </html>
        """
    elif purpose == "password_reset":
        subject = "Password Reset OTP - AROMA"
        body = f"""
        Your password reset code is: {otp_code}
        
        This code will expire in 10 minutes.
        
        If you did not request this, please ignore this email.
        """
        
        html_body = f"""
        <html>
        <body>
            <h2>Password Reset OTP</h2>
            <p>Your password reset code is: <strong>{otp_code}</strong></p>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
        </body>
        </html>
        """
    else:
        subject = "Your Verification Code - AROMA"
        body = f"""
        Your verification code is: {otp_code}
        
        This code will expire in 10 minutes.
        """
        
        html_body = f"""
        <html>
        <body>
            <h2>Your Verification Code</h2>
            <p>Your verification code is: <strong>{otp_code}</strong></p>
            <p>This code will expire in 10 minutes.</p>
        </body>
        </html>
        """
    
    try:
        await send_email(subject, email_to, body, html_body)
    except Exception as e:
        # Do not retain a code that the user never received.
        delete_otp(email_to, otp_code, purpose)
        print(f"FAILED TO DELIVER EMAIL: {str(e)}")
        import traceback
        traceback.print_exc()
        logger.exception(f"Failed to deliver OTP email: {str(e)}")
        return None

    return otp_code
