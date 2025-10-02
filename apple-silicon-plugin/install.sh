#!/bin/bash

# Frigate Apple Silicon检测器安装脚本
# 适用于macOS Apple Silicon (M1/M2/M3)

set -e

echo "=========================================="
echo "Frigate Apple Silicon Detector 安装程序"
echo "=========================================="
echo ""

# 检查系统
if [[ "$(uname)" != "Darwin" ]]; then
    echo "❌ 错误：此脚本仅支持macOS系统"
    exit 1
fi

if [[ "$(uname -m)" != "arm64" ]]; then
    echo "❌ 错误：此脚本仅支持Apple Silicon (M1/M2/M3)"
    exit 1
fi

echo "✓ 系统检查通过: macOS Apple Silicon"
echo ""

# 检查Python3
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误：未找到Python 3"
    echo "请先安装Python 3: brew install python3"
    exit 1
fi

echo "✓ Python版本: $(python3 --version)"
echo ""

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo "❌ 错误：未找到Docker"
    echo "请先安装Docker Desktop for Mac"
    echo "下载地址: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "✓ Docker版本: $(docker --version)"
echo ""

# 创建必要的目录
echo "创建目录结构..."
mkdir -p detector/models
mkdir -p config/model_cache
mkdir -p media
mkdir -p mosquitto/data
mkdir -p mosquitto/log

echo "✓ 目录创建完成"
echo ""

# 安装Python依赖
echo "安装Python依赖包..."
cd detector
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✓ Python依赖安装完成"
else
    echo "❌ Python依赖安装失败"
    exit 1
fi

cd ..
echo ""

# 下载ONNX模型（可选）
echo "是否下载默认YOLO模型? (y/n)"
read -r download_model

if [[ "$download_model" == "y" || "$download_model" == "Y" ]]; then
    echo "下载YOLO模型..."
    # TODO: 添加模型下载链接
    echo "⚠ 请手动下载模型并放置到 detector/models/ 目录"
fi

echo ""

# 创建快捷启动脚本
echo "创建启动脚本..."
cat > start-detector.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/detector"
echo "启动Apple Silicon检测器..."
python3 detector.py
EOF

chmod +x start-detector.sh

cat > start-all.sh << 'EOF'
#!/bin/bash
echo "启动Frigate和检测器..."
echo ""
echo "第1步：启动Docker服务..."
docker compose up -d

echo ""
echo "第2步：等待Frigate启动(10秒)..."
sleep 10

echo ""
echo "第3步：启动Apple Silicon检测器..."
echo "注意：检测器窗口必须保持打开"
echo ""
./start-detector.sh
EOF

chmod +x start-all.sh

cat > stop-all.sh << 'EOF'
#!/bin/bash
echo "停止所有服务..."
docker compose down
echo "✓ 服务已停止"
EOF

chmod +x stop-all.sh

echo "✓ 启动脚本创建完成"
echo ""

# 完成
echo "=========================================="
echo "✓ 安装完成！"
echo "=========================================="
echo ""
echo "下一步操作："
echo ""
echo "1. 编辑配置文件："
echo "   - config/config.yml (Frigate配置)"
echo "   - detector/config.yml (检测器配置)"
echo ""
echo "2. 添加摄像头配置到 config/config.yml"
echo ""
echo "3. 启动服务："
echo "   ./start-all.sh"
echo ""
echo "4. 访问Frigate Web界面："
echo "   http://localhost:5000"
echo ""
echo "5. 停止服务："
echo "   ./stop-all.sh"
echo ""
echo "详细文档请查看 README.md"
echo ""
