# ChatEPN

A modern, minimalist conversational AI interface built with React and Vite, featuring data visualization and dark/light mode.

## Features

- **Data Visualization**: Bar, Line, Pie, Area, Scatter, Radar, Combo and more
- **Dark/Light Mode**: System-aware theme with persistence
- **File Context**: Upload CSV, JSON, XLSX files as chat context
- **Multi-chat**: Create and switch between multiple chat sessions
- **Drag & Drop**: Drop files directly into the chat area

## Tech Stack

- React 19, Vite 7
- CSS Modules (Vanilla CSS)
- Lucide React icons, Recharts, html2canvas

## Getting Started (Local Dev)

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Build for GitHub Pages

```bash
npm run build          # outputs to /docs, base = /ChatEPN/
```

## 🐳 Docker

### Quick start

```bash
docker-compose up --build
# → http://localhost:3000
```

### Manual build

```bash
# Build with base path set to / (Docker deployment)
docker build --build-arg VITE_BASE=/ -t chatepn .

# Run
docker run -p 3000:80 chatepn
# → http://localhost:3000
```

### Build for a custom sub-path

```bash
docker build --build-arg VITE_BASE=/my-app/ -t chatepn .
```

## Project Structure

```
src/
├── components/
│   ├── Header/            # Global app header
│   ├── ChatArea.jsx       # Main chat interface
│   ├── Sidebar.jsx        # Chat history & profile
│   ├── ConnectDataModal.jsx
│   └── DataVisualization.jsx
├── hooks/
│   ├── useTheme.js        # Theme state & persistence
│   └── useChat.js         # Chat state management
├── constants/
│   └── chartOptions.js    # Chart type definitions
└── services/
    └── mockService.js     # Query processing (mock)
```

## Environment Variables

| Variable    | Default      | Description                          |
|------------|--------------|--------------------------------------|
| `VITE_BASE` | `/ChatEPN/`  | App base path (use `/` for Docker)   |
