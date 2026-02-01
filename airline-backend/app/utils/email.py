import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.settings import settings


def send_reset_email(to_email: str, reset_link: str) -> None:
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

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        if settings.SMTP_USE_TLS:
            server.starttls()
        if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.send_message(msg)
