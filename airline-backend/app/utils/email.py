import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.settings import settings

logger = logging.getLogger(__name__)


def send_reset_email(to_email: str, reset_link: str) -> bool:
    """Send password reset email. Returns True if successful, False if failed."""
    try:
        subject = "Reset your SkyLink Airlines password"
        body = (
            "Hello,\n\n"
            "We received a request to reset your password. "
            "Click the link below to set a new password:\n\n"
            f"{reset_link}\n\n"
            "If you did not request this, you can safely ignore this email.\n\n"
            "Thanks,\nSkyLink Airlines"
        )

        msg = MIMEMultipart()
        msg["From"] = settings.SMTP_FROM_EMAIL
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            if settings.SMTP_USE_TLS:
                server.starttls()
            if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(msg)
        
        logger.info(f"Reset email sent successfully to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send reset email to {to_email}: {str(e)}")
        return False
