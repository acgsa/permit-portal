from pathlib import Path

from alembic import command as alembic_command
from alembic.config import Config as AlembicConfig
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from .core import Base, decode_token, engine, settings
from .middleware import PICComplianceMiddleware
from .routers import auth as auth_router
from .routers import interagency as interagency_router
from .routers import pre_screener_drafts as pre_screener_drafts_router
from .routers import process_definitions as process_definitions_router
from .routers import synopsis as synopsis_router
from .routers import tasks as tasks_router
from .routers import workflows as workflows_router
from .routers.v1 import router as v1_router
from .services import ConnectionManager, registry

app = FastAPI(title="PERMIT.GOV Pilot API", version="0.1.0")

origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# PIC schema compliance middleware (validates /api/v1/ responses)
if settings.pic_schema_validate_responses:
    app.add_middleware(PICComplianceMiddleware)

# PIC v1 API
app.include_router(v1_router)

# Legacy routers
app.include_router(auth_router.router)
app.include_router(pre_screener_drafts_router.router)
app.include_router(process_definitions_router.router)
app.include_router(workflows_router.router)
app.include_router(tasks_router.router)

# Synopsis & submission
app.include_router(synopsis_router.router)

# Inter-agency API
app.include_router(interagency_router.router)
manager = ConnectionManager()

_BACKEND_DIR = Path(__file__).resolve().parents[1]


def _run_alembic_upgrade() -> None:
    """Run alembic upgrade head to ensure DB schema is current."""
    if settings.database_url.startswith("sqlite"):
        Base.metadata.create_all(bind=engine)
        return

    alembic_cfg = AlembicConfig(str(_BACKEND_DIR / "alembic.ini"))
    alembic_cfg.set_main_option("script_location", str(_BACKEND_DIR / "alembic"))
    alembic_cfg.set_main_option("sqlalchemy.url", settings.database_url)
    alembic_command.upgrade(alembic_cfg, "head")


def _seed_pic_data(db) -> None:  # noqa: ANN001
    """Seed PIC sample data from the submodule if SEED_PIC_DATA=true."""
    from sqlalchemy import text

    seed_path = _BACKEND_DIR / "pic-standards" / "src" / "database" / "seed-v1.2.0.sql"
    if not seed_path.exists():
        return

    # Only seed if project table is empty
    count = db.execute(text("SELECT COUNT(*) FROM project")).scalar()
    if count > 0:
        return

    sql = seed_path.read_text()
    db.execute(text(sql))
    db.commit()


@app.on_event("startup")
def startup() -> None:
    # Run Alembic migrations (creates PIC + custom tables)
    _run_alembic_upgrade()

    from .core import SessionLocal

    db = SessionLocal()
    try:
        # Seed PIC sample data if enabled
        if settings.seed_pic_data:
            _seed_pic_data(db)

        # Seed BPMN process definition
        seed_path = Path(__file__).resolve().parent / "bpmn" / "permit_process.bpmn"
        registry.ensure_seeded_definition(
            db=db,
            definition_key="permit_process",
            bpmn_path=str(seed_path),
            description="Seeded BPMN process for the permit application pilot",
        )

        # Seed agency routing rules
        from .services.synopsis import seed_routing_rules

        seed_routing_rules(db)
    finally:
        db.close()


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "auth_mode": settings.auth_mode}


@app.websocket("/ws/notifications")
async def notifications(websocket: WebSocket) -> None:
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=4401)
        return

    try:
        claims = decode_token(token)
    except HTTPException:
        await websocket.close(code=4401)
        return

    user_key = claims.get("sub", "unknown")
    await manager.connect(user_key, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user_key, websocket)
