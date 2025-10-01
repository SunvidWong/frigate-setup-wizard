基于 Web 的 Frigate NVR 安装向导，支持硬件加速。
特性

- 🔍 自动硬件检测（Google Coral、NVIDIA GPU、Intel、AMD、Hailo、Rockchip）
- 🎨 现代化 React 界面，支持深色/浅色主题
- 🌐 多语言支持（中文/英文）
- 📹 通过 CSV 批量导入摄像头
- 🚀 一键安装 Frigate
- ⚙️ 配置管理，包含模板和历史记录
- 🔧 RTSP 连接测试
- 📊 实时系统日志

- 🚀 快速开始
## Docker 运行（推荐）
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
访问: http://localhost:8080



## Docker Compose（推荐）
```bash
wget https://raw.githubusercontent.com/SunvidWong/frigate-setup-wizard/main/docker-compose.yml
docker-compose up -d
```
## Docker Compose 示例
```bash
services:
  frigate-wizard:
    image: ghcr.io/sunvidwong/frigate-setup-wizard:latest
    container_name: frigate-wizard
    restart: unless-stopped
    ports:
      - "8080:80"   # Web UI 端口
      - "3000:3000" # 后端 API 端口
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock  # 必需，用于管理 Frigate 容器
      - ./config:/config                           # 配置文件持久化
      - ./media:/media                             # 视频存储
    privileged: true                               # 访问硬件设备所需
    environment:
      - NODE_ENV=production
networks: {}
```
保存为 docker-compose.yml 并运行：

创建 docker-compose.yml 文件：
```bash
docker-compose up -d
```
访问: http://localhost:8080

## 📖 使用说明
1. **硬件检测**  – 自动扫描可用 AI 加速器
2. **添加检测器** – 选择并配置硬件加速
3. **配置摄像头** – 添加 RTSP 摄像头源
4. **保存并部署** – 一键部署 Frigate
5. **访问 Frigate 仪表盘** – http://localhost:5000

## 🛠️ 开发
```bash
# 克隆仓库
git clone https://github.com/SunvidWong/frigate-setup-wizard.git
cd frigate-setup-wizard

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build

# Docker 构建
docker build -t frigate-wizard .
```
## 📝 配置

### 环境变量

| 变量 | 描述 | 默认值 |
|----------|-------------|---------|
| `API_PORT` | 后端 API 端口 | `3000` |
| `NODE_ENV` | 环境 | `production` |

### 卷挂载

| 路径 | 描述 | 必需 |
|------|-------------|----------|
| `/var/run/docker.sock` | Docker socket | ✅ |
| `/config` | 配置文件存储 | ✅ |
| `/media` | 视频录像存储 | ✅ |

## 🤝 贡献指南

## 欢迎贡献! 谢谢:

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交修改 (`git commit -m 'Add AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 

## 📄 许可证

MIT License – 查看 LICENSE 文件

⸻

## 🙏 致谢
	•	Frigate – 优秀的开源 NVR
	•	React – 前端框架
	•	Tailwind CSS – CSS 框架
	•	Lucide – 图标库

## 💬 支持
	•	提交 Issue
	•	开启讨论

由 SunvidWong ❤️ 制作

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
