from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from . import crud, schemas
from .database import SessionLocal
from .service_ia import generate_smart_description
import os
import shutil
from datetime import datetime

router = APIRouter(prefix="/resources", tags=["Resources"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=schemas.ResourceResponse)
def create(resource: schemas.ResourceCreate, db: Session = Depends(get_db)):
    return crud.create_resource(db, resource)


@router.get("/", response_model=list[schemas.ResourceResponse])
def read_all(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_resources(db, skip, limit)


@router.get("/{resource_id}", response_model=schemas.ResourceResponse)
def read_one(resource_id: int, db: Session = Depends(get_db)):
    db_resource = crud.get_resource(db, resource_id)
    if not db_resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return db_resource


@router.put("/{resource_id}", response_model=schemas.ResourceResponse)
def update(
    resource_id: int, resource: schemas.ResourceUpdate, db: Session = Depends(get_db)
):
    db_resource = crud.update_resource(db, resource_id, resource)
    if not db_resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return db_resource


@router.delete("/{resource_id}")
def delete(resource_id: int, db: Session = Depends(get_db)):
    db_resource = crud.delete_resource(db, resource_id)
    if not db_resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return {"message": "Deleted successfully"}


@router.post("/smart-assist", response_model=schemas.SmartAssistResponse)
async def smart_assist(data: schemas.SmartAssistRequest):
    try:
        result = await generate_smart_description(
            title=data.title, resource_type=data.type.value
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.content_type == "application/pdf":
        raise HTTPException(
            status_code=400, detail="Apenas arquivos PDF são permitidos"
        )

    MAX_FILE_SIZE = 10 * 1024 * 1024  
    file_content = await file.read()
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400, detail="Arquivo muito grande. Máximo: 10MB"
        )

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    original_filename = file.filename.replace(" ", "_")
    unique_filename = f"{timestamp}_{original_filename}"

    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, unique_filename)
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)

        return {
            "filename": unique_filename,
            "original_filename": file.filename,
            "file_path": file_path,
            "size": len(file_content),
            "message": "PDF enviado com sucesso!",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erro ao salvar arquivo: {str(e)}"
        )
