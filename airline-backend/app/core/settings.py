import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SkyLink Airlines"
    
    # SECURITY WARNING: Store these in Render Environment Variables!
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost/dbname") 
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-this")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Frontend URL for password reset links and CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "https://airline-frontend2.onrender.com")
    
    # SMTP settings for password reset emails
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "no-reply@skylink.com")
    SMTP_USE_TLS: bool = os.getenv("SMTP_USE_TLS", "true").lower() == "true"
    
    class Config:
        env_file = ".env"

settings = Settings()
