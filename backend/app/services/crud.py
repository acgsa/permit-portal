"""Generic CRUD helpers used by all PIC v1 routers."""

from __future__ import annotations

from typing import Any, Optional, Type

from fastapi import HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..core.db import Base


def list_rows(
    db: Session,
    model: Type[Base],
    *,
    skip: int = 0,
    limit: int = 100,
    filters: Optional[dict[str, Any]] = None,
) -> list[Base]:
    q = db.query(model)
    if filters:
        for col, val in filters.items():
            if val is not None and hasattr(model, col):
                q = q.filter(getattr(model, col) == val)
    return q.order_by(model.id).offset(skip).limit(limit).all()


def get_row(db: Session, model: Type[Base], row_id: int) -> Base:
    row = db.query(model).filter(model.id == row_id).first()
    if not row:
        raise HTTPException(status_code=404, detail=f"{model.__tablename__} {row_id} not found")
    return row


def create_row(db: Session, model: Type[Base], data: BaseModel) -> Base:
    values = data.model_dump(exclude_unset=True)
    values.pop("id", None)
    row = model(**values)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_row(db: Session, model: Type[Base], row_id: int, data: BaseModel) -> Base:
    row = get_row(db, model, row_id)
    values = data.model_dump(exclude_unset=True)
    for k, v in values.items():
        setattr(row, k, v)
    db.commit()
    db.refresh(row)
    return row


def delete_row(db: Session, model: Type[Base], row_id: int) -> None:
    row = get_row(db, model, row_id)
    db.delete(row)
    db.commit()
