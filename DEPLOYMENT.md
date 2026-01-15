# 🚀 生产环境部署指南 (v2.1)

## 方案 A: 极速脚本部署 (推荐)
适用于 Linux/macOS 宿主机。

1. `chmod +x deploy.sh`
2. `./deploy.sh`

该脚本会自动检测您是拥有 Docker Compose 还是 NPM 环境，并选择最佳路径。

---

## 方案 B: Docker Compose 手动部署
针对现代 Docker (V2) 用户。

1. **准备环境**:
   复制模板并填入 Key:
   `cp .env.example .env`

2. **启动**:
   ```bash
   # 注意：现代 Docker 使用 docker compose 而非 docker-compose
   docker compose up -d --build
   ```

3. **验证**:
   访问 `http://your-server-ip:8080`

---

## 🛠 常见问题排查

**Q: 为什么页面加载后提示 API Key 错误？**
A: 请确保在执行 `docker compose up --build` 前，`.env` 文件中已经存在有效的 `API_KEY`。Vite 需要在编译时（Build time）将该值写入 JS 文件。

**Q: 如何修改访问端口？**
A: 在 `docker-compose.yml` 中修改 `ports` 映射，例如 `"80:80"`。
