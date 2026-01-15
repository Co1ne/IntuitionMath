#!/bin/bash
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   IntuitionMath 一键部署脚本${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误: Docker 未安装${NC}"
    echo "请先安装 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! docker compose version &> /dev/null; then
    echo -e "${RED}错误: Docker Compose 未安装${NC}"
    echo "请先安装 Docker Compose (通常随 Docker Desktop 自动安装)"
    exit 1
fi

# 检查 .env 文件
if [ ! -f .env ]; then
    echo -e "${YELLOW}未找到 .env 文件，从 .env.example 创建...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}请编辑 .env 文件，填入您的 Gemini API Key${NC}"
    echo -e "${YELLOW}然后重新运行此脚本${NC}"
    
    # 尝试打开编辑器
    if command -v nano &> /dev/null; then
        read -p "是否现在编辑 .env 文件? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            nano .env
        else
            exit 0
        fi
    else
        exit 0
    fi
fi

# 验证 API_KEY 是否配置
source .env
if [ -z "$API_KEY" ] || [ "$API_KEY" = "your_gemini_api_key_here" ]; then
    echo -e "${RED}错误: 请先在 .env 文件中配置有效的 API_KEY${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 环境检查通过${NC}"
echo ""

# 询问端口
DEFAULT_PORT=8080
read -p "请输入要使用的端口 (默认: $DEFAULT_PORT): " PORT
PORT=${PORT:-$DEFAULT_PORT}

# 检查端口是否被占用
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${RED}错误: 端口 $PORT 已被占用${NC}"
    echo "请选择其他端口或停止占用该端口的服务"
    exit 1
fi

echo -e "${GREEN}✓ 端口 $PORT 可用${NC}"
echo ""

# 更新 docker-compose.yml 中的端口
echo -e "${YELLOW}更新 docker-compose.yml 端口配置...${NC}"
sed -i.bak "s/- \"[0-9]*:80\"/- \"$PORT:80\"/g" docker-compose.yml
rm -f docker-compose.yml.bak

# 停止旧容器（如果存在）
echo -e "${YELLOW}清理旧容器...${NC}"
docker compose down 2>/dev/null || true

# 构建并启动
echo -e "${YELLOW}开始构建和部署...${NC}"
echo ""
docker compose up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}   部署成功！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "访问地址: ${GREEN}http://localhost:$PORT${NC}"
    echo ""
    echo "常用命令:"
    echo "  查看日志: docker compose logs -f"
    echo "  停止服务: docker compose down"
    echo "  重启服务: docker compose restart"
    echo ""
else
    echo -e "${RED}部署失败，请检查错误信息${NC}"
    exit 1
fi