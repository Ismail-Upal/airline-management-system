from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.settings import settings
from app.database import engine, Base
from app.routers import auth, flight, booking

# Create Tables (for simplicity in MVP, usually use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# CORS Setup for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, set to [settings.FRONTEND_URL]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(flight.router)
app.include_router(booking.router)

@app.get("/")
def read_root():
    return {"message": "SkyLink Airlines API is running"}
