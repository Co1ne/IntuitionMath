# 🚀 生产环境部署指南

## 方案 A: 一键部署脚本 (推荐) ⚡

**适用于**: Linux/macOS 系统

只需一条命令，脚本会自动完成所有配置和部署：

```bash
./deploy.sh
```

脚本会自动:
- ✅ 检查 Docker 和 Docker Compose 环境
- ✅ 创建并引导配置 .env 文件
- ✅ 验证 API Key 是否有效
- ✅ 选择可用端口（默认 8080）
- ✅ 构建并启动容器
- ✅ 输出访问地址和常用命令

**首次运行**:
1. 脚本会自动创建 .env 文件
2. 提示您填入 Gemini API Key
3. 配置完成后重新运行脚本即可部署

---

## 方案 B: Docker Compose 手动部署

**适用于**: 需要自定义配置的场景

### 1. 准备环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入您的 Gemini API Key
# API_KEY=your_gemini_api_key_here
```

### 2. 构建并启动

```bash
# 构建并启动容器（后台运行）
docker compose up -d --build
```

### 3. 验证部署

访问 `http://localhost:8080`

### 4. 管理容器

```bash
# 查看日志
docker compose logs -f

# 停止服务
docker compose down

# 重启服务
docker compose restart

# 查看容器状态
docker compose ps
```

---

## 🛠 常见问题排查

### Q: 为什么页面加载后提示 API Key 错误？
A: API Key 在构建时就被嵌入到前端代码中。请确保：
1. `.env` 文件中的 `API_KEY` 已正确配置
2. 重新构建容器：`docker compose up -d --build`

### Q: 如何修改访问端口？
A: 有两种方式：
- **使用脚本**: 运行 `./deploy.sh` 时会提示选择端口
- **手动修改**: 编辑 `docker-compose.yml` 中的 `ports` 映射（如 `"3000:80"`）

### Q: 端口被占用怎么办？
A: 
```bash
# 查看占用端口的进程
lsof -i :8080

# 或使用脚本重新部署，选择其他端口
./deploy.sh
```

### Q: 如何查看构建日志？
A:
```bash
# 实时查看所有日志
docker compose logs -f

# 只查看最近 100 行
docker compose logs --tail=100
```

### Q: 如何更新 API Key？
A:
1. 修改 `.env` 文件中的 `API_KEY`
2. 重新构建：`docker compose up -d --build`

---

## 📋 技术说明

- **多阶段构建**: 使用 Node.js 构建，nginx 提供静态文件服务
- **体积优化**: 最终镜像仅包含构建产物和 nginx
- **SPA 路由**: nginx 配置支持前端路由
- **Gzip 压缩**: 自动压缩静态资源，提升加载速度
- **健康检查**: 容器自带健康监测机制

---

## 🔒 安全建议

1. **不要将 .env 文件提交到版本控制**（已在 .gitignore 中）
2. 生产环境建议使用环境变量管理服务（如 AWS Secrets Manager）
3. 为 nginx 配置 HTTPS（生产环境推荐使用 Let's Encrypt）
