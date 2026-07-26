import os
import asyncio
from dotenv import load_dotenv
load_dotenv()
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

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

async def test_email():
    message = MessageSchema(
        subject="Test Email",
        recipients=["aroma.eovs@gmail.com"],
        body="This is a test email.",
        subtype="plain"
    )
    try:
        await fastmail.send_message(message)
        print("SUCCESS")
    except Exception as e:
        print("ERROR:", str(e))

if __name__ == "__main__":
    asyncio.run(test_email())
