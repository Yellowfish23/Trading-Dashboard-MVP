# Modular Traffic Light Dashboard

A real-time trading analysis dashboard that provides visual indicators for A+ setups using TradingView data feeds.

## Project Structure
```
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   └── tests/
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   └── tests/
│   └── package.json
├── requirements.txt
└── README.md
```

## Setup Instructions

### Backend Setup
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with:
   ```
   TRADINGVIEW_API_KEY=your_api_key
   DATABASE_URL=sqlite:///./trading_dashboard.db
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

## Testing
- Backend tests: `pytest`
- Frontend tests: `npm test`

## Features
- Real-time market data visualization
- Traffic light indicators for A+ setups
- R-multiple calculations and adjustments
- Historical trade analysis
- Custom alerts and notifications

## Architecture
- Backend: FastAPI (Python)
- Frontend: React with TypeScript
- Database: SQLite (development) / PostgreSQL (production)
- Real-time updates: WebSocket integration
- Testing: pytest (backend) and Jest (frontend)
