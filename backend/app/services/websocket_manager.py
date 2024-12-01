from fastapi import WebSocket
from typing import List, Dict, Set, Any
import json
from ..models.market_data import MarketData
from datetime import datetime

class WebSocketManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.symbol_subscriptions: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket):
        """Connect a new client"""
        await websocket.accept()
        self.active_connections.append(websocket)

    async def disconnect(self, websocket: WebSocket):
        """Disconnect a client"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            
        # Remove from all symbol subscriptions
        for subscribers in self.symbol_subscriptions.values():
            subscribers.discard(websocket)

    async def subscribe_to_symbol(self, websocket: WebSocket, symbol: str):
        """Subscribe a client to a symbol"""
        if symbol not in self.symbol_subscriptions:
            self.symbol_subscriptions[symbol] = set()
        self.symbol_subscriptions[symbol].add(websocket)

    async def unsubscribe_from_symbol(self, websocket: WebSocket, symbol: str):
        """Unsubscribe a client from a symbol"""
        if symbol in self.symbol_subscriptions:
            self.symbol_subscriptions[symbol].discard(websocket)
            if not self.symbol_subscriptions[symbol]:
                del self.symbol_subscriptions[symbol]

    async def broadcast_market_data(self, market_data: MarketData):
        """Broadcast market data to subscribed clients"""
        message = {
            "type": "market_data",
            "data": {
                "symbol": market_data.symbol,
                "price": market_data.price,
                "volume": market_data.volume,
                "timestamp": market_data.timestamp.isoformat(),
                "sma_20": market_data.sma_20,
                "sma_50": market_data.sma_50,
                "rsi": market_data.rsi,
                "momentum_score": market_data.momentum_score,
                "mean_reversion_score": market_data.mean_reversion_score
            }
        }
        
        # Broadcast to subscribers of this symbol
        if market_data.symbol in self.symbol_subscriptions:
            for connection in self.symbol_subscriptions[market_data.symbol]:
                try:
                    await connection.send_json(message)
                except Exception:
                    await self.disconnect(connection)

    async def broadcast_setup_alert(self, setup_alert: Dict[str, Any]):
        """Broadcast setup alerts to subscribed clients"""
        message = {
            "type": "setup_alert",
            "data": setup_alert,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Broadcast to subscribers of this symbol
        symbol = setup_alert.get("symbol")
        if symbol and symbol in self.symbol_subscriptions:
            for connection in self.symbol_subscriptions[symbol]:
                try:
                    await connection.send_json(message)
                except Exception:
                    await self.disconnect(connection)

    async def broadcast_error(self, websocket: WebSocket, error: str):
        """Send error message to a specific client"""
        try:
            await websocket.send_json({
                "type": "error",
                "message": error,
                "timestamp": datetime.utcnow().isoformat()
            })
        except Exception:
            await self.disconnect(websocket)
