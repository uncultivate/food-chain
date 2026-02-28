# Food Chain Simulation

An interactive React app simulating predator-prey dynamics in ocean and Australian native ecosystems.

## Features

- **Real-time simulation**: Step-by-step animation with play/pause and adjustable speed
- **Interactive food web**: Drag nodes, zoom, pan; each organism shows a photo and current population
- **Two ecosystems**: Ocean (plankton, fish, sharks, etc.) and Australian Native (grasses, kangaroos, dingoes, etc.)
- **Invader mode**: Introduce an invasive species at the halfway point with configurable starting population

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

## Deploy to Vercel

This project is ready for Vercel with `vercel.json` (Vite framework, `npm run build`, output `dist`).

### Option 1: Vercel dashboard

- Import the GitHub repository into Vercel.
- Keep the detected settings (or use the values in `vercel.json`).
- Deploy.

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

## Archive

The original Streamlit app is in the `archive/` directory.
