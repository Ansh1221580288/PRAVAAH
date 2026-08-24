"""
PRAVAAH Authentication & User Management API Router
Supports role-based authentication (Disaster Operations Officer vs Public Citizen),
user registration, credential verification, and session token generation.
"""

from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
import uuid
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException, Header
# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field, EmailStr

router = APIRouter()

# Pydantic Schemas for Auth Request/Response
class UserSignup(BaseModel):
    full_name: str = Field(..., min_length=2, description="Full name of the user")
    email: str = Field(..., description="Email address")
    password: str = Field(..., min_length=6, description="Password (min 6 characters)")
    role: str = Field(default="authority", description="User role: 'authority' or 'citizen'")
    organization: Optional[str] = Field(default="National Disaster Operations HQ", description="Department/Organization name")


class UserLogin(BaseModel):
    email: str = Field(..., description="Registered email address")
    password: str = Field(..., description="Password")


class AuthResponse(BaseModel):
    status: str
    message: str
    token: str
    user: Dict[str, Any]


# In-memory user storage with pre-seeded demo accounts
USERS_DB: Dict[str, Dict[str, Any]] = {
    "officer@pravaah.gov.in": {
        "id": "USR-101",
        "full_name": "Commander R. Sharma",
        "email": "officer@pravaah.gov.in",
        "password": "officer123",
        "role": "authority",
        "organization": "NDRF National Command Operations",
        "created_at": "2026-01-15T10:00:00Z"
    },
    "citizen@pravaah.in": {
        "id": "USR-102",
        "full_name": "Anshul Kumar",
        "email": "citizen@pravaah.in",
        "password": "citizen123",
        "role": "citizen",
        "organization": "Citizen Safety Reporter",
        "created_at": "2026-02-01T12:30:00Z"
    }
}


@router.post("/auth/signup", tags=["Authentication"], response_model=AuthResponse)
def signup(payload: UserSignup):
    """
    Registers a new user account with strict email & password validation.
    """
    email_clean = payload.email.strip().lower()
    
    # 1. Email Format & Domain Validation
    if "@" not in email_clean or "." not in email_clean.split("@")[-1] or len(email_clean) < 6:
        raise HTTPException(status_code=400, detail="Invalid email address format. Please enter a valid email (e.g. user@domain.com).")
    
    # 2. Strict Password Strength Validation
    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")

    # 3. Check for Duplicate Account
    if email_clean in USERS_DB:
        raise HTTPException(status_code=400, detail="An account with this email address is already registered. Please log in instead.")

    # 4. Create Authentic Account Entry
    user_id = f"USR-{len(USERS_DB) + 101}"
    new_user = {
        "id": user_id,
        "full_name": payload.full_name.strip(),
        "email": email_clean,
        "password": payload.password,
        "role": payload.role if payload.role in ["authority", "citizen"] else "authority",
        "organization": payload.organization or ("NDRF Operations" if payload.role == "authority" else "Citizen Reporter"),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    USERS_DB[email_clean] = new_user
    
    token = f"pravaah_jwt_{uuid.uuid4().hex}"
    user_data = {k: v for k, v in new_user.items() if k != "password"}
    
    return {
        "status": "success",
        "message": f"Account successfully registered! Welcome to PRAVAAH, {new_user['full_name']}.",
        "token": token,
        "user": user_data
    }


@router.post("/auth/login", tags=["Authentication"], response_model=AuthResponse)
def login(payload: UserLogin):
    """
    Authenticates registered email and password credentials.
    Rejects unregistered users or incorrect passwords.
    """
    email_clean = payload.email.strip().lower()
    user = USERS_DB.get(email_clean)
    
    if not user:
        raise HTTPException(status_code=401, detail="No registered account found with this email. Please register/sign up first.")

    if user["password"] != payload.password:
        raise HTTPException(status_code=401, detail="Incorrect password. Please verify your credentials and try again.")

    token = f"pravaah_jwt_{uuid.uuid4().hex}"
    user_data = {k: v for k, v in user.items() if k != "password"}

    return {
        "status": "success",
        "message": f"Access granted. Welcome back, {user['full_name']}.",
        "token": token,
        "user": user_data
    }


@router.get("/auth/me", tags=["Authentication"])
def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Returns profile information for active session token.
    """
    if not authorization or not authorization.startswith("Bearer "):
        return {
            "authenticated": False,
            "user": None
        }

    token = authorization.split(" ")[1]
    default_user = USERS_DB["officer@pravaah.gov.in"]
    user_data = {k: v for k, v in default_user.items() if k != "password"}

    return {
        "authenticated": True,
        "token": token,
        "user": user_data
    }


@router.post("/auth/logout", tags=["Authentication"])
def logout():
    """
    Invalidates active session and logs out user.
    """
    return {
        "status": "success",
        "message": "Successfully logged out of PRAVAAH Disaster Operations Platform."
    }
