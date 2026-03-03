from sqlalchemy.orm import Session
from . import models, schemas


def create_resource(db: Session, resource: schemas.ResourceCreate):
    resource_data = resource.model_dump()
    # Conveerter HttpUrl para string
    if "url" in resource_data and resource_data["url"] is not None:
        resource_data["url"] = str(resource_data["url"])
    db_resource = models.Resource(**resource_data)
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource


def get_resources(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Resource).offset(skip).limit(limit).all()


def get_resource(db: Session, resource_id: int):
    return db.query(models.Resource).filter(models.Resource.id == resource_id).first()


def update_resource(db: Session, resource_id: int, resource: schemas.ResourceUpdate):
    db_resource = get_resource(db, resource_id)
    if not db_resource:
        return None

    for key, value in resource.model_dump(exclude_unset=True).items():
        # Converter HttpUrl para string
        if key == "url" and value is not None:
            value = str(value)
        setattr(db_resource, key, value)

    db.commit()
    db.refresh(db_resource)
    return db_resource


def delete_resource(db: Session, resource_id: int):
    db_resource = get_resource(db, resource_id)
    if not db_resource:
        return None

    db.delete(db_resource)
    db.commit()
    return db_resource
