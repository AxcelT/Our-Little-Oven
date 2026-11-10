from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.routes import auth, health

FRONTEND_DIR = Path(__file__).resolve().parents[2] / "frontend"

app = FastAPI(title="Our Little Oven")

app.include_router(health.router)
app.include_router(auth.router)

# Mounted last so /api/* routes win.
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
