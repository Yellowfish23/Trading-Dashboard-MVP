import React from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import InfoIcon from '@mui/icons-material/Info';

const GuideContainer = styled(Paper)`
    padding: 16px;
    background-color: #1a1a1a;
    color: white;
    height: 100%;
    position: sticky;
    top: 16px;
`;

const SectionTitle = styled(Typography)`
    font-weight: 500;
    margin-top: 16px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const SignalDot = styled(FiberManualRecordIcon)<{ dotcolor: string }>`
    color: ${props => props.dotcolor};
`;

const UserGuide: React.FC = () => {
    return (
        <GuideContainer elevation={3}>
            <Typography variant="h6" gutterBottom>
                Trading Dashboard Guide
            </Typography>
            
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

            <SectionTitle variant="subtitle1">
                <InfoIcon fontSize="small" />
                Traffic Light Signals
            </SectionTitle>
            <List dense>
                <ListItem>
                    <ListItemIcon>
                        <SignalDot dotcolor="#4CAF50" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Strong Signal" 
                        secondary="High probability setup with multiple confirmations"
                        secondaryTypographyProps={{ sx: { color: '#bbb' } }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <SignalDot dotcolor="#FFC107" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Moderate Signal" 
                        secondary="Potential setup with partial confirmation"
                        secondaryTypographyProps={{ sx: { color: '#bbb' } }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <SignalDot dotcolor="#f44336" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Weak Signal" 
                        secondary="Setup with minimal confirmation, higher risk"
                        secondaryTypographyProps={{ sx: { color: '#bbb' } }}
                    />
                </ListItem>
            </List>

            <SectionTitle variant="subtitle1">
                <InfoIcon fontSize="small" />
                Setup Types
            </SectionTitle>
            <List dense>
                <ListItem>
                    <ListItemText 
                        primary="Breakout" 
                        secondary="Price breaking key resistance/support levels"
                        secondaryTypographyProps={{ sx: { color: '#bbb' } }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText 
                        primary="Momentum" 
                        secondary="Strong directional price movement"
                        secondaryTypographyProps={{ sx: { color: '#bbb' } }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText 
                        primary="Mean Reversion" 
                        secondary="Price returning to average after deviation"
                        secondaryTypographyProps={{ sx: { color: '#bbb' } }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText 
                        primary="Trend Following" 
                        secondary="Continuation of established trend"
                        secondaryTypographyProps={{ sx: { color: '#bbb' } }}
                    />
                </ListItem>
            </List>

            <SectionTitle variant="subtitle1">
                <InfoIcon fontSize="small" />
                Key Metrics
            </SectionTitle>
            <List dense>
                <ListItem>
                    <ListItemText 
                        primary="R Multiple" 
                        secondary="Risk-to-reward ratio multiplier"
                        secondaryTypographyProps={{ sx: { color: '#bbb' } }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText 
                        primary="Confidence Score" 
                        secondary="AI-generated setup quality score (0-100%)"
                        secondaryTypographyProps={{ sx: { color: '#bbb' } }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText 
                        primary="Risk/Reward" 
                        secondary="Potential profit vs potential loss ratio"
                        secondaryTypographyProps={{ sx: { color: '#bbb' } }}
                    />
                </ListItem>
            </List>

            <SectionTitle variant="subtitle1">
                <InfoIcon fontSize="small" />
                Technical Indicators
            </SectionTitle>
            <List dense>
                <ListItem>
                    <ListItemText 
                        primary="RSI" 
                        secondary="Relative Strength Index (Momentum)"
                        secondaryTypographyProps={{ sx: { color: '#bbb' } }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText 
                        primary="MACD" 
                        secondary="Moving Average Convergence Divergence"
                        secondaryTypographyProps={{ sx: { color: '#bbb' } }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText 
                        primary="BB" 
                        secondary="Bollinger Bands (Volatility)"
                        secondaryTypographyProps={{ sx: { color: '#bbb' } }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText 
                        primary="SMA" 
                        secondary="Simple Moving Averages (20, 50, 200)"
                        secondaryTypographyProps={{ sx: { color: '#bbb' } }}
                    />
                </ListItem>
            </List>
        </GuideContainer>
    );
};

export default UserGuide;
