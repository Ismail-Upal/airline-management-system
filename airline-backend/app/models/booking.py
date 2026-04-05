from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    flight_id = Column(Integer, ForeignKey("flights.id"), nullable=False)

    booking_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(String, default="Confirmed")
    seat_number = Column(String, nullable=True)

    baggage_count = Column(Integer, default=0)
    check_in_status = Column(String, default="Not Checked In")

    user = relationship("User")
    flight = relationship("Flight")
