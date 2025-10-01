完整的双语 README 内容：
markdown# 🎥 Frigate Setup Wizard

[English](#english) | [中文](#中文)

---

## English

[![Docker](https://img.shields.io/badge/docker-ghcr.io-blue)](https://github.com/SunvidWong/frigate-setup-wizard/pkgs/container/frigate-setup-wizard)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Web-based setup wizard for Frigate NVR with hardware acceleration support.

### Features

- 🔍 Auto hardware detection (Google Coral, NVIDIA GPU, Intel, AMD, Hailo, Rockchip)
- 🎨 Modern React UI with dark/light themes
- 🌐 Multi-language support (English/Chinese)
- 📹 Batch camera import via CSV
- 🚀 One-click Frigate installation
- ⚙️ Configuration management with templates and history
- 🔧 RTSP connection testing
- 📊 Real-time system logs

### Quick Start

#### Docker Compose (Recommended)

Create `docker-compose.yml`:
```yaml
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
Run:
bashdocker-compose up -d
Visit: http://localhost:8080
Management Commands:
bash# Stop service
docker-compose down

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Update image
docker-compose pull
docker-compose up -d
Docker Run
bashdocker run -d \
  --name frigate-wizard \
  -p 8080:80 \
  -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd)/config:/config \
  -v $(pwd)/media:/media \
  --privileged \
  ghcr.io/sunvidwong/frigate-setup-wizard:latest
Configuration
PortDescription80Web UI3000Backend API5000Frigate Web UI (after installation)8554Frigate RTSP
VolumeDescriptionRequired/var/run/docker.sockDocker socket✅/configConfig storage✅/mediaRecording storage✅
Usage

Open web interface at http://localhost:8080
Scan for available AI accelerators
Add detectors and configure cameras
Start Frigate container
Access Frigate at http://localhost:5000

Development
bashgit clone https://github.com/SunvidWong/frigate-setup-wizard.git
cd frigate-setup-wizard
npm install
npm run dev
License
MIT License - see LICENSE

中文
Show Image
Show Image
基于 Web 的 Frigate NVR 安装向导，支持硬件加速。
特性

🔍 自动硬件检测（Google Coral、NVIDIA GPU、Intel、AMD、Hailo、Rockchip）
🎨 现代化 React 界面，支持深色/浅色主题
🌐 多语言支持（中文/英文）
📹 通过 CSV 批量导入摄像头
🚀 一键安装 Frigate
⚙️ 配置管理，包含模板和历史记录
🔧 RTSP 连接测试
📊 实时系统日志

快速开始
Docker Compose（推荐）
创建 docker-compose.yml 文件：
yamlservices:
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
启动服务：
bashdocker-compose up -d
访问：http://localhost:8080
管理命令：
bash# 停止服务
docker-compose down

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 更新镜像
docker-compose pull
docker-compose up -d
Docker 直接运行
bashdocker run -d \
  --name frigate-wizard \
  -p 8080:80 \
  -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd)/config:/config \
  -v $(pwd)/media:/media \
  --privileged \
  ghcr.io/sunvidwong/frigate-setup-wizard:latest
配置说明
端口说明80Web 界面3000后端 API5000Frigate Web 界面（安装后）8554Frigate RTSP
挂载目录说明必需/var/run/docker.sockDocker 套接字✅/config配置存储✅/media录像存储✅
使用说明

在浏览器打开 http://localhost:8080
扫描可用的 AI 加速器
添加检测器并配置摄像头
启动 Frigate 容器
访问 Frigate：http://localhost:5000

开发
bashgit clone https://github.com/SunvidWong/frigate-setup-wizard.git
cd frigate-setup-wizard
npm install
npm run dev
许可证
MIT 许可证 - 查看 LICENSE

Made with ❤️ by SunvidWong
