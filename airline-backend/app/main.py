from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.core.settings import settings

# Corrected Imports using the __init__.py setup
from app.routers import auth_router, flight_router, booking_router

# Create Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SkyLink Airlines")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For testing; replace with settings.FRONTEND_URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(flight_router, prefix="/flights", tags=["Flights"])
app.include_router(booking_router, prefix="/bookings", tags=["Bookings"])

@app.get("/")
def root():
    return {"status": "SkyLink API is online"}
