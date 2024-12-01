from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ...core.database import get_db
from ...services.market_processor import MarketProcessor
from ...models.market_data import MarketData
from ...models.trade_setup import TradeSetup
from sqlalchemy import select
from datetime import datetime, timedelta

router = APIRouter()
market_processor = MarketProcessor()

@router.get("/analysis/current")
async def get_current_analysis(symbol: str, db: AsyncSession = Depends(get_db)):
    """Get current market analysis for a symbol"""
    # Get recent market data
    stmt = select(MarketData).where(
        MarketData.symbol == symbol,
        MarketData.timestamp >= datetime.utcnow() - timedelta(hours=24)
    ).order_by(MarketData.timestamp.desc())
    
    result = await db.execute(stmt)
    market_data = result.scalars().all()
    
    if not market_data:
        raise HTTPException(status_code=404, detail="No recent market data found")
    
    # Process market data
    setup = market_processor.identify_setup(market_data)
    zones = market_processor.calculate_invalidation_zones(market_data)
    
    # Create trade setup record
    trade_setup = TradeSetup(
        symbol=symbol,
        setup_type=setup['setup_type'],
        signal_strength=setup['signal_strength'],
        r_multiple=setup['r_multiple'],
        entry_price=setup['entry_price'],
        stop_loss=setup['stop_loss'],
        target_price=setup['target_price'],
        timestamp=datetime.utcnow()
    )
    
    db.add(trade_setup)
    await db.commit()
    
    return {
        "setup": setup,
        "invalidation_zones": zones,
        "analysis_timestamp": datetime.utcnow().isoformat()
    }

@router.get("/setups/history")
async def get_setup_history(
    symbol: str,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Get historical trade setups"""
    stmt = select(TradeSetup).where(
        TradeSetup.symbol == symbol
    ).order_by(TradeSetup.timestamp.desc()).limit(limit)
    
    result = await db.execute(stmt)
    setups = result.scalars().all()
    
    return {
        "symbol": symbol,
        "setups": [
            {
                "setup_type": setup.setup_type,
                "signal_strength": setup.signal_strength,
                "r_multiple": setup.r_multiple,
                "entry_price": setup.entry_price,
                "stop_loss": setup.stop_loss,
                "target_price": setup.target_price,
                "timestamp": setup.timestamp.isoformat()
            }
            for setup in setups
        ]
    }
