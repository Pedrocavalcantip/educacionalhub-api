import enum
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base
from sqlalchemy import String, Text, Enum
from sqlalchemy.dialects.postgresql import ARRAY


class ResourceType(str, enum.Enum):
    VIDEO = "Vídeo"
    PDF = "PDF"
    LINK = "Link"


class Resource(Base):
    __tablename__ = "resources"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    type: Mapped[ResourceType] = mapped_column(Enum(ResourceType), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    tags: Mapped[list[str]] = mapped_column(
        ARRAY(String), nullable=True
    )  # ARRAY nativo do Postgres
