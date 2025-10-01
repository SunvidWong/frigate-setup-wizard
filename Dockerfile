# ===================================
# Multi-stage Dockerfile for Frigate Setup Wizard
# Author: SunvidWong
# ===================================

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . ./

# Build frontend
RUN npm run build

# Stage 2: Production Image
FROM node:18-alpine

# Install required tools
RUN apk add --no-cache \
    nginx \
    docker-cli \
    bash \
    curl

WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Create backend directory
RUN mkdir -p /app/backend /config /media

# Create backend package.json
RUN echo '{"name":"frigate-wizard-api","version":"1.0.0","type":"commonjs","dependencies":{"express":"^4.18.2","cors":"^2.8.5","js-yaml":"^4.1.0"}}' > /app/backend/package.json

# Create backend server
RUN cat > /app/backend/server.js << 'EOSERVER'
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs').promises;
const yaml = require('js-yaml');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/hardware', async (req, res) => {
  const hardware = { nvidia: [], intel: [], edgetpu: false };
  res.json(hardware);
});

app.post('/api/config', async (req, res) => {
  try {
    await fs.writeFile('/config/frigate-config.yml', yaml.dump(req.body));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/install', async (req, res) => {
  try {
    const compose = {
      version: '3.9',
      services: {
        frigate: {
          container_name: 'frigate',
          image: 'ghcr.io/blakeblackshear/frigate:stable',
          restart: 'unless-stopped',
          shm_size: '256mb',
          volumes: [
            '/config/frigate-config.yml:/config/config.yml',
            '/media:/media/frigate'
          ],
          ports: ['5000:5000', '8554:8554']
        }
      }
    };
    await fs.writeFile('/config/frigate-compose.yml', yaml.dump(compose));
    exec('cd /config && docker-compose -f frigate-compose.yml up -d', (err, stdout, stderr) => {
      if (err) return res.status(500).json({ error: stderr });
      res.json({ success: true, message: 'Frigate installed' });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => console.log('API server running on port ' + PORT));
EOSERVER

# Install backend dependencies
RUN cd /app/backend && npm install

# Create nginx config
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } location /api { proxy_pass http://localhost:3000; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade"; proxy_set_header Host $host; proxy_cache_bypass $http_upgrade; } }' > /etc/nginx/http.d/default.conf

# Create startup script
RUN echo -e '#!/bin/bash\ncd /app/backend && node server.js &\nnginx -g "daemon off;"' > /app/start.sh && chmod +x /app/start.sh

# Create volume mount points
RUN touch /config/.gitkeep /media/.gitkeep

VOLUME ["/config", "/media"]

EXPOSE 80 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["/app/start.sh"]
