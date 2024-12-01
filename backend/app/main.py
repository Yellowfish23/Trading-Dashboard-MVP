from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import get_settings
from .core.database import init_db
from .api.endpoints import market_analysis, websocket

settings = get_settings()
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(market_analysis.router, prefix="/api/v1")
app.include_router(websocket.router, prefix="/ws")

@app.on_event("startup")
async def startup_event():
    """Initialize application services"""
    await init_db()

@app.get("/")
async def root():
    return {"message": "Modular Traffic Light Dashboard API"}
