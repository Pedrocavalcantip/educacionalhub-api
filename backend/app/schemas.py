from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, List
import enum

class ResourceType(str, enum.Enum):
    VIDEO = "Vídeo"
    PDF = "PDF"
    LINK = "Link"

class ResourceBase(BaseModel):
    title: str
    description: Optional[str] = None
    type: ResourceType
    url: HttpUrl
    tags: Optional[List[str]] = Field(default_factory=list)

class ResourceCreate(ResourceBase):
    pass

class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[ResourceType] = None
    url: Optional[HttpUrl] = None
    tags: Optional[List[str]] = None

class ResourceResponse(ResourceBase):
    id: int

    class Config:
        from_attributes = True