import pytest
from sqlalchemy import select
from ..models.market_data import MarketData
from ..models.trade_setup import TradeSetup
from datetime import datetime

@pytest.mark.asyncio
async def test_database_operations(async_session):
    """Test basic database operations"""
    # Create test market data
    market_data = MarketData(
        symbol="BTCUSD",
        price=50000.0,
        volume=100.0,
        timestamp=datetime.utcnow()
    )
    async_session.add(market_data)
    await async_session.commit()

    # Query the data
    stmt = select(MarketData).where(MarketData.symbol == "BTCUSD")
    result = await async_session.execute(stmt)
    fetched_data = result.scalar_one()

    # Verify the data
    assert fetched_data.symbol == "BTCUSD"
    assert fetched_data.price == 50000.0
    assert fetched_data.volume == 100.0

@pytest.mark.asyncio
async def test_trade_setup_operations(async_session):
    """Test trade setup operations"""
    # Create test trade setup
    trade_setup = TradeSetup(
        symbol="BTCUSD",
        setup_type="MOMENTUM",
        signal_strength="STRONG",
        r_multiple=1.5,
        entry_price=50000.0,
        stop_loss=49000.0,
        target_price=52000.0,
        timestamp=datetime.utcnow()
    )
    async_session.add(trade_setup)
    await async_session.commit()

    # Query the data
    stmt = select(TradeSetup).where(TradeSetup.symbol == "BTCUSD")
    result = await async_session.execute(stmt)
    fetched_setup = result.scalar_one()

    # Verify the data
    assert fetched_setup.symbol == "BTCUSD"
    assert fetched_setup.setup_type == "MOMENTUM"
    assert fetched_setup.r_multiple == 1.5
    assert fetched_setup.risk_reward_ratio is None  # Testing nullable field
