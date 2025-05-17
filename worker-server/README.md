# Crypto Stats Worker Server

This server runs a background job to trigger cryptocurrency data updates every 15 minutes.

## Features

- Scheduled job running every 15 minutes
- Publishes events to NATS for API server to consume
- Ensures api-server updates cryptocurrency data regularly

## Prerequisites

- Node.js (v14+)
- NATS Server

## Setup

1. Clone the repository
2. Install dependencies

```bash
cd worker-server
npm install
```

3. Create a `.env` file with the following variables:

```
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

## How It Works

1. The worker server connects to NATS on startup
2. Every 15 minutes, it publishes a message to the `crypto.update` subject
3. The API server, which is subscribed to this subject, receives the message and fetches/stores the latest cryptocurrency data

## NATS Message Format

The message published to NATS has the following format:

```json
{
  "trigger": "update",
  "timestamp": "2023-11-20T12:00:00.000Z"
}
``` 