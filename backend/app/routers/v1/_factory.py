"""CRUD router factory for PIC entities."""

from __future__ import annotations

from typing import Any, Optional, Type

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ...core import get_db
from ...core.db import Base
from ...services.crud import create_row, delete_row, get_row, list_rows, update_row


def make_router(
    *,
    prefix: str,
    tag: str,
    model: Type[Base],
    create_schema: Type[BaseModel],
    update_schema: Type[BaseModel],
    response_schema: Type[BaseModel],
    filter_fields: Optional[list[str]] = None,
) -> APIRouter:
    """Return an APIRouter with list / get / create / patch / delete endpoints."""

    router = APIRouter(prefix=prefix, tags=[tag])

    @router.get("", response_model=list[response_schema])  # type: ignore[valid-type]
    def list_items(
        skip: int = Query(0, ge=0),
        limit: int = Query(100, ge=1, le=1000),
        db: Session = Depends(get_db),
    ) -> list:
        return list_rows(db, model, skip=skip, limit=limit)

    @router.get("/{item_id}", response_model=response_schema)  # type: ignore[valid-type]
    def get_item(item_id: int, db: Session = Depends(get_db)) -> Any:
        return get_row(db, model, item_id)

    @router.post("", response_model=response_schema, status_code=201)  # type: ignore[valid-type]
    def create_item(body: create_schema, db: Session = Depends(get_db)) -> Any:  # type: ignore[valid-type]
        return create_row(db, model, body)

    @router.patch("/{item_id}", response_model=response_schema)  # type: ignore[valid-type]
    def update_item(item_id: int, body: update_schema, db: Session = Depends(get_db)) -> Any:  # type: ignore[valid-type]
        return update_row(db, model, item_id, body)

    @router.delete("/{item_id}", status_code=204)
    def delete_item(item_id: int, db: Session = Depends(get_db)) -> None:
        delete_row(db, model, item_id)

    return router
