import json
from collections import defaultdict

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.connections: dict[str, set[WebSocket]] = defaultdict(set)

    async def connect(self, user_key: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.connections[user_key].add(websocket)

    def disconnect(self, user_key: str, websocket: WebSocket) -> None:
        sockets = self.connections.get(user_key)
        if sockets and websocket in sockets:
            sockets.remove(websocket)
            if not sockets:
                del self.connections[user_key]

    async def broadcast_user(self, user_key: str, payload: dict) -> None:
        for ws in list(self.connections.get(user_key, set())):
            try:
                await ws.send_text(json.dumps(payload))
            except Exception:
                self.disconnect(user_key, ws)
