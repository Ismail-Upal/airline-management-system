from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.flight import Flight
from app.schemas.flight import FlightOut, FlightCreate
from typing import List

router = APIRouter()
@router.get("/", response_model=List[FlightOut])
def get_flights(origin: str = None, destination: str = None, db: Session = Depends(get_db)):
    query = db.query(Flight)
    if origin:
        query = query.filter(Flight.origin == origin)
    if destination:
        query = query.filter(Flight.destination == destination)
    return query.all()

@router.post("/", response_model=FlightOut)
def create_flight(flight: FlightCreate, db: Session = Depends(get_db)):
    # Initialize available seats to total seats
    db_flight = Flight(**flight.dict(), available_seats=flight.total_seats)
    db.add(db_flight)
    db.commit()
    db.refresh(db_flight)
    return db_flight
