from pydantic import BaseModel, HttpUrl
from typing import Optional


class ResourceBase(BaseModel):
    title: str
    description: Optional[str] = None
    url: HttpUrl

class ResourceCreate(ResourceBase):
    pass

class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    url: Optional[HttpUrl] = None

class ResourceResponse(ResourceBase):
    id: int

    class Config:
        from_attributes = True