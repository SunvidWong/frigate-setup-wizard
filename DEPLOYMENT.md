# 📦 完整部署指南

## 第一步：准备代码

### 1.1 替换 App.tsx

将您的 `frigate_frontend_app.tsx` 代码复制到 `src/App.tsx`：

```bash
# 方式 1：使用编辑器
nano src/App.tsx
# 粘贴代码，Ctrl+O 保存，Ctrl+X 退出

# 方式 2：直接复制文件
cp /path/to/frigate_frontend_app.tsx src/App.tsx

# 方式 3：使用 VS Code
code src/App.tsx
```

### 1.2 验证文件

```bash
# 检查文件是否存在
ls -lh src/App.tsx

# 查看文件前几行
head -20 src/App.tsx
```

应该看到：
```typescript
import { useState, useEffect } from 'react';
import { Save, RefreshCw, ... } from 'lucide-react';
```

## 第二步：本地测试

### 2.1 安装依赖

```bash
npm install
```

### 2.2 启动开发服务器

```bash
npm run dev
```

### 2.3 测试访问

在浏览器打开：http://localhost:5173

确认页面正常显示完整的 Frigate 配置界面。

## 第三步：创建 GitHub 仓库

### 3.1 在 GitHub 网站创建仓库

1. 访问：https://github.com/new
2. 填写信息：
   - **Repository name**: `frigate-setup-wizard`
   - **Description**: `Web-based setup wizard for Frigate NVR`
   - **Public** (必须公开才能发布 Docker 镜像)
3. ⚠️ **不要勾选** "Add a README file"
4. 点击 **Create repository**

### 3.2 配置 Git（如果需要）

```bash
# 设置用户信息
git config --global user.name "SunvidWong"
git config --global user.email "your-email@example.com"

# 查看配置
git config --list
```

## 第四步：推送到 GitHub

### 4.1 初始化仓库

```bash
git init
git add .
git commit -m "Initial commit: Frigate Setup Wizard v1.0.0"
```

### 4.2 关联远程仓库

```bash
git remote add origin https://github.com/SunvidWong/frigate-setup-wizard.git
git branch -M main
```

### 4.3 推送代码

```bash
git push -u origin main
```

如果提示需要认证：
- **用户名**: SunvidWong
- **密码**: 使用 Personal Access Token（不是 GitHub 密码）

### 4.4 创建 Personal Access Token（如果需要）

1. 访问：https://github.com/settings/tokens
2. 点击 **Generate new token** → **Generate new token (classic)**
3. 设置：
   - **Note**: `frigate-wizard-deploy`
   - **Expiration**: 选择过期时间（建议 90 days）
   - **Select scopes**: 勾选 `repo` 和 `write:packages`
4. 点击 **Generate token**
5. **复制并保存 token**（只显示一次！）
6. 在 `git push` 时使用此 token 作为密码

## 第五步：触发自动构建

### 5.1 创建版本标签

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 5.2 查看构建进度

访问：https://github.com/SunvidWong/frigate-setup-wizard/actions

- ✅ 绿色对勾 = 构建成功
- ⏳ 黄色圆圈 = 正在构建
- ❌ 红色叉号 = 构建失败（点击查看日志）

构建通常需要 5-10 分钟。

## 第六步：验证镜像

### 6.1 查看已发布的镜像

访问：https://github.com/SunvidWong/frigate-setup-wizard/pkgs/container/frigate-setup-wizard

### 6.2 拉取并测试镜像

```bash
# 拉取镜像
docker pull ghcr.io/sunvidwong/frigate-setup-wizard:latest

# 运行容器
docker run -d \
  --name frigate-wizard-test \
  -p 8080:80 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  ghcr.io/sunvidwong/frigate-setup-wizard:latest

# 等待启动
sleep 10

# 测试访问
curl http://localhost:8080

# 或在浏览器打开
# http://localhost:8080
```

### 6.3 查看日志

```bash
docker logs frigate-wizard-test
```

### 6.4 清理测试容器

```bash
docker stop frigate-wizard-test
docker rm frigate-wizard-test
```

## 第七步：创建 Release

### 7.1 在 GitHub 创建 Release

1. 访问：https://github.com/SunvidWong/frigate-setup-wizard/releases/new
2. 选择标签：`v1.0.0`
3. Release title：`v1.0.0 - Initial Release`
4. 描述：

```markdown
## ✨ Features

- 🔍 自动硬件检测（Google Coral, NVIDIA, Intel, AMD, Hailo, Rockchip）
- 🎨 现代化 React UI，支持深色/浅色主题
- 🌐 中英文双语界面
- 📹 批量导入摄像头（CSV 格式）
- 🚀 一键安装 Frigate NVR
- ⚙️ 配置管理、历史记录和模板
- 🔧 RTSP 连接测试
- 📊 实时系统日志

## 🐳 Docker 镜像

\`\`\`bash
docker pull ghcr.io/sunvidwong/frigate-setup-wizard:latest
\`\`\`

## 📖 使用文档

详见 [README.md](https://github.com/SunvidWong/frigate-setup-wizard#readme)

## 🎯 快速开始

\`\`\`bash
docker run -d \
  --name frigate-wizard \
  -p 8080:80 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd)/config:/config \
  -v $(pwd)/media:/media \
  --privileged \
  ghcr.io/sunvidwong/frigate-setup-wizard:latest
\`\`\`

访问：http://localhost:8080
```

5. 点击 **Publish release**

## 更新版本

### 修改代码后发布新版本

```bash
# 1. 修改代码
# 编辑 src/App.tsx 或其他文件

# 2. 更新版本号
# 编辑 package.json，修改 "version": "1.0.1"

# 3. 提交更改
git add .
git commit -m "feat: add new feature"
git push origin main

# 4. 创建新标签
git tag v1.0.1
git push origin v1.0.1

# 5. GitHub Actions 会自动构建新版本
```

## 故障排除

### 问题 1：git push 失败

**错误**: `Authentication failed`

**解决**:
1. 确保使用 Personal Access Token 而不是密码
2. 检查 token 是否有正确的权限
3. 尝试使用 SSH 方式：
   ```bash
   git remote set-url origin git@github.com:SunvidWong/frigate-setup-wizard.git
   ```

### 问题 2：GitHub Actions 构建失败

**解决**:
1. 查看 Actions 日志找出错误
2. 常见问题：
   - 检查 Dockerfile 语法
   - 确认 src/App.tsx 没有语法错误
   - 验证所有依赖在 package.json 中

### 问题 3：Docker 镜像无法拉取

**错误**: `unauthorized` 或 `not found`

**解决**:
1. 确认仓库是 Public
2. 等待 GitHub Actions 完成
3. 镜像名称必须小写：`ghcr.io/sunvidwong/...`
4. 检查 Package 页面确认镜像已发布

### 问题 4：npm install 失败

**解决**:
```bash
# 清除缓存
npm cache clean --force
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 问题 5：容器无法访问

**解决**:
```bash
# 检查容器状态
docker ps -a

# 查看日志
docker logs frigate-wizard

# 检查端口占用
sudo netstat -tlnp | grep :8080

# 重启容器
docker restart frigate-wizard
```

## 完整命令清单

```bash
# 1. 进入项目目录
cd frigate-setup-wizard

# 2. 替换 App.tsx（手动操作）
nano src/App.tsx  # 粘贴您的代码

# 3. 安装依赖
npm install

# 4. 本地测试
npm run dev

# 5. Git 操作
git init
git add .
git commit -m "Initial commit: Frigate Setup Wizard v1.0.0"
git remote add origin https://github.com/SunvidWong/frigate-setup-wizard.git
git branch -M main
git push -u origin main

# 6. 创建 release
git tag v1.0.0
git push origin v1.0.0

# 7. 等待构建完成（5-10分钟）

# 8. 测试镜像
docker pull ghcr.io/sunvidwong/frigate-setup-wizard:latest
docker run -d --name frigate-wizard -p 8080:80 -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/sunvidwong/frigate-setup-wizard:latest

# 9. 访问测试
curl http://localhost:8080
```

## 🎉 完成！

恭喜！您的项目已成功发布。

**项目地址**: https://github.com/SunvidWong/frigate-setup-wizard  
**镜像地址**: ghcr.io/sunvidwong/frigate-setup-wizard  
**文档地址**: https://github.com/SunvidWong/frigate-setup-wizard#readme

用户现在可以直接使用：
```bash
docker pull ghcr.io/sunvidwong/frigate-setup-wizard:latest
```
