from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app import models
from app.database import engine
from app.routes import router
from fastapi.middleware.cors import CORSMiddleware
import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Recursos educacionais API",
    description="API para gerenciamento de recursos educacionais",
)

app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

upload_dir = "uploads"
if not os.path.exists(upload_dir):
    os.makedirs(upload_dir)
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")


@app.get("/")
def root():
    return {"message": "API Working"}


@app.get("/health")
def health():
    return {"status": "ok"}
