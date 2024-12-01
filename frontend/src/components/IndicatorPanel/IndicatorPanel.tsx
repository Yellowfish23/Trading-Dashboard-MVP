import React from 'react';
import { Box, Paper, Typography, Grid, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { MarketData, SignalStrength } from '../../types/market';

interface IndicatorPanelProps {
    data: MarketData;
}

const PanelContainer = styled(Paper)`
    padding: 16px;
    background-color: #1a1a1a;
    color: white;
    height: 100%;
`;

const IndicatorBox = styled(Box)`
    padding: 12px;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.05);
    margin-bottom: 8px;
`;

interface PriceTextProps {
    priceColor?: string;
}

const PriceText = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'priceColor',
})<PriceTextProps>`
    font-size: 1.5rem;
    font-weight: 500;
    color: ${props => props.priceColor || '#fff'};
`;

const SignalChip = styled(Chip)<{ signalstrength: SignalStrength }>`
    margin-left: 8px;
    background-color: ${props => {
        switch (props.signalstrength) {
            case 'STRONG':
                return 'rgba(76, 175, 80, 0.2)';
            case 'MODERATE':
                return 'rgba(255, 193, 7, 0.2)';
            case 'WEAK':
                return 'rgba(244, 67, 54, 0.2)';
            default:
                return 'rgba(158, 158, 158, 0.2)';
        }
    }};
    color: ${props => {
        switch (props.signalstrength) {
            case 'STRONG':
                return '#4CAF50';
            case 'MODERATE':
                return '#FFC107';
            case 'WEAK':
                return '#f44336';
            default:
                return '#9e9e9e';
        }
    }};
`;

const IndicatorValue = styled(Typography)`
    font-family: 'Roboto Mono', monospace;
    color: #bbb;
`;

const IndicatorPanel: React.FC<IndicatorPanelProps> = ({ data }) => {
    const { price, volume, dailyChange, indicators } = data;

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const formatChange = (value: number) => {
        const formatted = (value * 100).toFixed(2);
        return `${value >= 0 ? '+' : ''}${formatted}%`;
    };

    const priceColor = dailyChange >= 0 ? '#4CAF50' : '#f44336';

    return (
        <PanelContainer elevation={3}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Box>
                            <PriceText priceColor={priceColor}>
                                {formatPrice(price)}
                            </PriceText>
                            <Typography variant="subtitle1" sx={{ color: priceColor }}>
                                {formatChange(dailyChange)}
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="#bbb">
                            Vol: {volume.toLocaleString()}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <IndicatorBox>
                        <Typography variant="subtitle2">RSI</Typography>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <IndicatorValue>{indicators.rsi.value.toFixed(2)}</IndicatorValue>
                            <SignalChip
                                label={indicators.rsi.signal}
                                size="small"
                                signalstrength={indicators.rsi.signal}
                            />
                        </Box>
                    </IndicatorBox>

                    <IndicatorBox>
                        <Typography variant="subtitle2">MACD</Typography>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <IndicatorValue>{indicators.macd.value.toFixed(3)}</IndicatorValue>
                            <SignalChip
                                label={indicators.macd.signal}
                                size="small"
                                signalstrength={indicators.macd.signal}
                            />
                        </Box>
                    </IndicatorBox>
                </Grid>

                <Grid item xs={12} md={6}>
                    <IndicatorBox>
                        <Typography variant="subtitle2">Bollinger Bands</Typography>
                        <Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="caption" color="#bbb">Upper</Typography>
                                <IndicatorValue>{formatPrice(indicators.bb.upper)}</IndicatorValue>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="caption" color="#bbb">Middle</Typography>
                                <IndicatorValue>{formatPrice(indicators.bb.middle)}</IndicatorValue>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="caption" color="#bbb">Lower</Typography>
                                <IndicatorValue>{formatPrice(indicators.bb.lower)}</IndicatorValue>
                            </Box>
                            <Box display="flex" justifyContent="flex-end" mt={1}>
                                <SignalChip
                                    label={indicators.bb.signal}
                                    size="small"
                                    signalstrength={indicators.bb.signal}
                                />
                            </Box>
                        </Box>
                    </IndicatorBox>
                </Grid>

                <Grid item xs={12}>
                    <IndicatorBox>
                        <Typography variant="subtitle2">Moving Averages</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Typography variant="caption" color="#bbb">SMA20</Typography>
                                <IndicatorValue>{formatPrice(indicators.sma.sma20)}</IndicatorValue>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="caption" color="#bbb">SMA50</Typography>
                                <IndicatorValue>{formatPrice(indicators.sma.sma50)}</IndicatorValue>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="caption" color="#bbb">SMA200</Typography>
                                <IndicatorValue>{formatPrice(indicators.sma.sma200)}</IndicatorValue>
                            </Grid>
                        </Grid>
                        <Box display="flex" justifyContent="flex-end" mt={1}>
                            <SignalChip
                                label={indicators.sma.signal}
                                size="small"
                                signalstrength={indicators.sma.signal}
                            />
                        </Box>
                    </IndicatorBox>
                </Grid>

                <Grid item xs={12} md={6}>
                    <IndicatorBox>
                        <Typography variant="subtitle2">Volume Profile</Typography>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <IndicatorValue>{indicators.volume_profile.value.toFixed(2)}</IndicatorValue>
                            <SignalChip
                                label={indicators.volume_profile.signal}
                                size="small"
                                signalstrength={indicators.volume_profile.signal}
                            />
                        </Box>
                    </IndicatorBox>
                </Grid>

                <Grid item xs={12} md={6}>
                    <IndicatorBox>
                        <Typography variant="subtitle2">Momentum</Typography>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <IndicatorValue>{indicators.momentum.value.toFixed(3)}</IndicatorValue>
                            <SignalChip
                                label={indicators.momentum.signal}
                                size="small"
                                signalstrength={indicators.momentum.signal}
                            />
                        </Box>
                    </IndicatorBox>
                </Grid>
            </Grid>
        </PanelContainer>
    );
};

export default IndicatorPanel;
