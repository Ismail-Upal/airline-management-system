import hashlib
from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext
from app.core.settings import settings

# Use SHA256 to pre-hash passwords before bcrypt (avoids 72-byte limit)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _hash_password_sha256(password: str) -> str:
    """Pre-hash password with SHA256 to avoid bcrypt's 72-byte limit"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password, hashed_password):
    # Pre-hash the plain password with SHA256, then verify with bcrypt
    sha256_hash = _hash_password_sha256(plain_password)
    return pwd_context.verify(sha256_hash, hashed_password)

def get_password_hash(password):
    # First hash with SHA256, then bcrypt
    sha256_hash = _hash_password_sha256(password)
    return pwd_context.hash(sha256_hash)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
