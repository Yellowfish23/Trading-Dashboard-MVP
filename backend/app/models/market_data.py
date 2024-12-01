from sqlalchemy import Column, Integer, String, Float, DateTime
from .base import Base
from datetime import datetime

class MarketData(Base):
    __tablename__ = "market_data"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    price = Column(Float)
    volume = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Additional market indicators
    sma_20 = Column(Float, nullable=True)
    sma_50 = Column(Float, nullable=True)
    rsi = Column(Float, nullable=True)
    momentum_score = Column(Float, nullable=True)
    mean_reversion_score = Column(Float, nullable=True)
