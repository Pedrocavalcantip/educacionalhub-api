from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud, schemas
from .database import SessionLocal
from .service_ia import generate_smart_description

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
