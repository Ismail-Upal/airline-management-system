from datetime import date, datetime, time
from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy import asc, desc, func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.flight import Flight
from app.schemas.flight import FlightOut, FlightCreate

router = APIRouter()


@router.get("/", response_model=List[FlightOut])
def get_flights(
    origin: Optional[str] = None,
    destination: Optional[str] = None,
    date: Optional[date] = None,
    sort_by: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Flight)

    if origin:
        query = query.filter(func.lower(Flight.origin).contains(origin.strip().lower()))

    if destination:
        query = query.filter(
            func.lower(Flight.destination).contains(destination.strip().lower())
        )

    if date:
        start_of_day = datetime.combine(date, time.min)
        end_of_day = datetime.combine(date, time.max)
        query = query.filter(
            Flight.departure_time >= start_of_day,
            Flight.departure_time <= end_of_day,
        )

    if sort_by == "priceLowHigh":
        query = query.order_by(asc(Flight.price))
    elif sort_by == "priceHighLow":
        query = query.order_by(desc(Flight.price))
    elif sort_by == "seatsHighLow":
        query = query.order_by(desc(Flight.available_seats))
    else:
        query = query.order_by(asc(Flight.departure_time))

    return query.all()


@router.post("/", response_model=FlightOut)
def create_flight(flight: FlightCreate, db: Session = Depends(get_db)):
    db_flight = Flight(**flight.dict(), available_seats=flight.total_seats)
    db.add(db_flight)
    db.commit()
    db.refresh(db_flight)
    return db_flight
