# 🎥 Frigate Setup Wizard

[![Docker](https://img.shields.io/badge/docker-ghcr.io-blue)](https://github.com/SunvidWong/frigate-setup-wizard/pkgs/container/frigate-setup-wizard)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/SunvidWong/frigate-setup-wizard)](https://github.com/SunvidWong/frigate-setup-wizard/stargazers)

一个现代化的 Web 界面，用于快速安装和配置 Frigate NVR 系统。

[English](README.md) | [简体中文](README.zh-CN.md)

## ✨ Features

- 🔍 **Auto Hardware Detection** - Automatically scan AI accelerators (Google Coral, NVIDIA GPU, Intel, AMD, Hailo)
- 🎨 **Modern UI** - Responsive React interface with dark/light themes
- 🌐 **Multi-language** - English/Chinese support
- 📹 **Batch Import** - CSV batch camera import
- 🚀 **One-Click Install** - Auto-generate config and deploy Frigate
- ⚙️ **Config Management** - Preview, history, and templates
- 🔧 **Connection Test** - RTSP stream testing
- 📊 **Real-time Logs** - System operation logs

## 🚀 Quick Start

### Docker Run (Recommended)

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

Visit: http://localhost:8080

### Docker Compose

```bash
wget https://raw.githubusercontent.com/SunvidWong/frigate-setup-wizard/main/docker-compose.yml
docker-compose up -d
```

### Docker Compose 2

```bash
services:
  frigate-wizard:
    image: ghcr.io/sunvidwong/frigate-setup-wizard:latest
    container_name: frigate-wizard
    restart: unless-stopped
    ports:
      - "8080:80"
      - "3000:3000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./config:/config
      - ./media:/media
    privileged: true
    environment:
      - NODE_ENV=production

networks: {}
```

Save as docker-compose.yml and then run:
```bash
docker-compose up -d

Access:
http://localhost:8080

Explanation:
	•	8080:80 – Web UI port
	•	3000:3000 – Backend API port
	•	/var/run/docker.sock – Required to manage the Frigate container
	•	./config – Configuration file persistence
	•	./media – Video storage
	•	privileged: true – Required for access to hardware devices
```

## 📖 Usage

1. **Hardware Detection** - Auto-scan available AI accelerators
2. **Add Detectors** - Select and configure hardware acceleration
3. **Configure Cameras** - Add RTSP camera sources
4. **Save & Deploy** - One-click Frigate deployment
5. **Access Frigate** - Visit Frigate dashboard at http://localhost:5000

## 🛠️ Development

```bash
# Clone repository
git clone https://github.com/SunvidWong/frigate-setup-wizard.git
cd frigate-setup-wizard

# Install dependencies
npm install

# Dev server
npm run dev

# Build
npm run build

# Docker build
docker build -t frigate-wizard .
```

## 📝 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_PORT` | Backend API port | `3000` |
| `NODE_ENV` | Environment | `production` |

### Volumes

| Path | Description | Required |
|------|-------------|----------|
| `/var/run/docker.sock` | Docker socket | ✅ |
| `/config` | Config storage | ✅ |
| `/media` | Recording storage | ✅ |

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Credits

- [Frigate](https://frigate.video/) - Excellent open-source NVR
- [React](https://react.dev/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library

## 💬 Support

- Submit [Issue](https://github.com/SunvidWong/frigate-setup-wizard/issues)
- Start [Discussion](https://github.com/SunvidWong/frigate-setup-wizard/discussions)

---

Made with ❤️ by [SunvidWong](https://github.com/SunvidWong)
