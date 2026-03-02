from fastapi import FastAPI

app = FastAPI(title="EducacionalHub API")

@app.get("/")
def root():
    return {"message": "API is working!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}