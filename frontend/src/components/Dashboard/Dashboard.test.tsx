import React from 'react';
import { render, screen, act } from '../../test-utils/test-utils';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';
import { WebSocketService } from '../../services/WebSocketService';
import type { MarketData, TradeSetup, WebSocketMessage } from '../../types/market';

// Create a proper mock implementation
class MockWebSocketService {
    private subscribers: ((data: WebSocketMessage) => void)[] = [];
    
    connect = jest.fn();
    disconnect = jest.fn();
    
    subscribe(callback: (data: WebSocketMessage) => void): void {
        this.subscribers.push(callback);
    }
    
    subscribeToSymbol = jest.fn();
    
    // Helper method for tests to simulate incoming messages
    simulateMessage(message: WebSocketMessage): void {
        this.subscribers.forEach(callback => callback(message));
    }
}

// Mock the WebSocketService
jest.mock('../../services/WebSocketService', () => ({
    WebSocketService: jest.fn().mockImplementation(() => new MockWebSocketService())
}));

describe('Dashboard', () => {
    let mockWebSocketService: MockWebSocketService;

    beforeEach(() => {
        jest.clearAllMocks();
        mockWebSocketService = new MockWebSocketService();
        (WebSocketService as jest.Mock).mockImplementation(() => mockWebSocketService);
    });

    it('renders dashboard title', () => {
        render(<Dashboard />);
        expect(screen.getByText('Trading Dashboard')).toBeInTheDocument();
    });

    it('connects to WebSocket and subscribes to BTCUSD on mount', () => {
        render(<Dashboard />);
        expect(mockWebSocketService.connect).toHaveBeenCalled();
        expect(mockWebSocketService.subscribeToSymbol).toHaveBeenCalledWith('BTCUSD');
    });

    it('displays market data when received', () => {
        render(<Dashboard />);

        const marketData: MarketData = {
            symbol: 'BTCUSD',
            price: 50000,
            volume: 1000,
            timestamp: new Date().toISOString(),
            indicators: {
                rsi: { value: 65.5, signal: 'MODERATE' },
                macd: { value: 0.5, signal: 'MODERATE' },
                bb: {
                    upper: 51000,
                    middle: 50000,
                    lower: 49000,
                    signal: 'MODERATE'
                },
                sma: {
                    sma20: 49500,
                    sma50: 48000,
                    sma200: 45000,
                    signal: 'STRONG'
                },
                volume_profile: { value: 85, signal: 'MODERATE' },
                momentum: { value: 0.5, signal: 'MODERATE' }
            },
            dailyChange: 0.025
        };

        const setup: TradeSetup = {
            symbol: 'BTCUSD',
            setup_type: 'MOMENTUM',
            signal_strength: 'STRONG',
            r_multiple: 2.5,
            entry_price: 50000,
            stop_loss: 49000,
            target_price: 52000,
            timestamp: new Date().toISOString(),
            score: 0.85,
            indicators_confirmed: ['RSI', 'MACD', 'BB'],
            risk_reward_ratio: 2.0,
            confidence_score: 0.8
        };

        const marketDataMessage: WebSocketMessage = {
            type: 'market_data',
            data: marketData
        };

        const tradeSetupMessage: WebSocketMessage = {
            type: 'setup_alert',
            data: setup
        };

        act(() => {
            mockWebSocketService.simulateMessage(marketDataMessage);
            mockWebSocketService.simulateMessage(tradeSetupMessage);
        });

        expect(screen.getByText('Trading Dashboard')).toBeInTheDocument();
        expect(screen.getByText('BTCUSD')).toBeInTheDocument();
        expect(screen.getByText(/\$50,000/)).toBeInTheDocument();
    });

    it('displays trade setup when received', () => {
        render(<Dashboard />);

        const tradeSetup: WebSocketMessage = {
            type: 'setup_alert',
            data: {
                setup_type: 'MOMENTUM',
                signal_strength: 'STRONG',
                r_multiple: 2.5,
                entry_price: 50000,
                stop_loss: 49000,
                target_price: 52000,
                timestamp: new Date().toISOString(),
                score: 0.85
            } as TradeSetup
        };

        act(() => {
            mockWebSocketService.simulateMessage(tradeSetup);
        });

        expect(screen.getByText('MOMENTUM')).toBeInTheDocument();
        expect(screen.getByText('R = 2.5')).toBeInTheDocument();
    });

    it('handles WebSocket disconnection', () => {
        const { unmount } = render(<Dashboard />);
        unmount();
        expect(mockWebSocketService.disconnect).toHaveBeenCalled();
    });

    it('handles multiple market data updates', () => {
        render(<Dashboard />);

        const marketData1: WebSocketMessage = {
            type: 'market_data',
            data: {
                symbol: 'BTCUSD',
                price: 50000,
                volume: 1000,
                timestamp: new Date().toISOString()
            } as MarketData
        };

        const marketData2: WebSocketMessage = {
            type: 'market_data',
            data: {
                symbol: 'BTCUSD',
                price: 51000,
                volume: 1200,
                timestamp: new Date().toISOString()
            } as MarketData
        };

        act(() => {
            mockWebSocketService.simulateMessage(marketData1);
        });

        expect(screen.getByText('BTCUSD: $50,000')).toBeInTheDocument();

        act(() => {
            mockWebSocketService.simulateMessage(marketData2);
        });

        expect(screen.getByText('BTCUSD: $51,000')).toBeInTheDocument();
        expect(screen.getByText('Volume: 1,200')).toBeInTheDocument();
    });
});
