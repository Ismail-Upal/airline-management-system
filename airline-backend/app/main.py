from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.core.settings import settings

# Corrected Imports
from app.routers import auth_router, flight_router, booking_router

# --- DATABASE RESET LOGIC ---
# This line deletes the old, broken tables (Fixes the 500 Error)
Base.metadata.drop_all(bind=engine) 

# This creates the new tables with the correct 'full_name' column
Base.metadata.create_all(bind=engine)
# ----------------------------

app = FastAPI(title="SkyLink Airlines")

# --- CORS CONFIGURATION ---
# Wildcards ("*") do not work with allow_credentials=True. 
# We must use explicit URLs.
origins = [
    "https://airline-frontend2.onrender.com", # Your Production Frontend
    "http://localhost:5173",                  # Vite/React Local
    "http://localhost:3000",                  # Create-React-App Local
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTER REGISTRATION ---
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(flight_router, prefix="/flights", tags=["Flights"])
app.include_router(booking_router, prefix="/bookings", tags=["Bookings"])

@app.get("/")
def root():
    return {"status": "SkyLink API is online"}
