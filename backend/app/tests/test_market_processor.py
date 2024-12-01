import pytest
import numpy as np
from datetime import datetime, timedelta
from ..services.market_processor import MarketProcessor
from ..models.market_data import MarketData

def create_sample_market_data(base_price=50000.0, num_points=100):
    """Create sample market data for testing"""
    data = []
    base_time = datetime.utcnow()
    
    for i in range(num_points):
        # Create some price movement patterns for testing
        noise = np.random.normal(0, 100)
        trend = i * 10 if i < num_points/2 else (num_points - i) * 10
        price = base_price + trend + noise
        
        data.append(MarketData(
            symbol="BTCUSD",
            price=price,
            volume=1000 + np.random.normal(0, 100),
            timestamp=base_time + timedelta(minutes=i)
        ))
    return data

@pytest.mark.asyncio
class TestMarketProcessor:
    @pytest.fixture
    async def market_processor(self):
        return MarketProcessor()

    @pytest.fixture
    async def sample_data(self):
        return create_sample_market_data()

    async def test_calculate_sma(self, market_processor, sample_data):
        """Test Simple Moving Average calculation"""
        sma_20 = market_processor.calculate_sma([d.price for d in sample_data], 20)
        assert len(sma_20) == len(sample_data) - 19
        assert all(isinstance(x, float) for x in sma_20)

    async def test_calculate_rsi(self, market_processor, sample_data):
        """Test RSI calculation"""
        rsi = market_processor.calculate_rsi([d.price for d in sample_data], 14)
        assert len(rsi) == len(sample_data) - 14
        assert all(0 <= x <= 100 for x in rsi)

    async def test_momentum_signal(self, market_processor, sample_data):
        """Test momentum signal generation"""
        signal = market_processor.calculate_momentum_signal(sample_data)
        assert signal in ["STRONG", "MODERATE", "WEAK", "NEUTRAL"]
        assert hasattr(signal, 'score')  # Should have a numerical score

    async def test_mean_reversion_signal(self, market_processor, sample_data):
        """Test mean reversion signal generation"""
        signal = market_processor.calculate_mean_reversion_signal(sample_data)
        assert signal in ["STRONG", "MODERATE", "WEAK", "NEUTRAL"]
        assert hasattr(signal, 'score')  # Should have a numerical score

    async def test_calculate_r_multiple(self, market_processor):
        """Test R-multiple calculation"""
        entry_price = 50000.0
        stop_loss = 49000.0
        target_price = 53000.0
        
        r_multiple = market_processor.calculate_r_multiple(
            entry_price=entry_price,
            stop_loss=stop_loss,
            target_price=target_price
        )
        
        # For the given prices, R-multiple should be 3.0
        # (Target: 3000 points, Stop: 1000 points = 3R)
        assert r_multiple == 3.0

    async def test_identify_setup(self, market_processor, sample_data):
        """Test A+ setup identification"""
        setup = market_processor.identify_setup(sample_data)
        
        assert 'setup_type' in setup
        assert 'signal_strength' in setup
        assert 'r_multiple' in setup
        assert 'entry_price' in setup
        assert 'stop_loss' in setup
        assert 'target_price' in setup
        
        assert setup['setup_type'] in ['MOMENTUM', 'MEAN_REVERSION']
        assert setup['signal_strength'] in ['STRONG', 'MODERATE', 'WEAK', 'NEUTRAL']
        assert isinstance(setup['r_multiple'], float)

    async def test_invalidation_zones(self, market_processor, sample_data):
        """Test invalidation zones calculation"""
        zones = market_processor.calculate_invalidation_zones(sample_data)
        
        assert 'upper_zone' in zones
        assert 'lower_zone' in zones
        assert isinstance(zones['upper_zone'], float)
        assert isinstance(zones['lower_zone'], float)
        assert zones['upper_zone'] > zones['lower_zone']
