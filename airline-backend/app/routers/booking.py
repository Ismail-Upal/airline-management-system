from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter()

@router.post("/")
def create_booking(booking_data: dict, db: Session = Depends(get_db)):
    return {"message": "Booking successful", "details": booking_data}

@router.get("/my-bookings")
def get_user_bookings(db: Session = Depends(get_db)):
    return []
