#!/usr/bin/env python3
"""
Apple Silicon Detector for Frigate NVR
使用Apple Neural Engine进行物体检测
"""

import zmq
import numpy as np
import onnxruntime as ort
import yaml
import logging
import sys
from pathlib import Path

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)


class AppleSiliconDetector:
    def __init__(self, config_path="config.yml"):
        """初始化Apple Silicon检测器"""
        self.config = self.load_config(config_path)
        self.session = None
        self.setup_onnx_runtime()
        self.setup_zmq()

    def load_config(self, config_path):
        """加载配置文件"""
        config_file = Path(config_path)
        if config_file.exists():
            with open(config_file, 'r') as f:
                return yaml.safe_load(f)
        else:
            logger.warning(f"配置文件 {config_path} 不存在，使用默认配置")
            return {
                'model_path': 'models/yolov7-320.onnx',
                'zmq_endpoint': 'tcp://0.0.0.0:5555',
                'input_size': [320, 320],
                'conf_threshold': 0.5,
                'iou_threshold': 0.45
            }

    def setup_onnx_runtime(self):
        """设置ONNX Runtime使用CoreML"""
        try:
            model_path = self.config.get('model_path', 'models/yolov7-320.onnx')

            # 配置ONNX Runtime使用CoreML (Neural Engine)
            providers = ['CoreMLExecutionProvider', 'CPUExecutionProvider']

            logger.info(f"加载模型: {model_path}")
            logger.info(f"执行提供者: {providers}")

            self.session = ort.InferenceSession(
                model_path,
                providers=providers
            )

            # 获取模型信息
            input_name = self.session.get_inputs()[0].name
            output_names = [output.name for output in self.session.get_outputs()]

            logger.info(f"模型输入: {input_name}")
            logger.info(f"模型输出: {output_names}")
            logger.info("✓ ONNX Runtime 初始化成功")

            # 检查是否使用了CoreML
            if 'CoreMLExecutionProvider' in self.session.get_providers():
                logger.info("✓ 使用 Apple Neural Engine 加速")
            else:
                logger.warning("⚠ 未使用 Neural Engine，降级到CPU")

        except Exception as e:
            logger.error(f"模型加载失败: {e}")
            sys.exit(1)

    def setup_zmq(self):
        """设置ZMQ通信"""
        try:
            endpoint = self.config.get('zmq_endpoint', 'tcp://0.0.0.0:5555')

            context = zmq.Context()
            self.socket = context.socket(zmq.REP)
            self.socket.bind(endpoint)

            logger.info(f"✓ ZMQ服务器启动: {endpoint}")
            logger.info("等待Frigate连接...")

        except Exception as e:
            logger.error(f"ZMQ初始化失败: {e}")
            sys.exit(1)

    def preprocess(self, image_data):
        """预处理图像"""
        # 这里需要根据具体模型调整预处理逻辑
        image = np.frombuffer(image_data, dtype=np.uint8)
        # TODO: 添加图像预处理代码
        return image

    def postprocess(self, outputs):
        """后处理检测结果"""
        # TODO: 添加后处理代码（NMS等）
        detections = []
        return detections

    def detect(self, image_data):
        """执行检测"""
        try:
            # 预处理
            input_tensor = self.preprocess(image_data)

            # 推理
            input_name = self.session.get_inputs()[0].name
            outputs = self.session.run(None, {input_name: input_tensor})

            # 后处理
            detections = self.postprocess(outputs)

            return detections

        except Exception as e:
            logger.error(f"检测失败: {e}")
            return []

    def run(self):
        """运行检测服务"""
        logger.info("Apple Silicon Detector 服务运行中...")
        logger.info("按 Ctrl+C 停止服务")

        try:
            while True:
                # 接收来自Frigate的检测请求
                message = self.socket.recv()

                # 执行检测
                detections = self.detect(message)

                # 发送检测结果
                self.socket.send_json(detections)

        except KeyboardInterrupt:
            logger.info("\n收到停止信号，正在关闭...")
        except Exception as e:
            logger.error(f"运行错误: {e}")
        finally:
            self.socket.close()
            logger.info("服务已停止")


def main():
    logger.info("=" * 60)
    logger.info("Apple Silicon Detector for Frigate NVR")
    logger.info("=" * 60)

    detector = AppleSiliconDetector()
    detector.run()


if __name__ == "__main__":
    main()
