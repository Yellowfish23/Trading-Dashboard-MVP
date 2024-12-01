import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import TrafficLight from '../TrafficLight/TrafficLight';
import IndicatorPanel from '../IndicatorPanel/IndicatorPanel';
import UserGuide from '../UserGuide/UserGuide';
import { WebSocketService } from '../../services/WebSocketService';
import type { MarketData, TradeSetup, WebSocketMessage, TradingPair } from '../../types/market';

const DashboardContainer = styled(Container)`
    padding: 20px;
    background-color: #121212;
    min-height: 100vh;
    color: white;
`;

const Header = styled(Typography)`
    margin-bottom: 20px;
    color: #fff;
`;

const PairContainer = styled(Box)`
    margin-bottom: 24px;
    padding: 16px;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.05);
`;

interface MarketDataMap {
    [key: string]: MarketData;
}

interface TradeSetupMap {
    [key: string]: TradeSetup | null;
}

const TRADING_PAIRS: TradingPair[] = ['BTCUSD', 'ETHUSD', 'XRPUSD', 'SOLUSD', 'AVAXUSD', 'LINKUSD'];

const Dashboard: React.FC = () => {
    const [marketDataMap, setMarketDataMap] = useState<MarketDataMap>({});
    const [tradeSetupMap, setTradeSetupMap] = useState<TradeSetupMap>({});
    const [wsService] = useState(() => new WebSocketService('ws://localhost:8000'));

    useEffect(() => {
        const clientId = `client_${Math.random().toString(36).substr(2, 9)}`;
        wsService.connect(clientId);

        const handleMessage = (message: WebSocketMessage) => {
            if (message.type === 'market_data') {
                const data = message.data as MarketData;
                setMarketDataMap(prev => ({
                    ...prev,
                    [data.symbol]: data
                }));
            } else if (message.type === 'setup_alert') {
                const setup = message.data as TradeSetup;
                setTradeSetupMap(prev => ({
                    ...prev,
                    [setup.symbol]: setup
                }));
            }
        };

        wsService.subscribe(handleMessage);
        TRADING_PAIRS.forEach(pair => wsService.subscribeToSymbol(pair));

        return () => {
            wsService.disconnect();
        };
    }, [wsService]);

    return (
        <DashboardContainer maxWidth="xl">
            <Header variant="h4">Trading Dashboard</Header>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <UserGuide />
                </Grid>
                <Grid item xs={12} md={9}>
                    {TRADING_PAIRS.map(pair => (
                        <PairContainer key={pair}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3}>
                                    {tradeSetupMap[pair] && (
                                        <TrafficLight
                                            signalStrength={tradeSetupMap[pair]!.signal_strength}
                                            setupType={tradeSetupMap[pair]!.setup_type}
                                            rMultiple={tradeSetupMap[pair]!.r_multiple}
                                            confidenceScore={tradeSetupMap[pair]!.confidence_score}
                                            riskRewardRatio={tradeSetupMap[pair]!.risk_reward_ratio}
                                            indicatorsConfirmed={tradeSetupMap[pair]!.indicators_confirmed}
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={12} md={9}>
                                    {marketDataMap[pair] && (
                                        <IndicatorPanel data={marketDataMap[pair]} />
                                    )}
                                </Grid>
                            </Grid>
                        </PairContainer>
                    ))}
                </Grid>
            </Grid>
        </DashboardContainer>
    );
};

export default Dashboard;
