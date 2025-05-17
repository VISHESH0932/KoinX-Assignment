# Crypto Stats API Server

This server fetches and provides cryptocurrency statistics using the CoinGecko API.

## Features

- Fetch and store cryptocurrency data (Bitcoin, Ethereum, Matic Network)
- REST API to retrieve latest cryptocurrency stats
- Calculate standard deviation of cryptocurrency prices
- Subscribe to update events from worker server via NATS

## API Endpoints

- `GET /stats?coin=bitcoin` - Get latest stats for a cryptocurrency
- `GET /deviation?coin=bitcoin` - Get standard deviation of price for a cryptocurrency
- `POST /store-stats` - Manually trigger stats storage (for testing)
- `GET /health` - Health check endpoint

## Prerequisites

- Node.js (v14+)
- MongoDB
- NATS Server

## Setup

1. Clone the repository
2. Install dependencies

```bash
cd api-server
npm install
```

3. Create a `.env` file with the following variables (see `.env.example`):

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/crypto-stats
NATS_URL=nats://localhost:4222
```

4. Start the server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## Architecture

- Uses MongoDB to store cryptocurrency data
- Subscribes to NATS for receiving update events from the worker server
- Implements a service layer for business logic
- Uses Express.js for API routes 