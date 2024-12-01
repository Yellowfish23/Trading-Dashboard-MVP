import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SignalStrength, SetupType } from '../../types/market';

interface TrafficLightProps {
    signalStrength: SignalStrength;
    setupType: SetupType;
    rMultiple: number;
    confidenceScore: number;
    riskRewardRatio: number;
    indicatorsConfirmed: string[];
}

const Light = styled(Box)<{ active: boolean; color: string }>`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${props => props.active ? props.color : '#444'};
    margin: 8px;
    transition: background-color 0.3s ease;
    box-shadow: ${props => props.active ? '0 0 20px ' + props.color : 'none'};
`;

const TrafficLightContainer = styled(Paper)`
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #1a1a1a;
    border-radius: 15px;
    margin: 10px;
`;

const SetupTypeDisplay = styled(Typography)`
    color: #fff;
    font-size: 1rem;
    margin-bottom: 8px;
    font-weight: 500;
`;

const MetricDisplay = styled(Typography)`
    color: #bbb;
    font-size: 0.9rem;
    margin: 4px 0;
`;

const IndicatorChip = styled(Chip)`
    margin: 2px;
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
`;

const ScoreBox = styled(Box)<{ score: number }>`
    padding: 4px 8px;
    border-radius: 4px;
    background-color: ${props => {
        if (props.score >= 0.7) return 'rgba(76, 175, 80, 0.2)';
        if (props.score >= 0.4) return 'rgba(255, 193, 7, 0.2)';
        return 'rgba(244, 67, 54, 0.2)';
    }};
    color: ${props => {
        if (props.score >= 0.7) return '#4CAF50';
        if (props.score >= 0.4) return '#FFC107';
        return '#f44336';
    }};
    margin: 4px 0;
    font-weight: 500;
`;

export const TrafficLight: React.FC<TrafficLightProps> = ({ 
    signalStrength,
    setupType,
    rMultiple,
    confidenceScore,
    riskRewardRatio,
    indicatorsConfirmed
}) => {
    const getActiveLight = () => {
        switch (signalStrength) {
            case 'STRONG':
                return 'strong';
            case 'MODERATE':
                return 'moderate';
            case 'WEAK':
                return 'weak';
            default:
                return null;
        }
    };

    const getLightColor = (type: string) => {
        switch (type) {
            case 'strong':
                return '#4CAF50';
            case 'moderate':
                return '#FFC107';
            case 'weak':
                return '#f44336';
            default:
                return '#444';
        }
    };

    const activeLight = getActiveLight();

    return (
        <TrafficLightContainer elevation={3}>
            <SetupTypeDisplay>
                {setupType}
            </SetupTypeDisplay>
            
            <Box display="flex" flexDirection="column" alignItems="center">
                <Light 
                    data-testid="light-strong"
                    active={activeLight === 'strong'} 
                    color={getLightColor('strong')}
                />
                <Light 
                    data-testid="light-moderate"
                    active={activeLight === 'moderate'} 
                    color={getLightColor('moderate')}
                />
                <Light 
                    data-testid="light-weak"
                    active={activeLight === 'weak'} 
                    color={getLightColor('weak')}
                />
            </Box>

            <MetricDisplay>
                R = {rMultiple.toFixed(1)}
            </MetricDisplay>

            <MetricDisplay>
                Risk/Reward: {riskRewardRatio.toFixed(2)}
            </MetricDisplay>

            <ScoreBox score={confidenceScore}>
                Confidence: {(confidenceScore * 100).toFixed(0)}%
            </ScoreBox>

            <Box mt={1} display="flex" flexWrap="wrap" justifyContent="center">
                {indicatorsConfirmed.map((indicator, index) => (
                    <IndicatorChip
                        key={index}
                        label={indicator}
                        size="small"
                    />
                ))}
            </Box>
        </TrafficLightContainer>
    );
};

export default TrafficLight;
