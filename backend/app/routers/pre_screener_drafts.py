import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core import decode_token, get_db
from ..models import PreScreenerDraft
from ..schemas import PreScreenerDraftResponse, PreScreenerDraftUpsert

router = APIRouter(prefix="/pre-screener-drafts", tags=["pre-screener-drafts"])


def _serialize(row: PreScreenerDraft) -> PreScreenerDraftResponse:
    return PreScreenerDraftResponse(
        id=row.id,
        owner_sub=row.owner_sub,
        status=row.status,
        title=row.title,
        payload=json.loads(row.payload_json) if row.payload_json else {},
        created_at=row.created_at,
        updated_at=row.updated_at,
    )


@router.post("", response_model=PreScreenerDraftResponse, status_code=201)
def upsert_pre_screener_draft(
    body: PreScreenerDraftUpsert,
    claims: dict = Depends(decode_token),
    db: Session = Depends(get_db),
) -> PreScreenerDraftResponse:
    owner_sub = claims.get("sub")
    if not isinstance(owner_sub, str) or not owner_sub:
        raise HTTPException(status_code=401, detail="Invalid token subject")

    row = None
    if body.id is not None:
        row = (
            db.query(PreScreenerDraft)
            .filter(PreScreenerDraft.id == body.id, PreScreenerDraft.owner_sub == owner_sub)
            .first()
        )
        if not row:
            raise HTTPException(status_code=404, detail="Draft not found")

    normalized_title = (
        body.title.strip() if isinstance(body.title, str) and body.title.strip() else "Pre-Screener Draft"
    )

    if row is None:
        row = PreScreenerDraft(
            owner_sub=owner_sub,
            status=body.status,
            title=normalized_title,
            payload_json=json.dumps(body.payload),
        )
        db.add(row)
    else:
        row.status = body.status
        row.title = normalized_title
        row.payload_json = json.dumps(body.payload)

    db.commit()
    db.refresh(row)
    return _serialize(row)


@router.get("", response_model=list[PreScreenerDraftResponse])
def list_pre_screener_drafts(
    claims: dict = Depends(decode_token),
    db: Session = Depends(get_db),
) -> list[PreScreenerDraftResponse]:
    owner_sub = claims.get("sub")
    if not isinstance(owner_sub, str) or not owner_sub:
        raise HTTPException(status_code=401, detail="Invalid token subject")

    rows = (
        db.query(PreScreenerDraft)
        .filter(PreScreenerDraft.owner_sub == owner_sub)
        .order_by(PreScreenerDraft.updated_at.desc())
        .all()
    )
    return [_serialize(row) for row in rows]


@router.get("/{draft_id}", response_model=PreScreenerDraftResponse)
def get_pre_screener_draft(
    draft_id: int,
    claims: dict = Depends(decode_token),
    db: Session = Depends(get_db),
) -> PreScreenerDraftResponse:
    owner_sub = claims.get("sub")
    if not isinstance(owner_sub, str) or not owner_sub:
        raise HTTPException(status_code=401, detail="Invalid token subject")

    row = (
        db.query(PreScreenerDraft)
        .filter(PreScreenerDraft.id == draft_id, PreScreenerDraft.owner_sub == owner_sub)
        .first()
    )
    if not row:
        raise HTTPException(status_code=404, detail="Draft not found")
    return _serialize(row)
