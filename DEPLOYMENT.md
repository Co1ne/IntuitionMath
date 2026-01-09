# 🚀 生产环境部署指南 (2.0)

本文档提供两种在自有服务器上部署 **IntuitionMath** 的“一键”方案。

## 方案 A: 自动化脚本部署 (推荐用于 Linux 服务器)

如果您直接在服务器宿主机上运行：

1. **赋予权限**:
   ```bash
   chmod +x deploy.sh
   ```

2. **执行部署**:
   ```bash
   ./deploy.sh
   ```
   脚本将引导您输入 API Key 并自动完成构建。

---

## 方案 B: Docker 容器部署 (推荐用于云原生环境)

如果您希望环境彻底隔离且易于迁移：

1. **配置环境变量**:
   在项目根目录创建 `.env` 文件并填入 `API_KEY=your_key`。

2. **一键启动**:
   ```bash
   docker-compose up -d --build
   ```
   应用将在服务器的 `8080` 端口上线。

---

## 🔍 运维巡检

- **查看日志**: `docker-compose logs -f`
- **重启服务**: `docker-compose restart`
- **更新应用**:
  ```bash
  git pull
  ./deploy.sh
  ```

## ⚙️ Nginx 进阶配置
建议在 `deploy.sh` 构建完成后，使用 Nginx 进行反向代理并开启 HTTPS。参考 `DEPLOYMENT.md` 1.0 版本的 Nginx 配置示例。
