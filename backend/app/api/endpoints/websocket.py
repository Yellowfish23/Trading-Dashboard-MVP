from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import Dict
import json
from ...services.websocket_manager import WebSocketManager
from ...services.market_processor import MarketProcessor
from ...core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()
websocket_manager = WebSocketManager()
market_processor = MarketProcessor()

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    client_id: str,
    db: AsyncSession = Depends(get_db)
):
    await websocket_manager.connect(websocket)
    try:
        while True:
            # Wait for messages from the client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message["type"] == "subscribe":
                symbol = message["symbol"]
                await websocket_manager.subscribe_to_symbol(websocket, symbol)
                await websocket.send_json({
                    "type": "subscription_success",
                    "symbol": symbol
                })
            
            elif message["type"] == "unsubscribe":
                symbol = message["symbol"]
                await websocket_manager.unsubscribe_from_symbol(websocket, symbol)
                await websocket.send_json({
                    "type": "unsubscription_success",
                    "symbol": symbol
                })
            
            elif message["type"] == "get_analysis":
                symbol = message["symbol"]
                # Get market data from database and process
                # This would be implemented based on your market data storage
                market_data = await get_market_data(db, symbol)
                if market_data:
                    setup = market_processor.identify_setup(market_data)
                    await websocket.send_json({
                        "type": "analysis_update",
                        "data": setup
                    })
    
    except WebSocketDisconnect:
        await websocket_manager.disconnect(websocket)
    except Exception as e:
        await websocket_manager.broadcast_error(websocket, str(e))
        await websocket_manager.disconnect(websocket)

async def get_market_data(db: AsyncSession, symbol: str):
    """Helper function to get market data from database"""
    # Implementation would go here
    # This should fetch recent market data for the symbol
    pass
