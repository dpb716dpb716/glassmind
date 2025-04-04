from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from cloud.database.database import database, profiles

app = FastAPI(
    title="GlassMindz API",
    description="API for GlassMindz behavioral analysis system",
    version="0.1"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await database.connect()
    # Optionally, populate sample data if no profiles exist
    query = select(profiles)
    results = await database.fetch_all(query)
    if not results:
        # Insert sample profiles
        query = profiles.insert().values(name="Alice", emotion="happy")
        await database.execute(query)
        query = profiles.insert().values(name="Bob", emotion="neutral")
        await database.execute(query)

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


@app.get("/")
async def read_root():
    return {"message": "Welcome to the GlassMindz API"}

@app.post("/upload")
async def upload_data(request: Request):
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")
    return {"received_data": data}

@app.get("/profiles")
async def get_profiles():
    query = select(profiles)
    results = await database.fetch_all(query)
    profiles_list = [dict(result) for result in results]
    return {"profiles": profiles_list}


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message received: {data}")
    except WebSocketDisconnect:
        pass




if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)