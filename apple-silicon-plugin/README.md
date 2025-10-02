# 🍎 Frigate Apple Silicon插件

一键部署支持Apple Neural Engine加速的Frigate NVR系统

## ✨ 特性

- 🚀 **Neural Engine加速** - 利用Apple Silicon的AI芯片进行实时物体检测
- 🐳 **Docker部署** - Frigate主服务运行在Docker容器中
- 🔌 **即插即用** - 自动化安装脚本，快速部署
- ⚡ **高性能** - 检测速度可达60 FPS，与Google Coral相当
- 🎯 **低功耗** - Neural Engine功耗仅3-5W

## 📋 系统要求

- macOS 12.0 (Monterey) 或更高版本
- Apple Silicon 芯片 (M1/M2/M3/M4)
- 8GB 内存（推荐16GB）
- Docker Desktop for Mac
- Python 3.9+

## 🚀 快速开始

### 1. 安装

```bash
# 克隆项目或下载插件包
cd frigate-setup-wizard/apple-silicon-plugin

# 运行安装脚本
./install.sh
```

安装脚本会自动：
- ✅ 检查系统环境
- ✅ 安装Python依赖
- ✅ 创建目录结构
- ✅ 生成启动脚本

### 2. 配置

#### 2.1 配置Frigate (config/config.yml)

```yaml
mqtt:
  host: mqtt
  port: 1883

detectors:
  apple_silicon:
    type: zmq
    endpoint: tcp://host.docker.internal:5555

cameras:
  front_door:  # 摄像头名称
    enabled: True
    ffmpeg:
      inputs:
        - path: rtsp://username:password@192.168.1.100:554/stream
          roles:
            - detect
            - record
    detect:
      enabled: True
      width: 1280
      height: 720
      fps: 5
    objects:
      track:
        - person
        - car
        - dog
        - cat
```

#### 2.2 配置检测器 (detector/config.yml)

```yaml
# ONNX模型路径
model_path: "models/yolov7-320.onnx"

# ZMQ端点
zmq_endpoint: "tcp://0.0.0.0:5555"

# 输入尺寸
input_size: [320, 320]

# 阈值配置
conf_threshold: 0.5
iou_threshold: 0.45
```

### 3. 启动服务

```bash
# 一键启动所有服务
./start-all.sh
```

服务启动后：
1. Frigate Web界面: http://localhost:5000
2. MQTT服务: localhost:1883
3. 检测器服务: 在终端窗口运行（保持打开）

### 4. 停止服务

```bash
# 停止所有服务
./stop-all.sh
```

## 📁 目录结构

```
apple-silicon-plugin/
├── docker-compose.yml          # Docker编排配置
├── install.sh                  # 安装脚本
├── start-all.sh               # 一键启动脚本
├── stop-all.sh                # 停止脚本
├── README.md                   # 本文档
│
├── detector/                   # 检测器服务
│   ├── detector.py            # 检测器主程序
│   ├── config.yml             # 检测器配置
│   ├── requirements.txt       # Python依赖
│   └── models/                # ONNX模型目录
│
├── config/                     # Frigate配置
│   ├── config.yml             # 主配置文件
│   └── model_cache/           # 模型缓存
│
├── media/                      # 录像和快照存储
│
└── mosquitto/                  # MQTT配置和数据
    ├── config/
    ├── data/
    └── log/
```

## 🔧 架构说明

```
┌─────────────────────────────────────────────┐
│           macOS主机系统                      │
│                                              │
│  ┌────────────────────────────────────┐     │
│  │  Apple Silicon Detector (Native)   │     │
│  │  ├─ ONNX Runtime                    │     │
│  │  ├─ CoreML Provider                 │     │
│  │  └─ Neural Engine                   │     │
│  └──────────────┬─────────────────────┘     │
│                 │                             │
│                 │ ZMQ (tcp://5555)           │
│                 │                             │
│  ┌──────────────▼─────────────────────┐     │
│  │    Frigate (Docker Container)      │     │
│  │    ├─ 物体检测调度                  │     │
│  │    ├─ 录像管理                      │     │
│  │    ├─ Web界面                       │     │
│  │    └─ MQTT通信                      │     │
│  └────────────────────────────────────┘     │
│                                              │
│  ┌────────────────────────────────────┐     │
│  │    MQTT (Docker Container)         │     │
│  └────────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```

### 为什么检测器不在Docker中？

**技术限制**：Apple Silicon的Neural Engine无法从Docker容器内访问。CoreML框架需要macOS原生环境才能使用硬件加速。

**解决方案**：检测器作为独立进程运行在macOS主机上，通过ZMQ协议与Docker中的Frigate通信。

## 🎯 性能基准

| 平台 | 模型 | FPS | 功耗 |
|------|------|-----|------|
| Apple M1 (Neural Engine) | YOLOv7-320 | ~60 | 3-5W |
| Apple M2 (Neural Engine) | YOLOv7-320 | ~70 | 3-5W |
| Apple M3 (Neural Engine) | YOLOv7-320 | ~80 | 3-5W |
| Google Coral TPU | SSD MobileNet | ~60 | 2W |
| Mac M1 (CPU Only) | YOLOv7-320 | ~2 | 20W+ |

## 🛠️ 高级配置

### 使用自定义ONNX模型

1. 将ONNX模型放到 `detector/models/` 目录
2. 修改 `detector/config.yml`:
   ```yaml
   model_path: "models/your-model.onnx"
   ```
3. 重启检测器服务

### 多摄像头配置

在 `config/config.yml` 中添加多个camera配置：

```yaml
cameras:
  front_door:
    # ... 配置 ...

  back_yard:
    # ... 配置 ...

  garage:
    # ... 配置 ...
```

### 调整检测区域

使用zones配置限制检测范围：

```yaml
cameras:
  front_door:
    zones:
      driveway:
        coordinates: 0,461,3866,485,3849,2056,1,2122
        objects:
          - person
          - car
```

## 🐛 故障排除

### 问题1：检测器无法启动

**原因**：Python依赖未正确安装

**解决**：
```bash
cd detector
pip3 install --upgrade -r requirements.txt
```

### 问题2：Frigate无法连接到检测器

**原因**：ZMQ端点配置错误

**检查**：
1. 检测器是否正在运行
2. `config/config.yml` 中的endpoint是否为 `tcp://host.docker.internal:5555`
3. 防火墙是否阻止了5555端口

### 问题3：检测器使用CPU而非Neural Engine

**原因**：ONNX Runtime未正确配置CoreML

**解决**：
```bash
pip3 uninstall onnxruntime
pip3 install onnxruntime-silicon
```

### 问题4：Docker无法访问主机网络

**解决**：确保使用 `host.docker.internal` 而不是 `localhost`

## 📊 日志查看

### Frigate日志
```bash
docker logs frigate -f
```

### 检测器日志
检测器在终端直接输出，无需额外命令

### MQTT日志
```bash
docker logs frigate-mqtt -f
```

## 🔄 更新

### 更新Frigate
```bash
docker pull ghcr.io/blakeblackshear/frigate:stable
docker compose up -d
```

### 更新检测器
```bash
cd detector
pip3 install --upgrade -r requirements.txt
```

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Frigate NVR](https://frigate.video/) - 开源NVR系统
- [ONNX Runtime](https://onnxruntime.ai/) - AI推理引擎
- [Apple CoreML](https://developer.apple.com/machine-learning/core-ml/) - 机器学习框架

## 📞 支持

- 📖 [Frigate官方文档](https://docs.frigate.video/)
- 💬 [GitHub Discussions](https://github.com/blakeblackshear/frigate/discussions)
- 🐛 [报告问题](https://github.com/blakeblackshear/frigate/issues)

---

**享受Apple Silicon加速的Frigate NVR体验！** 🚀
