import hashlib
import bcrypt
from datetime import datetime, timedelta, timezone
from jose import jwt
from app.core.settings import settings

def _hash_password_sha256(password: str) -> str:
    """Pre-hash password with SHA256 to avoid bcrypt's 72-byte limit"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a bcrypt hash"""
    try:
        # Pre-hash with SHA256
        sha256_hash = _hash_password_sha256(plain_password)
        # Verify with bcrypt
        return bcrypt.checkpw(sha256_hash.encode(), hashed_password.encode())
    except Exception as e:
        print(f"Password verification error: {e}")
        return False

def get_password_hash(password: str) -> str:
    """Hash a password with SHA256 + bcrypt"""
    try:
        # Pre-hash with SHA256
        sha256_hash = _hash_password_sha256(password)
        # Hash with bcrypt
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(sha256_hash.encode(), salt)
        return hashed.decode()
    except Exception as e:
        print(f"Password hashing error: {e}")
        raise

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
