import { useState, useEffect } from 'react';
import { Save, RefreshCw, Cpu, Camera, Settings, FileText, Zap, CheckCircle, XCircle, Package, Plus, Trash2, Upload, Download, Sun, Moon, Globe, PlayCircle, AlertCircle, Monitor, History, BookOpen, Terminal, Wifi } from 'lucide-react';

const TRANSLATIONS = {
  en: {
    title: 'Frigate Configuration UI',
    subtitle: 'Hardware-accelerated NVR configuration',
    save: 'Save Config',
    hardware: 'Hardware',
    detectors: 'Detectors',
    cameras: 'Cameras',
    tools: 'Tools',
    preview: 'Preview',
    logs: 'System Logs',
    rescan: 'Rescan',
    available: 'Available',
    unavailable: 'Unavailable',
    add: 'Add',
    remove: 'Remove',
    addCamera: 'Add Camera',
    importConfig: 'Import Config',
    exportConfig: 'Export Config',
    validateConfig: 'Validate',
    configHistory: 'Config History',
    batchImport: 'Batch Import Cameras',
    templates: 'Templates',
    livePreview: 'Live Preview',
    testConnection: 'Test Connection',
    testing: 'Testing...',
    connected: 'Connected',
    failed: 'Failed',
    language: 'Language',
    theme: 'Theme',
    goToHardware: 'Go to Hardware tab to add detectors'
  },
  zh: {
    title: 'Frigate 配置界面',
    subtitle: '硬件加速 NVR 配置',
    save: '保存配置',
    hardware: '硬件',
    detectors: '检测器',
    cameras: '摄像头',
    tools: '工具',
    preview: '预览',
    logs: '系统日志',
    rescan: '重新扫描',
    available: '可用',
    unavailable: '不可用',
    add: '添加',
    remove: '移除',
    addCamera: '添加摄像头',
    importConfig: '导入配置',
    exportConfig: '导出配置',
    validateConfig: '验证配置',
    configHistory: '配置历史',
    batchImport: '批量导入摄像头',
    templates: '配置模板',
    livePreview: '实时预览',
    testConnection: '测试连接',
    testing: '测试中...',
    connected: '已连接',
    failed: '失败',
    language: '语言',
    theme: '主题',
    goToHardware: '前往硬件标签添加检测器'
  }
};

const HARDWARE_DATABASE = {
  edgetpu: [
    { id: 'coral_usb', device: 'usb', name: 'Google Coral USB Accelerator', available: false },
    { id: 'coral_pcie', device: 'pci', name: 'Google Coral M.2/PCIe Accelerator', available: false },
    { id: 'coral_dev', device: 'native', name: 'Google Coral Dev Board', available: false }
  ],
  hailo: [
    { id: 'hailo8', device: 'pcie', name: 'Hailo-8 PCIe', tops: 26, available: false },
    { id: 'hailo8l', device: 'hailo8l', name: 'Hailo-8L M.2', tops: 13, available: false },
    { id: 'hailo8l_pi', device: 'hailo8l', name: 'Hailo-8L AI Kit (Raspberry Pi 5)', tops: 13, available: false }
  ],
  nvidia: [
    { id: 'rtx4090', name: 'NVIDIA GeForce RTX 4090', memory: 24576, computeCapability: '8.9', available: false },
    { id: 'rtx4080', name: 'NVIDIA GeForce RTX 4080', memory: 16384, computeCapability: '8.9', available: false },
    { id: 'rtx4070', name: 'NVIDIA GeForce RTX 4070', memory: 12288, computeCapability: '8.9', available: false },
    { id: 'rtx3090', name: 'NVIDIA GeForce RTX 3090', memory: 24576, computeCapability: '8.6', available: false },
    { id: 'rtx3080', name: 'NVIDIA GeForce RTX 3080', memory: 10240, computeCapability: '8.6', available: false },
    { id: 'rtx3070', name: 'NVIDIA GeForce RTX 3070', memory: 8192, computeCapability: '8.6', available: false },
    { id: 'rtx3060', name: 'NVIDIA GeForce RTX 3060', memory: 12288, computeCapability: '8.6', available: false },
    { id: 'jetson_orin', name: 'NVIDIA Jetson Orin', memory: 32768, jetson: true, available: false },
    { id: 'jetson_xavier', name: 'NVIDIA Jetson Xavier NX', memory: 8192, jetson: true, available: false },
    { id: 'jetson_nano', name: 'NVIDIA Jetson Nano', memory: 4096, jetson: true, available: false }
  ],
  intel: [
    { id: 'arc_a770', name: 'Intel Arc A770', type: 'discrete', generation: '12', memory: 16384, available: false },
    { id: 'arc_a750', name: 'Intel Arc A750', type: 'discrete', generation: '12', memory: 8192, available: false },
    { id: 'uhd770', name: 'Intel UHD Graphics 770', type: 'integrated', generation: '12', available: false },
    { id: 'uhd730', name: 'Intel UHD Graphics 730', type: 'integrated', generation: '12', available: false },
    { id: 'iris_xe', name: 'Intel Iris Xe Graphics', type: 'integrated', generation: '11', available: false },
    { id: 'uhd630', name: 'Intel UHD Graphics 630', type: 'integrated', generation: '9', available: false },
    { id: 'i9_13900k', name: 'Intel Core i9-13900K', type: 'cpu', cores: 24, generation: '13', available: false },
    { id: 'i7_12700k', name: 'Intel Core i7-12700K', type: 'cpu', cores: 12, generation: '12', available: false },
    { id: 'i5_12600k', name: 'Intel Core i5-12600K', type: 'cpu', cores: 10, generation: '12', available: false }
  ],
  amd: [
    { id: 'rx7900xtx', name: 'AMD Radeon RX 7900 XTX', chipset: 'gfx1100', memory: 24576, rocmSupport: true, available: false },
    { id: 'rx7900xt', name: 'AMD Radeon RX 7900 XT', chipset: 'gfx1100', memory: 20480, rocmSupport: true, available: false },
    { id: 'rx6950xt', name: 'AMD Radeon RX 6950 XT', chipset: 'gfx1030', memory: 16384, rocmSupport: true, available: false },
    { id: 'rx6900xt', name: 'AMD Radeon RX 6900 XT', chipset: 'gfx1030', memory: 16384, rocmSupport: true, available: false },
    { id: 'rx6800xt', name: 'AMD Radeon RX 6800 XT', chipset: 'gfx1030', memory: 16384, rocmSupport: true, available: false },
    { id: 'rx6700xt', name: 'AMD Radeon RX 6700 XT', chipset: 'gfx1030', memory: 12288, rocmSupport: true, available: false },
    { id: 'ryzen9_7950x', name: 'AMD Ryzen 9 7950X', type: 'cpu', chipset: 'gfx1103', integrated: true, cores: 16, available: false },
    { id: 'ryzen7_5700g', name: 'AMD Ryzen 7 5700G', type: 'cpu', chipset: 'gfx90c', integrated: true, cores: 8, available: false }
  ],
  rockchip: [
    { id: 'rk3588', name: 'Rockchip RK3588', npu: true, cores: 3, available: false },
    { id: 'rk3576', name: 'Rockchip RK3576', npu: true, cores: 2, available: false },
    { id: 'rk3568', name: 'Rockchip RK3568', npu: true, cores: 1, available: false },
    { id: 'rk3566', name: 'Rockchip RK3566', npu: true, cores: 1, available: false }
  ]
};

const CONFIG_TEMPLATES = [
  {
    name: 'Home Security (4 Cameras)',
    description: '4 cameras with person detection',
    config: { cameras: 4, objects: ['person', 'car'], zones: true, recording: '7 days' }
  },
  {
    name: 'Business Surveillance (8 Cameras)',
    description: '8 cameras with package detection',
    config: { cameras: 8, objects: ['person', 'car', 'package'], zones: true, recording: '30 days' }
  },
  {
    name: 'Pet Monitoring',
    description: 'Focus on pet detection',
    config: { cameras: 2, objects: ['dog', 'cat'], zones: false, recording: '3 days' }
  }
];

const FRIGATE_VERSIONS = [
  { version: '0.14.1', stable: true, released: '2024-10-15' },
  { version: '0.14.0', stable: true, released: '2024-09-20' },
  { version: '0.13.2', stable: true, released: '2024-07-10' },
  { version: 'beta', stable: false, released: 'Latest Beta' }
];

const MODEL_OPTIONS: Record<string, Array<{name: string; path: string; width: number; height: number}>> = {
  edgetpu: [{ name: 'Default EdgeTPU', path: '/edgetpu_model.tflite', width: 320, height: 320 }],
  tensorrt: [{ name: 'YOLOv7-320', path: '/config/model_cache/tensorrt/yolov7-320.trt', width: 320, height: 320 }],
  openvino: [{ name: 'SSDLite MobileNet v2', path: '/openvino-model/ssdlite_mobilenet_v2.xml', width: 300, height: 300 }],
  hailo8l: [{ name: 'SSD MobileNet', path: '/config/model_cache/h8l_cache/ssd_mobilenet_v1.hef', width: 300, height: 300 }]
};

export default function FrigateConfigUI() {
  const [activeTab, setActiveTab] = useState('hardware');
  const [hardware, setHardware] = useState(HARDWARE_DATABASE);
  const [loading, setLoading] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(0);
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const [showModelSelector, setShowModelSelector] = useState<any>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [testingCamera, setTestingCamera] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean>>({});
  const [logs, setLogs] = useState<Array<{time: string; message: string}>>([]);
  const [configHistory, setConfigHistory] = useState<Array<{timestamp: string; config: any}>>([]);
  const [scanningCameras, setScanningCameras] = useState(false);
  const [discoveredCameras, setDiscoveredCameras] = useState<any[]>([]);
  const [frigateVersion, setFrigateVersion] = useState('0.14.1');
  const [containerRunning, setContainerRunning] = useState(false);
  const [showVersionSelector, setShowVersionSelector] = useState(false);
  const [showDiscovery, setShowDiscovery] = useState(false);
  
  const [config, setConfig] = useState({
    mqtt: { host: 'localhost', port: 1883 },
    detectors: [] as any[],
    cameras: [] as any[],
    ffmpeg: { hwaccelArgs: '' }
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const t = TRANSLATIONS[language];

  const scanHardware = async () => {
    setLoading(true);
    addLog('Starting hardware scan...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const updatedHardware = { ...HARDWARE_DATABASE };
    updatedHardware.edgetpu[0].available = Math.random() > 0.5;
    updatedHardware.hailo[1].available = Math.random() > 0.3;
    updatedHardware.nvidia[6].available = Math.random() > 0.4;
    updatedHardware.intel[2].available = Math.random() > 0.3;
    updatedHardware.intel[7].available = true;
    updatedHardware.amd[7].available = Math.random() > 0.6;
    
    setHardware(updatedHardware);
    
    const availableCount = Object.values(updatedHardware).flat().filter(h => h.available).length;
    addLog(`Hardware scan complete. Found ${availableCount} available devices.`);
    showMessage('success', `${t.rescan} - Found ${availableCount} devices`);
    setLoading(false);
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [{ time: timestamp, message }, ...prev.slice(0, 49)]);
  };

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const testCameraConnection = async (cameraPath: string) => {
    setTestingCamera(cameraPath);
    addLog(`Testing connection to ${cameraPath}...`);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.3;
    setConnectionStatus(prev => ({ ...prev, [cameraPath]: success }));
    
    if (success) {
      addLog(`✓ Successfully connected to ${cameraPath}`);
      showMessage('success', t.connected);
    } else {
      addLog(`✗ Failed to connect to ${cameraPath}`);
      showMessage('error', t.failed);
    }
    
    setTestingCamera(null);
  };

  const saveConfigToHistory = () => {
    const timestamp = new Date().toISOString();
    setConfigHistory(prev => [
      { timestamp, config: JSON.parse(JSON.stringify(config)) },
      ...prev.slice(0, 9)
    ]);
    addLog('Configuration saved to history');
  };

  const restoreConfigFromHistory = (historicalConfig: any) => {
    setConfig(historicalConfig);
    addLog('Configuration restored from history');
    showMessage('success', 'Config restored');
  };

  const batchImportCameras = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\n').slice(1);
          const cameras = lines.filter(line => line.trim()).map((line, idx) => {
            const [name, url] = line.split(',');
            return {
              name: name.trim() || `camera_${config.cameras.length + idx + 1}`,
              enabled: true,
              path: url.trim(),
              detect: { enabled: true, width: 1280, height: 720, fps: 5 },
              objects: { track: ['person'], filters: {} },
              zones: []
            };
          });
          
          setConfig(prev => ({
            ...prev,
            cameras: [...prev.cameras, ...cameras]
          }));
          
          addLog(`Batch imported ${cameras.length} cameras from CSV`);
          showMessage('success', `Imported ${cameras.length} cameras`);
        } catch (error: any) {
          addLog(`Error importing CSV: ${error.message}`);
          showMessage('error', 'Import failed');
        }
      };
      reader.readAsText(file);
    }
  };

  const applyTemplate = (template: typeof CONFIG_TEMPLATES[0]) => {
    const newCameras = Array.from({ length: template.config.cameras }, (_, i) => ({
      name: `camera_${i + 1}`,
      enabled: true,
      path: '',
      detect: { enabled: true, width: 1280, height: 720, fps: 5 },
      objects: { track: template.config.objects, filters: {} },
      zones: template.config.zones ? [] : undefined
    }));
    
    setConfig(prev => ({ ...prev, cameras: newCameras }));
    addLog(`Applied template: ${template.name}`);
    showMessage('success', `Template applied: ${template.name}`);
  };

  const discoverCameras = async () => {
    setScanningCameras(true);
    setShowDiscovery(true);
    setDiscoveredCameras([]);
    addLog('Starting network camera discovery...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockCameras = [
      {
        name: 'Hikvision Front Door',
        ip: '192.168.1.101',
        port: 554,
        manufacturer: 'Hikvision',
        model: 'DS-2CD2085FWD-I',
        rtspPath: 'rtsp://admin:password@192.168.1.101:554/Streaming/Channels/101',
        onvif: true,
        resolution: '3840x2160'
      },
      {
        name: 'Dahua Backyard',
        ip: '192.168.1.102',
        port: 554,
        manufacturer: 'Dahua',
        model: 'IPC-HFW5831E-ZE',
        rtspPath: 'rtsp://admin:password@192.168.1.102:554/cam/realmonitor?channel=1&subtype=0',
        onvif: true,
        resolution: '3840x2160'
      }
    ];
    
    const discovered = mockCameras.filter(() => Math.random() > 0.3);
    setDiscoveredCameras(discovered);
    
    addLog(`Discovery complete. Found ${discovered.length} cameras on network.`);
    showMessage('success', `Discovered ${discovered.length} cameras`);
    setScanningCameras(false);
  };

  const addDiscoveredCamera = (discoveredCam: any) => {
    const [width, height] = discoveredCam.resolution.split('x').map(Number);
    const newCamera = {
      name: discoveredCam.name.toLowerCase().replace(/\s+/g, '_'),
      enabled: true,
      path: discoveredCam.rtspPath,
      detect: { enabled: true, width, height, fps: 5 },
      objects: { track: ['person'], filters: {} },
      zones: [],
      manufacturer: discoveredCam.manufacturer,
      model: discoveredCam.model
    };
    
    setConfig(prev => ({
      ...prev,
      cameras: [...prev.cameras, newCamera]
    }));
    
    addLog(`Added discovered camera: ${discoveredCam.name}`);
    showMessage('success', `Added ${discoveredCam.name}`);
  };

  const startFrigateContainer = async () => {
    setLoading(true);
    addLog(`Starting Frigate container (version ${frigateVersion})...`);
    
    saveConfigToHistory();
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    addLog('Container would start with current configuration...');
    
    setContainerRunning(true);
    showMessage('success', `Frigate ${frigateVersion} container started`);
    setLoading(false);
  };

  const stopFrigateContainer = async () => {
    setLoading(true);
    addLog('Stopping Frigate container...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setContainerRunning(false);
    addLog('Frigate container stopped');
    showMessage('success', 'Container stopped');
    setLoading(false);
  };

  const addCamera = () => {
    setConfig(prev => ({
      ...prev,
      cameras: [...prev.cameras, {
        name: `camera_${prev.cameras.length + 1}`,
        enabled: true,
        path: '',
        detect: { enabled: true, width: 1280, height: 720, fps: 5 },
        objects: { track: ['person'], filters: {} },
        zones: []
      }]
    }));
    setSelectedCamera(config.cameras.length);
  };

  const updateCamera = (index: number, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      cameras: prev.cameras.map((cam, i) => i === index ? { ...cam, [field]: value } : cam)
    }));
  };

  const removeCamera = (index: number) => {
    setConfig(prev => ({ ...prev, cameras: prev.cameras.filter((_, i) => i !== index) }));
    setSelectedCamera(0);
  };

  const addDetector = (detectorInfo: any) => {
    setShowModelSelector(detectorInfo);
  };

  const confirmAddDetector = (detectorInfo: any, model: any) => {
    setConfig(prev => ({
      ...prev,
      detectors: [...prev.detectors, { ...detectorInfo, model }]
    }));
    setShowModelSelector(null);
    addLog(`Added detector: ${detectorInfo.displayName}`);
    showMessage('success', `Added ${detectorInfo.displayName}`);
  };

  const saveConfig = async () => {
    setLoading(true);
    saveConfigToHistory();
    await new Promise(resolve => setTimeout(resolve, 1000));
    addLog('Configuration saved successfully');
    showMessage('success', 'Config saved');
    setLoading(false);
  };

  useEffect(() => {
    scanHardware();
    addLog('System initialized');
  }, []);

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  const camera = config.cameras[selectedCamera];

  const HardwareSection = ({ title, items, icon: Icon, color, detectorType }: any) => (
    <div className="mb-6">
      <h3 className={`text-lg font-semibold ${textColor} mb-3 flex items-center`}>
        <Icon className={`w-5 h-5 mr-2 ${color}`} />
        {title}
      </h3>
      <div className="grid gap-3">
        {items.map((item: any) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              item.available
                ? `${cardBg} ${borderColor} hover:border-blue-400`
                : `bg-gray-100 dark:bg-gray-700 ${borderColor} opacity-60`
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className={`font-medium ${textColor}`}>{item.name}</p>
                  {item.available ? (
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                      {t.available}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                      {t.unavailable}
                    </span>
                  )}
                </div>
                <div className={`text-sm ${mutedText} space-y-0.5`}>
                  {item.device && <p>Device: {item.device}</p>}
                  {item.memory && <p>Memory: {item.memory} MB</p>}
                  {item.computeCapability && <p>Compute: {item.computeCapability}</p>}
                  {item.chipset && <p>Chipset: {item.chipset}</p>}
                  {item.generation && <p>Gen: {item.generation}</p>}
                  {item.cores && <p>Cores: {item.cores}</p>}
                  {item.tops && <p>Performance: {item.tops} TOPS</p>}
                </div>
              </div>
              <button
                onClick={() => item.available && addDetector({
                  type: detectorType,
                  device: item.device || '0',
                  displayName: item.name,
                  hardwareId: item.id
                })}
                disabled={!item.available}
                className={`ml-4 px-4 py-2 rounded-lg text-white text-sm transition-colors ${
                  item.available
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {t.add}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${bgColor}`}>
      {/* Version Selector Modal */}
      {showVersionSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-lg max-w-2xl w-full`}>
            <div className={`p-6 border-b ${borderColor}`}>
              <h3 className={`text-xl font-bold ${textColor}`}>Select Frigate Version</h3>
            </div>
            <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
              {FRIGATE_VERSIONS.map((v, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setFrigateVersion(v.version);
                    setShowVersionSelector(false);
                    addLog(`Changed Frigate version to ${v.version}`);
                    showMessage('success', `Version set to ${v.version}`);
                  }}
                  className={`p-4 border ${borderColor} rounded-lg hover:border-blue-500 cursor-pointer transition-all ${
                    frigateVersion === v.version ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${textColor}`}>Frigate {v.version}</p>
                      <p className={`text-sm ${mutedText}`}>Released: {v.released}</p>
                    </div>
                    {v.stable ? (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full font-medium">
                        Stable
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full font-medium">
                        Unstable
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className={`p-6 border-t ${borderColor}`}>
              <button onClick={() => setShowVersionSelector(false)} className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Discovery Modal */}
      {showDiscovery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-lg max-w-4xl w-full`}>
            <div className={`p-6 border-b ${borderColor} flex justify-between items-center`}>
              <h3 className={`text-xl font-bold ${textColor}`}>Discovered Cameras</h3>
              <button onClick={() => setShowDiscovery(false)} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                Close
              </button>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {scanningCameras ? (
                <div className="text-center py-12">
                  <RefreshCw className={`w-12 h-12 mx-auto mb-4 animate-spin ${textColor}`} />
                  <p className={textColor}>Scanning network for cameras...</p>
                </div>
              ) : discoveredCameras.length > 0 ? (
                <div className="space-y-3">
                  {discoveredCameras.map((cam, idx) => (
                    <div key={idx} className={`p-4 border ${borderColor} rounded-lg`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Camera className="w-5 h-5 text-blue-600" />
                            <p className={`font-semibold ${textColor}`}>{cam.name}</p>
                            {cam.onvif && (
                              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                                ONVIF
                              </span>
                            )}
                          </div>
                          <div className={`text-sm ${mutedText} space-y-1`}>
                            <p>IP: {cam.ip}:{cam.port}</p>
                            <p>Manufacturer: {cam.manufacturer} - {cam.model}</p>
                            <p>Resolution: {cam.resolution}</p>
                            <p className="font-mono text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded mt-2 break-all">
                              {cam.rtspPath}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => addDiscoveredCamera(cam)}
                          className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        >
                          Add Camera
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Camera className={`w-12 h-12 mx-auto mb-4 ${mutedText}`} />
                  <p className={mutedText}>No cameras discovered. Try scanning again.</p>
                </div>
              )}
            </div>
            <div className={`p-6 border-t ${borderColor}`}>
              <button
                onClick={discoverCameras}
                disabled={scanningCameras}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${scanningCameras ? 'animate-spin' : ''}`} />
                <span>{scanningCameras ? 'Scanning...' : 'Scan Again'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model Selector Modal */}
      {showModelSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-lg max-w-2xl w-full`}>
            <div className={`p-6 border-b ${borderColor}`}>
              <h3 className={`text-xl font-bold ${textColor}`}>Select Model for {showModelSelector.displayName}</h3>
            </div>
            <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
              {MODEL_OPTIONS[showModelSelector.type]?.map((model, idx) => (
                <div
                  key={idx}
                  onClick={() => confirmAddDetector(showModelSelector, model)}
                  className={`p-4 border ${borderColor} rounded-lg hover:border-blue-500 cursor-pointer transition-all`}
                >
                  <p className={`font-semibold ${textColor}`}>{model.name}</p>
                  <p className={mutedText}>{model.width}x{model.height}</p>
                </div>
              ))}
            </div>
            <div className={`p-6 border-t ${borderColor}`}>
              <button onClick={() => setShowModelSelector(null)} className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {showLivePreview && camera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-lg max-w-4xl w-full`}>
            <div className={`p-6 border-b ${borderColor} flex justify-between items-center`}>
              <h3 className={`text-xl font-bold ${textColor}`}>{t.livePreview}: {camera.name}</h3>
              <button onClick={() => setShowLivePreview(false)} className="px-4 py-2 bg-gray-600 text-white rounded-lg">
                Close
              </button>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                {camera.path ? (
                  <div className="text-center">
                    <Monitor className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400">RTSP Stream: {camera.path}</p>
                    <p className={mutedText}>Live preview would display here</p>
                  </div>
                ) : (
                  <p className="text-gray-400">No RTSP URL configured</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`${cardBg} border-b ${borderColor} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Camera className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className={`text-2xl font-bold ${textColor}`}>{t.title}</h1>
                <p className={mutedText}>{t.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">v{frigateVersion}</span>
                <button
                  onClick={() => setShowVersionSelector(true)}
                  className="ml-2 text-xs text-blue-600 hover:text-blue-700"
                >
                  Change
                </button>
              </div>
              {containerRunning ? (
                <button
                  onClick={stopFrigateContainer}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Stop Container</span>
                </button>
              ) : (
                <button
                  onClick={startFrigateContainer}
                  disabled={loading || config.cameras.length === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Run Frigate</span>
                </button>
              )}
              <button
                onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                className={`p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600`}
                title={t.language}
              >
                <Globe className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={`p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600`}
                title={t.theme}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <button onClick={saveConfig} disabled={loading} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                <Save className="w-4 h-4" />
                <span>{t.save}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message Toast */}
      {message.text && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
            {message.text}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className={`flex space-x-1 ${cardBg} rounded-lg p-1 shadow-sm border ${borderColor}`}>
          {[
            { id: 'hardware', icon: Zap, label: t.hardware },
            { id: 'detectors', icon: Cpu, label: t.detectors },
            { id: 'cameras', icon: Camera, label: t.cameras },
            { id: 'tools', icon: Settings, label: t.tools },
            { id: 'logs', icon: Terminal, label: t.logs },
            { id: 'preview', icon: FileText, label: t.preview }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-3 rounded-lg transition-colors ${
                activeTab === tab.id ? 'bg-blue-600 text-white' : `${textColor} hover:bg-gray-100 dark:hover:bg-gray-700`
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 mt-6 pb-12">
        {activeTab === 'hardware' && (
          <div className={`${cardBg} rounded-lg shadow-sm border ${borderColor} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold ${textColor}`}>{t.hardware}</h2>
              <button onClick={scanHardware} disabled={loading} className={`flex items-center space-x-2 px-4 py-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50`}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{t.rescan}</span>
              </button>
            </div>
            <div className="space-y-8">
              <HardwareSection title="Google Coral Edge TPU" items={hardware.edgetpu} icon={Zap} color="text-green-600" detectorType="edgetpu" />
              <HardwareSection title="Hailo AI Accelerators" items={hardware.hailo} icon={Zap} color="text-purple-600" detectorType="hailo8l" />
              <HardwareSection title="NVIDIA GPUs (TensorRT)" items={hardware.nvidia} icon={Cpu} color="text-green-700" detectorType="tensorrt" />
              <HardwareSection title="Intel Hardware (OpenVINO)" items={hardware.intel} icon={Cpu} color="text-blue-600" detectorType="openvino" />
              <HardwareSection title="AMD GPUs (ROCm)" items={hardware.amd} icon={Cpu} color="text-red-600" detectorType="rocm" />
              <HardwareSection title="Rockchip NPU" items={hardware.rockchip} icon={Cpu} color="text-orange-600" detectorType="rknn" />
            </div>
          </div>
        )}

        {activeTab === 'detectors' && (
          <div className={`${cardBg} rounded-lg shadow-sm border ${borderColor} p-6`}>
            <h2 className={`text-xl font-semibold ${textColor} mb-4`}>{t.detectors}</h2>
            {config.detectors.length > 0 ? (
              <div className="space-y-3">
                {config.detectors.map((d, idx) => (
                  <div key={idx} className="p-4 bg-green-50 dark:bg-green-900 border-2 border-green-200 dark:border-green-700 rounded-lg flex justify-between">
                    <div>
                      <p className={`font-semibold ${textColor}`}>{d.displayName}</p>
                      <p className={`text-sm ${mutedText}`}>Type: {d.type} | Device: {d.device}</p>
                    </div>
                    <button onClick={() => setConfig(prev => ({ ...prev, detectors: prev.detectors.filter((_, i) => i !== idx) }))} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      {t.remove}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Cpu className={`w-12 h-12 mx-auto mb-4 ${mutedText}`} />
                <p className={mutedText}>{t.goToHardware}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'cameras' && (
          <div className="grid grid-cols-4 gap-6">
            <div className={`col-span-1 ${cardBg} rounded-lg shadow-sm border ${borderColor} p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${textColor}`}>{t.cameras}</h3>
                <button onClick={addCamera} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {config.cameras.map((cam, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCamera(idx)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      selectedCamera === idx ? 'bg-blue-50 dark:bg-blue-900 border-2 border-blue-500' : `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} hover:bg-gray-100 dark:hover:bg-gray-600`
                    }`}
                  >
                    <p className={`font-medium text-sm ${textColor}`}>{cam.name}</p>
                    <p className={`text-xs ${mutedText}`}>{cam.enabled ? t.available : t.unavailable}</p>
                  </button>
                ))}
              </div>
            </div>

            {camera && (
              <div className={`col-span-3 ${cardBg} rounded-lg shadow-sm border ${borderColor} p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${textColor}`}>{camera.name}</h3>
                  <div className="flex space-x-2">
                    <button onClick={() => setShowLivePreview(true)} className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700">
                      <Monitor className="w-4 h-4" />
                      <span>{t.livePreview}</span>
                    </button>
                    <button onClick={() => removeCamera(selectedCamera)} className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>Camera Name</label>
                    <input type="text" value={camera.name} onChange={(e) => updateCamera(selectedCamera, 'name', e.target.value)} className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} ${textColor}`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>RTSP URL</label>
                    <div className="flex space-x-2">
                      <input type="text" value={camera.path} onChange={(e) => updateCamera(selectedCamera, 'path', e.target.value)} placeholder="rtsp://user:pass@ip:port/stream" className={`flex-1 px-3 py-2 border ${borderColor} rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} ${textColor}`} />
                      <button
                        onClick={() => testCameraConnection(camera.path)}
                        disabled={!camera.path || testingCamera === camera.path}
                        className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        <Wifi className="w-4 h-4" />
                        <span>{testingCamera === camera.path ? t.testing : t.testConnection}</span>
                      </button>
                    </div>
                    {connectionStatus[camera.path] !== undefined && (
                      <div className={`mt-2 text-sm ${connectionStatus[camera.path] ? 'text-green-600' : 'text-red-600'}`}>
                        {connectionStatus[camera.path] ? `✓ ${t.connected}` : `✗ ${t.failed}`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tools' && (
          <div className={`${cardBg} rounded-lg shadow-sm border ${borderColor} p-6`}>
            <h2 className={`text-xl font-semibold ${textColor} mb-6`}>{t.tools}</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <button
                onClick={discoverCameras}
                disabled={scanningCameras}
                className="flex items-center justify-center space-x-2 p-4 border-2 border-cyan-500 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900 disabled:opacity-50"
              >
                <Wifi className={`w-5 h-5 text-cyan-600 ${scanningCameras ? 'animate-pulse' : ''}`} />
                <span className={textColor}>{scanningCameras ? 'Scanning...' : 'Discover Cameras'}</span>
              </button>
              <label className="flex items-center justify-center space-x-2 p-4 border-2 border-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900 cursor-pointer">
                <Upload className="w-5 h-5 text-green-600" />
                <span className={textColor}>{t.importConfig}</span>
                <input type="file" accept=".yml,.yaml" className="hidden" />
              </label>
              <button className="flex items-center justify-center space-x-2 p-4 border-2 border-purple-500 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900">
                <Download className="w-5 h-5 text-purple-600" />
                <span className={textColor}>{t.exportConfig}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <button className="flex items-center justify-center space-x-2 p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <span className={textColor}>{t.validateConfig}</span>
              </button>
              <label className={`flex items-center justify-center space-x-2 p-4 border-2 border-orange-500 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900 cursor-pointer`}>
                <Upload className="w-5 h-5 text-orange-600" />
                <span className={textColor}>{t.batchImport}</span>
                <input type="file" accept=".csv" onChange={batchImportCameras} className="hidden" />
              </label>
              <button
                onClick={() => setShowVersionSelector(true)}
                className="flex items-center justify-center space-x-2 p-4 border-2 border-indigo-500 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900"
              >
                <Package className="w-5 h-5 text-indigo-600" />
                <span className={textColor}>Version: {frigateVersion}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className={`text-lg font-semibold ${textColor} mb-3 flex items-center`}>
                  <History className="w-5 h-5 mr-2" />
                  {t.configHistory}
                </h3>
                <div className="space-y-2">
                  {configHistory.length > 0 ? (
                    configHistory.slice(0, 5).map((item, idx) => (
                      <div key={idx} className={`p-3 border ${borderColor} rounded-lg flex justify-between items-center`}>
                        <div>
                          <p className={`text-sm ${textColor}`}>{new Date(item.timestamp).toLocaleString()}</p>
                          <p className={`text-xs ${mutedText}`}>{item.config.cameras.length} cameras, {item.config.detectors.length} detectors</p>
                        </div>
                        <button onClick={() => restoreConfigFromHistory(item.config)} className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                          Restore
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className={mutedText}>No history available</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className={`text-lg font-semibold ${textColor} mb-3 flex items-center`}>
                  <BookOpen className="w-5 h-5 mr-2" />
                  {t.templates}
                </h3>
                <div className="space-y-2">
                  {CONFIG_TEMPLATES.map((template, idx) => (
                    <div key={idx} className={`p-3 border ${borderColor} rounded-lg`}>
                      <p className={`font-medium ${textColor}`}>{template.name}</p>
                      <p className={`text-xs ${mutedText} mb-2`}>{template.description}</p>
                      <button onClick={() => applyTemplate(template)} className="w-full px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                        Apply Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className={`text-lg font-semibold ${textColor} mb-3 flex items-center`}>
                <PlayCircle className="w-5 h-5 mr-2" />
                Container Management
              </h3>
              <div className={`p-4 border-2 ${borderColor} rounded-lg ${containerRunning ? 'bg-green-50 dark:bg-green-900' : 'bg-gray-50 dark:bg-gray-800'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className={`font-medium ${textColor}`}>Frigate Container Status</p>
                    <p className={`text-sm ${mutedText}`}>Version: {frigateVersion}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {containerRunning ? (
                      <span className="flex items-center px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Running
                      </span>
                    ) : (
                      <span className="flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                        <XCircle className="w-4 h-4 mr-1" />
                        Stopped
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {containerRunning ? (
                    <>
                      <button
                        onClick={stopFrigateContainer}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Stop Container</span>
                      </button>
                      <button
                        onClick={() => window.open('http://localhost:5000', '_blank')}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Monitor className="w-4 h-4" />
                        <span>Open Web UI</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={startFrigateContainer}
                      disabled={loading || config.cameras.length === 0}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Start Container</span>
                    </button>
                  )}
                </div>
                {!containerRunning && config.cameras.length === 0 && (
                  <p className="mt-2 text-sm text-orange-600">⚠ Add at least one camera before starting</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className={`${cardBg} rounded-lg shadow-sm border ${borderColor} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${textColor}`}>{t.logs}</h2>
              <button onClick={() => setLogs([])} className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                Clear Logs
              </button>
            </div>
            <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm`}>
              {logs.map((log, idx) => (
                <div key={idx} className={`mb-1 ${theme === 'dark' ? 'text-green-400' : 'text-gray-800'}`}>
                  <span className={mutedText}>[{log.time}]</span> {log.message}
                </div>
              ))}
              {logs.length === 0 && (
                <p className={mutedText}>No logs yet...</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className={`${cardBg} rounded-lg shadow-sm border ${borderColor} p-6`}>
            <h2 className={`text-xl font-semibold ${textColor} mb-4`}>{t.preview}</h2>
            <pre className={`${theme === 'dark' ? 'bg-gray-900 text-green-400' : 'bg-gray-900 text-green-400'} p-4 rounded-lg overflow-x-auto text-sm font-mono`}>
{`mqtt:
  host: ${config.mqtt.host}
  port: ${config.mqtt.port}
${config.ffmpeg.hwaccelArgs ? `
ffmpeg:
  hwaccel_args: ${config.ffmpeg.hwaccelArgs}` : ''}

detectors:
${config.detectors.map((d, i) => `  detector_${i}:
    type: ${d.type}
    device: ${d.device || 'auto'}`).join('\n')}

cameras:
${config.cameras.map(c => `  ${c.name}:
    enabled: ${c.enabled}
    ffmpeg:
      inputs:
        - path: ${c.path || 'rtsp://...'}
          roles: [detect, record]
    detect:
      width: ${c.detect.width}
      height: ${c.detect.height}
      fps: ${c.detect.fps}`).join('\n')}`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}