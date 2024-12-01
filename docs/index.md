# Trading Dashboard MVP Documentation

## Overview
Real-time trading dashboard with technical indicators and signal visualization.

## Features
- Real-time market data visualization
- Technical indicators (RSI, MACD, BB, SMA)
- Trade setup signals with confidence scores
- User-friendly interface with dark theme
- Comprehensive user guide

## Quick Start
1. Clone the repository
2. Install dependencies
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   pip install -r requirements.txt
   ```
3. Start the development servers
   ```bash
   # Frontend
   npm start

   # Backend
   python app/main.py
   ```

## Architecture
- Frontend: React + TypeScript
- Backend: Python FastAPI
- Real-time: WebSocket
- Testing: Jest + React Testing Library

## Components
- Dashboard: Main container component
- TrafficLight: Signal visualization
- IndicatorPanel: Technical indicators display
- UserGuide: Interactive help system

## Contributing
Please read our [Contributing Guidelines](./contributing.md) before submitting pull requests.
