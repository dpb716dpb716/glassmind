from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from pydantic import BaseModel, Field
from cloud.database.database import database, profiles
from cloud.database.nosql_client import DynamoDBClient
from dotenv import load_dotenv

# Load environment variables (if needed)
load_dotenv()

app = FastAPI(
    title="GlassMinds API",
    description="API for GlassMindz behavioral analysis system",
    version="0.1"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate the DynamoDB client for NoSQL operations
db_client = DynamoDBClient()

# ---------------------------
# SQL Database Related Events
# ---------------------------
@app.on_event("startup")
async def startup():
    await database.connect()
    # Optionally, populate sample data if no profiles exist
    query = select(profiles)
    results = await database.fetch_all(query)
    if results:
        # Insert sample profiles
        query = profiles.insert().values(name="tim", emotion="happy")
        await database.execute(query)
        query = profiles.insert().values(name="Bob", emotion="neutral")
        await database.execute(query)
        query = profiles.insert().values(name="Tim", emotion="neutral")
        await database.execute(query)

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# ---------------------------
# General Endpoints
# ---------------------------
@app.get("/")
async def read_root():
    return {"message": "Welcome to the GlassMinds API"}

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

# ---------------------------
# NoSQL (DynamoDB) Sensor Data Ingestion Endpoints
# ---------------------------
class SensorData(BaseModel):
    device_id: str = Field(..., example="smart_glasses_001")
    data_type: str = Field(..., example="motion")  # e.g., 'facial_image', 'motion', etc.
    payload: dict = Field(..., example={"x": 0.12, "y": -0.56, "z": 0.89})

@app.post("/api/data/ingest", status_code=201)
async def ingest_sensor_data(data: SensorData):
    try:
        response = db_client.put_sensor_data(
            device_id=data.device_id,
            data_type=data.data_type,
            payload=data.payload
        )
        return {"status": "success", "db_response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/data/recent/{device_id}")
async def get_recent_data(device_id: str, limit: int = 10):
    try:
        items = db_client.get_recent_sensor_data(device_id, limit)
        return {"device_id": device_id, "data": items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------
# WebSocket Support
# ---------------------------
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
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message received: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# ---------------------------
# Main entry point
# ---------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("cloud.api.main:app", host="0.0.0.0", port=8000, reload=True)
