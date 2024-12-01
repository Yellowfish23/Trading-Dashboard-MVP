import pytest
from httpx import AsyncClient
import pytest_asyncio
from ..services.tradingview_service import TradingViewService
from ..core.config import Settings

@pytest.mark.asyncio
class TestTradingViewIntegration:
    @pytest_asyncio.fixture
    async def trading_view_service(self):
        settings = Settings()
        return TradingViewService(settings)

    async def test_api_connection(self, trading_view_service):
        """Test basic connection to TradingView API"""
        is_connected = await trading_view_service.test_connection()
        assert is_connected is True

    async def test_market_data_format(self, trading_view_service):
        """Test market data structure matches expected format"""
        market_data = await trading_view_service.get_market_data("BTCUSD")
        assert "symbol" in market_data
        assert "price" in market_data
        assert "timestamp" in market_data

    async def test_data_processing_pipeline(self, trading_view_service):
        """Test data processing for A+ setup identification"""
        processed_data = await trading_view_service.process_market_data("BTCUSD")
        assert "momentum_signal" in processed_data
        assert "mean_reversion_signal" in processed_data
        assert "r_multiple" in processed_data
