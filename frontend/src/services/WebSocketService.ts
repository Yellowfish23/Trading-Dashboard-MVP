import { MarketData, TradeSetup, WebSocketMessage, TradingPair, SignalStrength } from '../types/market';

export class WebSocketService {
    private subscribers: ((data: WebSocketMessage) => void)[] = [];
    private mockIntervals: { [key: string]: NodeJS.Timeout } = {};
    private marketState: { [key: string]: { price: number; volume: number } } = {
        BTCUSD: { price: 50000, volume: 1000 },
        ETHUSD: { price: 3000, volume: 500 },
        XRPUSD: { price: 0.5, volume: 10000 },
        SOLUSD: { price: 100, volume: 200 },
        AVAXUSD: { price: 30, volume: 150 },
        LINKUSD: { price: 15, volume: 300 }
    };

    constructor(private url: string) {}

    connect(clientId: string): void {
        Object.keys(this.marketState).forEach(symbol => {
            this.startMockDataGeneration(symbol as TradingPair);
        });
    }

    private getRandomSignal(): SignalStrength {
        const rand = Math.random();
        if (rand > 0.7) return 'STRONG';
        if (rand > 0.4) return 'MODERATE';
        if (rand > 0.1) return 'WEAK';
        return 'NEUTRAL';
    }

    private startMockDataGeneration(symbol: TradingPair): void {
        this.mockIntervals[symbol] = setInterval(() => {
            const state = this.marketState[symbol];
            
            // Update price and volume with some randomness
            state.price *= 1 + (Math.random() - 0.5) * 0.02; // 2% max change
            state.volume *= 1 + (Math.random() - 0.5) * 0.05; // 5% max change

            // Generate indicator values
            const rsi = 30 + Math.random() * 40; // RSI between 30 and 70
            const macd = -2 + Math.random() * 4; // MACD between -2 and 2
            const price = state.price;
            
            const marketData: WebSocketMessage = {
                type: 'market_data',
                data: {
                    symbol,
                    price: Math.round(price * 100) / 100,
                    volume: Math.round(state.volume),
                    timestamp: new Date().toISOString(),
                    indicators: {
                        rsi: {
                            value: rsi,
                            signal: rsi > 70 ? 'STRONG' : rsi < 30 ? 'WEAK' : 'MODERATE'
                        },
                        macd: {
                            value: macd,
                            signal: macd > 1 ? 'STRONG' : macd < -1 ? 'WEAK' : 'MODERATE'
                        },
                        bb: {
                            upper: price * 1.02,
                            middle: price,
                            lower: price * 0.98,
                            signal: this.getRandomSignal()
                        },
                        sma: {
                            sma20: price * (1 + (Math.random() - 0.5) * 0.01),
                            sma50: price * (1 + (Math.random() - 0.5) * 0.02),
                            sma200: price * (1 + (Math.random() - 0.5) * 0.03),
                            signal: this.getRandomSignal()
                        },
                        volume_profile: {
                            value: Math.random() * 100,
                            signal: this.getRandomSignal()
                        },
                        momentum: {
                            value: -1 + Math.random() * 2,
                            signal: this.getRandomSignal()
                        }
                    },
                    dailyChange: -0.05 + Math.random() * 0.1 // -5% to +5%
                } as MarketData
            };

            this.notifySubscribers(marketData);

            // Occasionally generate trade setups (10% chance)
            if (Math.random() < 0.1) {
                const tradeSetup: WebSocketMessage = {
                    type: 'setup_alert',
                    data: {
                        symbol,
                        setup_type: Math.random() > 0.7 ? 'BREAKOUT' : 
                                  Math.random() > 0.4 ? 'MOMENTUM' : 
                                  Math.random() > 0.2 ? 'MEAN_REVERSION' : 'TREND_FOLLOWING',
                        signal_strength: this.getRandomSignal(),
                        r_multiple: 1 + Math.random() * 3,
                        entry_price: price,
                        stop_loss: price * 0.98,
                        target_price: price * 1.04,
                        timestamp: new Date().toISOString(),
                        score: 0.5 + Math.random() * 0.5,
                        indicators_confirmed: [
                            'RSI',
                            'MACD',
                            'BB',
                            'SMA',
                            'Volume',
                            'Momentum'
                        ].filter(() => Math.random() > 0.5),
                        risk_reward_ratio: 1 + Math.random() * 2,
                        confidence_score: Math.random()
                    } as TradeSetup
                };
                this.notifySubscribers(tradeSetup);
            }
        }, 1000);
    }

    subscribe(callback: (data: WebSocketMessage) => void): void {
        this.subscribers.push(callback);
    }

    unsubscribe(callback: (data: WebSocketMessage) => void): void {
        this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }

    subscribeToSymbol(symbol: string): void {
        // Mock implementation - already handling all symbols
    }

    unsubscribeFromSymbol(symbol: string): void {
        // Mock implementation - already handling all symbols
    }

    private notifySubscribers(message: WebSocketMessage): void {
        this.subscribers.forEach(callback => callback(message));
    }

    disconnect(): void {
        Object.values(this.mockIntervals).forEach(interval => {
            clearInterval(interval);
        });
        this.mockIntervals = {};
    }
}
