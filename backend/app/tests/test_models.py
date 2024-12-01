import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from ..models.base import Base
from ..models.market_data import MarketData
from ..models.trade_setup import TradeSetup
from datetime import datetime

# Use in-memory SQLite for testing
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest.fixture
async def async_session():
    engine = create_async_engine(TEST_DATABASE_URL, echo=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
        await session.rollback()
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.mark.asyncio
async def test_market_data_creation(async_session):
    """Test creating and retrieving market data"""
    market_data = MarketData(
        symbol="BTCUSD",
        price=50000.0,
        timestamp=datetime.utcnow(),
        volume=100.0
    )
    
    async_session.add(market_data)
    await async_session.commit()
    
    result = await async_session.get(MarketData, market_data.id)
    assert result.symbol == "BTCUSD"
    assert result.price == 50000.0

@pytest.mark.asyncio
async def test_trade_setup_creation(async_session):
    """Test creating and retrieving trade setup"""
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
    
    result = await async_session.get(TradeSetup, trade_setup.id)
    assert result.symbol == "BTCUSD"
    assert result.setup_type == "MOMENTUM"
    assert result.r_multiple == 1.5
