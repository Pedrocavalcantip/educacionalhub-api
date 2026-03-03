from pydantic import BaseModel, HttpUrl, Field, field_validator
from typing import Optional, List
import enum
import unicodedata


class ResourceType(str, enum.Enum):
    VIDEO = "Vídeo"
    PDF = "PDF"
    LINK = "Link"


def normalizar_tipo(v: str) -> str:
    if not isinstance(v, str):
        return v

    limpo = (
        unicodedata.normalize("NFKD", v)
        .encode("ASCII", "ignore")
        .decode("utf-8")
        .lower()
        .strip()
    )

    if limpo in ["video", "v", "vid"]:
        return ResourceType.VIDEO.value
    elif limpo in ["pdf", "p"]:
        return ResourceType.PDF.value
    elif limpo in ["link", "l", "url"]:
        return ResourceType.LINK.value

    return v


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


class SmartAssistRequest(BaseModel):
    title: str
    resource_type: ResourceType

    @field_validator("resource_type", mode="before")
    @classmethod
    def normalize_resource_type(cls, v):
        return normalizar_tipo(v)


class SmartAssistResponse(BaseModel):
    description: str
    tags: List[str]
