from fastapi import FastAPI
from app import models
from app.database import engine
from app.routes import router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Recursos educacionais API",
    description="API para gerenciamento de recursos educacionais",
)

app.include_router(router)


@app.get("/")
def root():
    return {"message": "API Working"}


@app.get("/health")
def health():
    return {"status": "ok"}
