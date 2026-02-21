# DocuVerify Web UI

This is the frontend application for DocuVerify, built with React + Vite.

## Prerequisites

- Node.js (v18 or higher recommended)
- The DocuVerify API running on `http://localhost:5042` (or configured otherwise)
- CORS enabled on the API (already configured in `Program.cs`)

## Installation

```bash
npm install
```

## Running Development Server

To run the frontend locally:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Architecture

- **React**: Component-based UI library.
- **Vite**: Ultra-fast build tool.
- **CSS Variables**: Modern theming without complex preprocessors.
- **Framer Motion**: Smooth animations.
- **Lucide React**: Icons.

## Docker

This project can be dockerized alongside the API. See the root `docker-compose.yml` (future enhancement).
