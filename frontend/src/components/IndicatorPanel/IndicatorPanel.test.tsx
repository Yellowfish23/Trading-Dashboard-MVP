import React from 'react';
import { render, screen } from '@testing-library/react';
import IndicatorPanel from './IndicatorPanel';
import type { MarketData } from '../../types/market';

describe('IndicatorPanel', () => {
    const mockData: MarketData = {
        symbol: 'BTCUSD',
        price: 50000,
        volume: 1000,
        timestamp: new Date().toISOString(),
        dailyChange: 0.025,
        indicators: {
            rsi: {
                value: 65.5,
                signal: 'MODERATE'
            },
            macd: {
                value: 0.5,
                signal: 'MODERATE'
            },
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
            volume_profile: {
                value: 85,
                signal: 'MODERATE'
            },
            momentum: {
                value: 0.5,
                signal: 'MODERATE'
            }
        }
    };

    it('renders price and daily change', () => {
        render(<IndicatorPanel data={mockData} />);
        
        expect(screen.getByText('$50,000.00')).toBeInTheDocument();
        expect(screen.getByText('+2.50%')).toBeInTheDocument();
    });

    it('renders RSI indicator', () => {
        render(<IndicatorPanel data={mockData} />);
        
        expect(screen.getByText('RSI')).toBeInTheDocument();
        expect(screen.getByText('65.50')).toBeInTheDocument();
        expect(screen.getByText('MODERATE')).toBeInTheDocument();
    });

    it('renders MACD indicator', () => {
        render(<IndicatorPanel data={mockData} />);
        
        expect(screen.getByText('MACD')).toBeInTheDocument();
        expect(screen.getByText('0.500')).toBeInTheDocument();
    });

    it('renders Bollinger Bands', () => {
        render(<IndicatorPanel data={mockData} />);
        
        expect(screen.getByText('Bollinger Bands')).toBeInTheDocument();
        expect(screen.getByText('$51,000.00')).toBeInTheDocument();
        expect(screen.getByText('$50,000.00')).toBeInTheDocument();
        expect(screen.getByText('$49,000.00')).toBeInTheDocument();
    });

    it('renders Moving Averages', () => {
        render(<IndicatorPanel data={mockData} />);
        
        expect(screen.getByText('Moving Averages')).toBeInTheDocument();
        expect(screen.getByText('$49,500.00')).toBeInTheDocument();
        expect(screen.getByText('$48,000.00')).toBeInTheDocument();
        expect(screen.getByText('$45,000.00')).toBeInTheDocument();
    });

    it('renders Volume Profile', () => {
        render(<IndicatorPanel data={mockData} />);
        
        expect(screen.getByText('Volume Profile')).toBeInTheDocument();
        expect(screen.getByText('85.00')).toBeInTheDocument();
    });

    it('renders Momentum indicator', () => {
        render(<IndicatorPanel data={mockData} />);
        
        expect(screen.getByText('Momentum')).toBeInTheDocument();
        expect(screen.getByText('0.500')).toBeInTheDocument();
    });
});
