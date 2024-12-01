import pytest
import json
from fastapi.testclient import TestClient
from fastapi.websockets import WebSocket
from ..services.websocket_manager import WebSocketManager
from ..models.market_data import MarketData
from datetime import datetime

class MockWebSocket:
    def __init__(self):
        self.sent_messages = []
        self.closed = False
        self.client = {"id": "test_client"}

    async def send_text(self, message: str):
        self.sent_messages.append(message)

    async def send_json(self, message: dict):
        self.sent_messages.append(json.dumps(message))

    async def close(self):
        self.closed = True

@pytest.mark.asyncio
class TestWebSocketManager:
    @pytest.fixture
    def websocket_manager(self):
        return WebSocketManager()

    @pytest.fixture
    def mock_websocket(self):
        return MockWebSocket()

    async def test_connect_client(self, websocket_manager, mock_websocket):
        """Test client connection"""
        await websocket_manager.connect(mock_websocket)
        assert len(websocket_manager.active_connections) == 1
        assert mock_websocket in websocket_manager.active_connections

    async def test_disconnect_client(self, websocket_manager, mock_websocket):
        """Test client disconnection"""
        await websocket_manager.connect(mock_websocket)
        await websocket_manager.disconnect(mock_websocket)
        assert len(websocket_manager.active_connections) == 0

    async def test_broadcast_market_data(self, websocket_manager, mock_websocket):
        """Test broadcasting market data to connected clients"""
        await websocket_manager.connect(mock_websocket)
        
        market_data = MarketData(
            symbol="BTCUSD",
            price=50000.0,
            volume=100.0,
            timestamp=datetime.utcnow()
        )
        
        await websocket_manager.broadcast_market_data(market_data)
        
        assert len(mock_websocket.sent_messages) == 1
        message = json.loads(mock_websocket.sent_messages[0])
        assert message["type"] == "market_data"
        assert message["data"]["symbol"] == "BTCUSD"
        assert message["data"]["price"] == 50000.0

    async def test_broadcast_setup_alert(self, websocket_manager, mock_websocket):
        """Test broadcasting setup alerts to connected clients"""
        await websocket_manager.connect(mock_websocket)
        
        setup_alert = {
            "type": "MOMENTUM",
            "strength": "STRONG",
            "symbol": "BTCUSD",
            "r_multiple": 2.5
        }
        
        await websocket_manager.broadcast_setup_alert(setup_alert)
        
        assert len(mock_websocket.sent_messages) == 1
        message = json.loads(mock_websocket.sent_messages[0])
        assert message["type"] == "setup_alert"
        assert message["data"]["type"] == "MOMENTUM"
        assert message["data"]["strength"] == "STRONG"

    async def test_client_subscription(self, websocket_manager, mock_websocket):
        """Test client symbol subscription"""
        await websocket_manager.connect(mock_websocket)
        
        # Subscribe to symbol
        await websocket_manager.subscribe_to_symbol(mock_websocket, "BTCUSD")
        assert "BTCUSD" in websocket_manager.symbol_subscriptions
        assert mock_websocket in websocket_manager.symbol_subscriptions["BTCUSD"]
        
        # Unsubscribe from symbol
        await websocket_manager.unsubscribe_from_symbol(mock_websocket, "BTCUSD")
        assert "BTCUSD" not in websocket_manager.symbol_subscriptions
