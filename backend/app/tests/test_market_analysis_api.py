import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta
from ..main import app
from ..models.market_data import MarketData
from ..models.trade_setup import TradeSetup

@pytest.mark.asyncio
class TestMarketAnalysisAPI:
    @pytest.fixture
    async def test_data(self, async_session):
        # Create test market data
        market_data = [
            MarketData(
                symbol="BTCUSD",
                price=50000.0 + (i * 100),
                volume=1000.0,
                timestamp=datetime.utcnow() - timedelta(minutes=i)
            )
            for i in range(100)
        ]
        
        for data in market_data:
            async_session.add(data)
        
        # Create test trade setups
        trade_setups = [
            TradeSetup(
                symbol="BTCUSD",
                setup_type="MOMENTUM",
                signal_strength="STRONG",
                r_multiple=1.5,
                entry_price=50000.0,
                stop_loss=49000.0,
                target_price=52000.0,
                timestamp=datetime.utcnow() - timedelta(hours=i)
            )
            for i in range(5)
        ]
        
        for setup in trade_setups:
            async_session.add(setup)
        
        await async_session.commit()
        return {"market_data": market_data, "trade_setups": trade_setups}

    async def test_get_current_analysis(self, test_client, test_data):
        """Test getting current market analysis"""
        response = await test_client.get("/api/v1/analysis/current?symbol=BTCUSD")
        assert response.status_code == 200
        
        data = response.json()
        assert "setup" in data
        assert "invalidation_zones" in data
        assert "analysis_timestamp" in data
        
        setup = data["setup"]
        assert "setup_type" in setup
        assert "signal_strength" in setup
        assert "r_multiple" in setup
        assert "entry_price" in setup
        assert "stop_loss" in setup
        assert "target_price" in setup

    async def test_get_setup_history(self, test_client, test_data):
        """Test getting trade setup history"""
        response = await test_client.get("/api/v1/setups/history?symbol=BTCUSD&limit=10")
        assert response.status_code == 200
        
        data = response.json()
        assert "symbol" in data
        assert "setups" in data
        assert len(data["setups"]) > 0
        
        setup = data["setups"][0]
        assert "setup_type" in setup
        assert "signal_strength" in setup
        assert "r_multiple" in setup
        assert "entry_price" in setup
        assert "stop_loss" in setup
        assert "target_price" in setup
        assert "timestamp" in setup

    async def test_invalid_symbol(self, test_client):
        """Test requesting analysis for invalid symbol"""
        response = await test_client.get("/api/v1/analysis/current?symbol=INVALID")
        assert response.status_code == 404
