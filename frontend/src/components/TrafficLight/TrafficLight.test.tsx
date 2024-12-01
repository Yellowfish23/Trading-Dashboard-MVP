import React from 'react';
import { render, screen } from '@testing-library/react';
import TrafficLight from './TrafficLight';

describe('TrafficLight', () => {
    const defaultProps = {
        signalStrength: 'STRONG' as const,
        setupType: 'MOMENTUM' as const,
        rMultiple: 2.5,
        confidenceScore: 0.8,
        riskRewardRatio: 2.0,
        indicatorsConfirmed: ['RSI', 'MACD', 'BB']
    };

    it('renders with strong signal', () => {
        render(<TrafficLight {...defaultProps} />);
        
        // Check setup type is displayed
        expect(screen.getByText('MOMENTUM')).toBeInTheDocument();
        
        // Check metrics are displayed
        expect(screen.getByText('R = 2.5')).toBeInTheDocument();
        expect(screen.getByText('Risk/Reward: 2.00')).toBeInTheDocument();
        expect(screen.getByText('Confidence: 80%')).toBeInTheDocument();
        
        // Check indicators are displayed
        expect(screen.getByText('RSI')).toBeInTheDocument();
        expect(screen.getByText('MACD')).toBeInTheDocument();
        expect(screen.getByText('BB')).toBeInTheDocument();
    });

    it('renders with moderate signal', () => {
        render(
            <TrafficLight
                {...defaultProps}
                signalStrength="MODERATE"
            />
        );
        
        const moderateLight = screen.getByTestId('light-moderate');
        expect(moderateLight).toHaveStyle({ backgroundColor: expect.stringContaining('FFC107') });
    });

    it('renders with weak signal', () => {
        render(
            <TrafficLight
                {...defaultProps}
                signalStrength="WEAK"
            />
        );
        
        const weakLight = screen.getByTestId('light-weak');
        expect(weakLight).toHaveStyle({ backgroundColor: expect.stringContaining('f44336') });
    });
});
