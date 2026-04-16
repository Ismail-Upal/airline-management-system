# app/routers/auth.py
from typing import Optional
import logging
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.database import get_db
from app.models.user import User
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user
)
from app.core.settings import settings
from app.utils.email import send_reset_email
from app.schemas.user import UpdateProfileSchema

logger = logging.getLogger(__name__)
router = APIRouter()

# =========================
# SCHEMAS
# =========================
class RegisterSchema(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: Optional[str] = "passenger"        # "passenger" | "staff"
    employee_id: Optional[str] = None        # Required if role == "staff"

class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    token: str
    password: str

# Reset password token settings
RESET_TOKEN_EXPIRE_MINUTES = 30

def create_reset_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "reset"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def verify_reset_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        token_type = payload.get("type")
        email: str = payload.get("sub")
        if token_type != "reset" or not email:
            raise HTTPException(status_code=400, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

# =========================
# REGISTER
# =========================
@router.post("/register", status_code=201)
def register(user_data: RegisterSchema, db: Session = Depends(get_db)):
    try:
        logger.info(f"Registration attempt for email: {user_data.email}, role: {user_data.role}")

        # ── Block admin registration from this site ─────────────────
        if user_data.role == "admin":
            raise HTTPException(
                status_code=403,
                detail="Admin accounts cannot be created here. Use the Admin Portal."
            )

        # ── Validate role value ─────────────────────────────────────
        allowed_roles = ["passenger", "staff"]
        if user_data.role not in allowed_roles:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid role. Allowed: {', '.join(allowed_roles)}"
            )

        # ── Staff must provide employee_id ──────────────────────────
        if user_data.role == "staff":
            if not user_data.employee_id or not user_data.employee_id.strip():
                raise HTTPException(
                    status_code=400,
                    detail="Employee ID is required for staff accounts"
                )
            # Check employee_id uniqueness
            existing_emp = db.query(User).filter(
                User.employee_id == user_data.employee_id.upper()
            ).first()
            if existing_emp:
                raise HTTPException(
                    status_code=400,
                    detail="This Employee ID is already registered"
                )

        # ── Check email uniqueness ──────────────────────────────────
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            logger.warning(f"Email already registered: {user_data.email}")
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_pwd = get_password_hash(user_data.password)
        new_user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hashed_pwd,
            role=user_data.role,
            employee_id=user_data.employee_id.upper() if user_data.employee_id else None,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        logger.info(f"User registered successfully: {user_data.email} as {user_data.role}")
        return {"message": "User created successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

# =========================
# LOGIN
# =========================
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    try:
        logger.info(f"Login attempt for: {form_data.username}")
        user = db.query(User).filter(User.email == form_data.username).first()

        if not user:
            logger.warning(f"User not found: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

        # ── Block admin login from this site ────────────────────────
        if user.role == "admin":
            raise HTTPException(
                status_code=403,
                detail="Admin accounts must sign in through the Admin Portal."
            )

        # ── Block inactive accounts ─────────────────────────────────
        if not user.is_active:
            raise HTTPException(
                status_code=403,
                detail="This account has been deactivated. Contact support."
            )

        logger.info(f"User found: {user.email}, checking password...")
        password_valid = verify_password(form_data.password, user.hashed_password)
        logger.info(f"Password valid: {password_valid}")

        if not password_valid:
            logger.warning(f"Invalid password for user: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

        # ── Create JWT with role, full_name, employee_id ────────────
        access_token = create_access_token(data={
            "sub":         user.email,
            "role":        user.role,
            "full_name":   user.full_name or "",
            "employee_id": user.employee_id or "",
            "user_id":     user.id,
        })

        logger.info(f"Login successful for: {user.email} ({user.role})")
        return {
            "access_token": access_token,
            "token_type":   "bearer",
            "role":         user.role,        # ← frontend uses this to redirect
            "full_name":    user.full_name,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

# =========================
# FORGOT PASSWORD
# =========================
@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordSchema, db: Session = Depends(get_db)):
    try:
        logger.info(f"Password reset request for: {data.email}")
        user = db.query(User).filter(User.email == data.email).first()

        if not user:
            logger.warning(f"Reset requested for non-existent email: {data.email}")
            return {"message": "If an account exists, a reset link has been sent to your email"}

        reset_token = create_reset_token({"sub": user.email})
        reset_link = f"{settings.FRONTEND_URL}/#/reset-password?token={reset_token}"

        if not settings.SMTP_HOST:
            logger.warning("SMTP_HOST not set; cannot send reset email")
            logger.info(f"Password reset link for {data.email}: {reset_link}")
            return {"message": "Reset link generated", "reset_link": reset_link}
        else:
            email_sent = send_reset_email(data.email, reset_link)
            if email_sent:
                logger.info(f"Password reset email sent to {data.email}")
                return {"message": "If an account exists, a reset link has been sent to your email"}
            else:
                logger.warning(f"Email failed; reset link returned in response: {reset_link}")
                return {"message": "Email delivery failed, but reset link is below", "reset_link": reset_link}

    except Exception as e:
        logger.error(f"Forgot password error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to process reset request")

# =========================
# RESET PASSWORD
# =========================
@router.post("/reset-password")
def reset_password(data: ResetPasswordSchema, db: Session = Depends(get_db)):
    try:
        logger.info("Password reset attempt")
        email = verify_reset_token(data.token)

        user = db.query(User).filter(User.email == email).first()
        if not user:
            logger.warning(f"User not found for reset: {email}")
            raise HTTPException(status_code=404, detail="User not found")

        hashed_pwd = get_password_hash(data.password)
        user.hashed_password = hashed_pwd
        db.commit()

        logger.info(f"Password reset successful for: {email}")
        return {"message": "Password reset successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Reset password error: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to reset password")

# =========================
# UPDATE PROFILE
# =========================
@router.put("/users/{user_id}")
def update_user_profile(
    user_id: int,
    profile_data: UpdateProfileSchema,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update user profile (full_name, phone, nationality)
    Users can only update their own profile
    """
    try:
        logger.info(f"Profile update request for user_id: {user_id}")
        
        # ── Security: User can only update their own profile ──────────
        if current_user["user_id"] != user_id:
            logger.warning(f"Unauthorized profile update attempt by user {current_user['user_id']} for user {user_id}")
            raise HTTPException(
                status_code=403,
                detail="Not authorized to update this profile"
            )
        
        # ── Find user ───────────────────────────────────────────────
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            logger.warning(f"User not found for profile update: {user_id}")
            raise HTTPException(status_code=404, detail="User not found")
        
        # ── Update fields ───────────────────────────────────────────
        if profile_data.full_name is not None:
            user.full_name = profile_data.full_name
        if profile_data.phone is not None:
            user.phone = profile_data.phone
        if profile_data.nationality is not None:
            user.nationality = profile_data.nationality
        
        db.commit()
        db.refresh(user)
        
        logger.info(f"Profile updated successfully for user: {user_id}")
        
        return {
            "message": "Profile updated successfully",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "phone": user.phone,
                "nationality": user.nationality,
                "role": user.role,
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Profile update error: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update profile")
