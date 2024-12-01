import numpy as np
from typing import List, Dict, Union
from ..models.market_data import MarketData
from dataclasses import dataclass

@dataclass
class Signal:
    value: str
    score: float

class MarketProcessor:
    def calculate_sma(self, prices: List[float], period: int) -> List[float]:
        """Calculate Simple Moving Average"""
        if len(prices) < period:
            return []
        
        sma = []
        for i in range(len(prices) - period + 1):
            sma.append(np.mean(prices[i:i+period]))
        return sma

    def calculate_rsi(self, prices: List[float], period: int = 14) -> List[float]:
        """Calculate Relative Strength Index"""
        if len(prices) < period + 1:
            return []
        
        deltas = np.diff(prices)
        gains = np.where(deltas > 0, deltas, 0)
        losses = np.where(deltas < 0, -deltas, 0)
        
        avg_gain = np.mean(gains[:period])
        avg_loss = np.mean(losses[:period])
        
        if avg_loss == 0:
            return [100.0]
        
        rs = avg_gain / avg_loss
        rsi = [100 - (100 / (1 + rs))]
        
        for i in range(period, len(deltas)):
            avg_gain = (avg_gain * (period - 1) + gains[i]) / period
            avg_loss = (avg_loss * (period - 1) + losses[i]) / period
            
            if avg_loss == 0:
                rsi.append(100.0)
            else:
                rs = avg_gain / avg_loss
                rsi.append(100 - (100 / (1 + rs)))
        
        return rsi

    def calculate_momentum_signal(self, market_data: List[MarketData]) -> Signal:
        """Calculate momentum signal based on price action and indicators"""
        prices = [d.price for d in market_data]
        volumes = [d.volume for d in market_data]
        
        # Calculate indicators
        sma_20 = self.calculate_sma(prices, 20)
        sma_50 = self.calculate_sma(prices, 50)
        rsi = self.calculate_rsi(prices)
        
        if len(sma_20) < 2 or len(sma_50) < 2:
            return Signal("NEUTRAL", 0.0)
        
        # Calculate momentum score
        momentum_score = 0.0
        
        # Price above moving averages
        if prices[-1] > sma_20[-1] > sma_50[-1]:
            momentum_score += 0.3
        
        # Moving average crossovers
        if sma_20[-1] > sma_50[-1] and sma_20[-2] <= sma_50[-2]:
            momentum_score += 0.3
        
        # RSI conditions
        if rsi and 30 <= rsi[-1] <= 70:
            momentum_score += 0.2
        
        # Volume confirmation
        if volumes[-1] > np.mean(volumes):
            momentum_score += 0.2
        
        # Determine signal strength
        if momentum_score >= 0.8:
            return Signal("STRONG", momentum_score)
        elif momentum_score >= 0.5:
            return Signal("MODERATE", momentum_score)
        elif momentum_score >= 0.3:
            return Signal("WEAK", momentum_score)
        else:
            return Signal("NEUTRAL", momentum_score)

    def calculate_mean_reversion_signal(self, market_data: List[MarketData]) -> Signal:
        """Calculate mean reversion signal based on price action and indicators"""
        prices = [d.price for d in market_data]
        volumes = [d.volume for d in market_data]
        
        sma_20 = self.calculate_sma(prices, 20)
        rsi = self.calculate_rsi(prices)
        
        if len(sma_20) < 2 or not rsi:
            return Signal("NEUTRAL", 0.0)
        
        mean_reversion_score = 0.0
        
        # Price deviation from moving average
        deviation = (prices[-1] - sma_20[-1]) / sma_20[-1]
        if abs(deviation) > 0.02:  # 2% deviation
            mean_reversion_score += 0.3
        
        # RSI extremes
        if rsi[-1] < 30 or rsi[-1] > 70:
            mean_reversion_score += 0.3
        
        # Price velocity
        recent_returns = np.diff(prices[-5:]) / prices[-6:-1]
        if abs(np.mean(recent_returns)) > 0.01:  # 1% average move
            mean_reversion_score += 0.2
        
        # Volume confirmation
        if volumes[-1] > np.mean(volumes):
            mean_reversion_score += 0.2
        
        if mean_reversion_score >= 0.8:
            return Signal("STRONG", mean_reversion_score)
        elif mean_reversion_score >= 0.5:
            return Signal("MODERATE", mean_reversion_score)
        elif mean_reversion_score >= 0.3:
            return Signal("WEAK", mean_reversion_score)
        else:
            return Signal("NEUTRAL", mean_reversion_score)

    def calculate_r_multiple(self, entry_price: float, stop_loss: float, target_price: float) -> float:
        """Calculate R-multiple based on entry, stop, and target prices"""
        risk = abs(entry_price - stop_loss)
        if risk == 0:
            return 0.0
        
        reward = abs(target_price - entry_price)
        return reward / risk

    def identify_setup(self, market_data: List[MarketData]) -> Dict[str, Union[str, float]]:
        """Identify potential A+ setups based on market data"""
        momentum_signal = self.calculate_momentum_signal(market_data)
        mean_reversion_signal = self.calculate_mean_reversion_signal(market_data)
        
        # Determine primary setup type
        if momentum_signal.score > mean_reversion_signal.score:
            setup_type = "MOMENTUM"
            signal_strength = momentum_signal.value
            score = momentum_signal.score
        else:
            setup_type = "MEAN_REVERSION"
            signal_strength = mean_reversion_signal.value
            score = mean_reversion_signal.score
        
        current_price = market_data[-1].price
        
        # Calculate entry, stop, and target based on setup type
        if setup_type == "MOMENTUM":
            entry_price = current_price
            stop_loss = current_price * 0.98  # 2% stop loss
            target_price = current_price * 1.06  # 6% target
        else:  # MEAN_REVERSION
            sma_20 = self.calculate_sma([d.price for d in market_data], 20)[-1]
            entry_price = current_price
            stop_loss = current_price * 1.02 if current_price > sma_20 else current_price * 0.98
            target_price = sma_20
        
        r_multiple = self.calculate_r_multiple(entry_price, stop_loss, target_price)
        
        return {
            'setup_type': setup_type,
            'signal_strength': signal_strength,
            'score': score,
            'r_multiple': r_multiple,
            'entry_price': entry_price,
            'stop_loss': stop_loss,
            'target_price': target_price
        }

    def calculate_invalidation_zones(self, market_data: List[MarketData]) -> Dict[str, float]:
        """Calculate invalidation zones based on historical price action"""
        prices = [d.price for d in market_data]
        sma_20 = self.calculate_sma(prices, 20)[-1]
        
        # Calculate standard deviation of prices
        std_dev = np.std(prices)
        
        return {
            'upper_zone': sma_20 + (2 * std_dev),
            'lower_zone': sma_20 - (2 * std_dev)
        }
