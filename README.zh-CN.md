# 🎥 Frigate 安装向导

[English](README.md) | 简体中文

一个现代化的 Web 界面，用于快速安装和配置 Frigate NVR 系统。

## 快速开始

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

访问：http://localhost:8080

详细文档请参考 [README.md](README.md)

---

Made with ❤️ by [SunvidWong](https://github.com/SunvidWong)
