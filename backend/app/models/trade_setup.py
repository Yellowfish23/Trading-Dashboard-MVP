from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from .base import Base
from datetime import datetime
import enum

class SetupType(enum.Enum):
    MOMENTUM = "MOMENTUM"
    MEAN_REVERSION = "MEAN_REVERSION"

class SignalStrength(enum.Enum):
    STRONG = "STRONG"
    MODERATE = "MODERATE"
    WEAK = "WEAK"

class TradeSetup(Base):
    __tablename__ = "trade_setups"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    setup_type = Column(String, index=True)  # MOMENTUM or MEAN_REVERSION
    signal_strength = Column(String)  # STRONG, MODERATE, WEAK
    r_multiple = Column(Float)
    entry_price = Column(Float)
    stop_loss = Column(Float)
    target_price = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Additional setup details
    setup_notes = Column(String, nullable=True)
    invalidation_reason = Column(String, nullable=True)
    risk_reward_ratio = Column(Float, nullable=True)
    market_context = Column(String, nullable=True)
