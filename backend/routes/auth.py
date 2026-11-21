from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserLogin, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    # Look up user or allow demo user login
    user = db.query(User).filter(User.username == credentials.username).first()
    
    # If database has no users or for demo testing, auto-fallback to demo inspector
    if not user:
        if credentials.username in ["io_jaipur", "investigator", "admin", "demo"]:
            user = db.query(User).first()
            if not user:
                # Create demo user on the fly if needed
                user = User(
                    username="io_jaipur",
                    full_name="Insp. Vikram Rathore",
                    designation="Investigating Officer (IO), Cyber Crime PS",
                    department="Rajasthan Police Cyber Crime Police Station, Jaipur",
                    email="io.jaipur@police.rajasthan.gov.in",
                    password_hash="demo_password",
                    role="Investigator"
                )
                db.add(user)
                db.commit()
                db.refresh(user)
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid investigator credentials. Please use demo credentials."
            )

    return {
        "access_token": f"cybersutra-token-{user.id}-{user.username}",
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        user = User(
            username="io_jaipur",
            full_name="Insp. Vikram Rathore",
            designation="Investigating Officer (IO)",
            department="Rajasthan Police Cyber Crime Police Station, Jaipur",
            email="io.jaipur@police.rajasthan.gov.in",
            password_hash="demo_password",
            role="Investigator"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
