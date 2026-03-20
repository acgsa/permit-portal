from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from .core import Base, decode_token, engine, settings
from .routers import auth as auth_router
from .routers import process_definitions as process_definitions_router
from .routers import tasks as tasks_router
from .routers import workflows as workflows_router
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

app.include_router(auth_router.router)
app.include_router(process_definitions_router.router)
app.include_router(workflows_router.router)
app.include_router(tasks_router.router)
manager = ConnectionManager()


@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(bind=engine)
    from .core import SessionLocal

    seed_path = Path(__file__).resolve().parent / "bpmn" / "permit_process.bpmn"
    db = SessionLocal()
    try:
        registry.ensure_seeded_definition(
            db=db,
            definition_key="permit_process",
            bpmn_path=str(seed_path),
            description="Seeded BPMN process for the permit application pilot",
        )
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
    except ValueError:
        await websocket.close(code=4401)
        return

    user_key = claims.get("sub", "unknown")
    await manager.connect(user_key, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user_key, websocket)
