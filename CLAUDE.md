# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based web application called "Frigate Setup Wizard" that provides a modern UI for configuring and deploying Frigate NVR (Network Video Recorder) systems with hardware acceleration support. The application features hardware detection, camera configuration, and one-click deployment capabilities.

## Development Commands

### Development Server
```bash
npm run dev
```
Starts the development server with hot reloading on port 5173.

### Building for Production
```bash
npm run build
```
Builds the React application for production deployment.

### Preview Production Build
```bash
npm run preview
```
Previews the production build locally.

## Code Architecture

### Frontend Structure
- **Main Application**: `src/App.tsx` - Contains the complete React application with all UI components and logic
- **Entry Point**: `src/main.tsx` - React DOM rendering
- **Styling**: `src/index.css` - Tailwind CSS configuration and global styles
- **Build Config**: `vite.config.ts` - Vite configuration with React plugin and proxy settings

### Key Components in App.tsx
1. **Hardware Detection**: Auto-scans for AI accelerators (Google Coral, NVIDIA, Intel, AMD, Hailo)
2. **Detector Management**: Configures hardware acceleration for object detection
3. **Camera Configuration**: Manages RTSP camera sources with connection testing
4. **Configuration Tools**: Templates, batch import, config history, and validation
5. **Container Management**: Start/stop Frigate containers with version selection
6. **System Logs**: Real-time logging of operations
7. **Configuration Preview**: YAML configuration preview

### Backend (Embedded in Dockerfile)
- Express.js API server for hardware detection and configuration management
- File system operations for saving Frigate configuration files
- Docker integration for deploying Frigate containers

## Deployment

### Docker Deployment (Recommended)
```bash
docker-compose up -d
```

### Direct Docker Run
```bash
docker run -d \
  --name frigate-wizard \
  -p 8080:80 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd)/config:/config \
  -v $(pwd)/media:/media \
  --privileged \
  ghcr.io/sunvidwong/frigate-setup-wizard:latest
```

### Key Docker Configuration
- Port 8080: Web UI access
- Port 3000: Backend API
- Volume mounts for config and media persistence
- Privileged mode required for hardware access
- Docker socket access for container management

## Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React icons
- **Build Tool**: Vite with React plugin
- **Backend**: Node.js, Express.js (embedded in Docker)
- **Deployment**: Docker with multi-stage build

## Key Features
- Multi-language support (English/Chinese)
- Dark/light theme switching
- Hardware acceleration detection for multiple platforms
- RTSP camera connection testing
- CSV batch camera import
- Configuration templates
- Real-time system logs
- Configuration history and restore
- Network camera discovery
- One-click Frigate deployment

## File Structure
```
frigate-setup-wizard/
├── src/
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Entry point
│   └── index.css       # Styles
├── Dockerfile          # Multi-stage Docker build
├── docker-compose.yml  # Deployment configuration
├── vite.config.ts      # Build configuration
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation
```