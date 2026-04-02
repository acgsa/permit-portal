from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


class PreScreenerDraftUpsert(BaseModel):
    id: Optional[int] = None
    status: str = "draft"
    title: Optional[str] = None
    payload: dict[str, Any] = Field(default_factory=dict)


class PreScreenerDraftResponse(BaseModel):
    id: int
    owner_sub: str
    status: str
    title: str
    payload: dict[str, Any]
    created_at: datetime
    updated_at: datetime
