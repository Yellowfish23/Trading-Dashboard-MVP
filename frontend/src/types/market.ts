export type SignalStrength = 'STRONG' | 'MODERATE' | 'WEAK' | 'NEUTRAL';
export type SetupType = 'MOMENTUM' | 'MEAN_REVERSION' | 'BREAKOUT' | 'TREND_FOLLOWING';
export type MessageType = 'market_data' | 'setup_alert' | 'error' | 'subscription_success';
export type TradingPair = 'BTCUSD' | 'ETHUSD' | 'XRPUSD' | 'SOLUSD' | 'AVAXUSD' | 'LINKUSD';

export interface Indicator {
    value: number;
    signal: SignalStrength;
}

export interface MarketData {
    symbol: TradingPair;
    price: number;
    volume: number;
    timestamp: string;
    indicators: {
        rsi: Indicator;
        macd: Indicator;
        bb: {
            upper: number;
            middle: number;
            lower: number;
            signal: SignalStrength;
        };
        sma: {
            sma20: number;
            sma50: number;
            sma200: number;
            signal: SignalStrength;
        };
        volume_profile: Indicator;
        momentum: Indicator;
    };
    dailyChange: number;
}

export interface TradeSetup {
    symbol: TradingPair;
    setup_type: SetupType;
    signal_strength: SignalStrength;
    score: number;
    r_multiple: number;
    entry_price: number;
    stop_loss: number;
    target_price: number;
    timestamp: string;
    indicators_confirmed: string[];
    risk_reward_ratio: number;
    confidence_score: number;
}

export interface WebSocketMessage {
    type: MessageType;
    data: MarketData | TradeSetup | string;
    timestamp?: string;
}

export interface WebSocketSubscription {
    type: 'subscribe' | 'unsubscribe';
    symbol: TradingPair;
}
