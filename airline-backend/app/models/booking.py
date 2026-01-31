from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    flight_id = Column(Integer, ForeignKey("flights.id"))
    booking_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(String, default="Confirmed")
    seat_number = Column(String)
    
    user = relationship("User")
    flight = relationship("Flight")
