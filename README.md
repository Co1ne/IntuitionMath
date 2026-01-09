
# 📐 IntuitionMath: Calculus Architect

> **微积分直觉建筑师** —— 一个受 3Blue1Brown 启发的交互式数学直觉引擎。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Framework: React 19](https://img.shields.io/badge/Framework-React_19-61DAFB.svg)](https://reactjs.org/)
[![AI: Gemini 2.0](https://img.shields.io/badge/AI-Gemini_2.0-orange.svg)](https://ai.google.dev/)

`IntuitionMath` 旨在将枯燥的代数演算转化为生动的几何叙事。通过 **结构化推导 (Structured Derivations)**、**实时动态可视化 (D3.js)** 与 **上下文感知 AI 导师 (Gemini API)** 的深度集成，帮助学习者构建真正的数学“体感”。

---

## ✨ 核心特性

- 🏛️ **叙事化教学**：每个数学概念被拆解为 5-6 步严谨的推导故事线，从直觉观察到形式化证明。
- 🔮 **动态几何引擎**：基于 D3.js 的交互式画布，实时响应参数变化（如 $\epsilon, \delta, h, n$）。
- 🤖 **Context-Aware AI**：AI 导师实时监控当前的推导步骤与图像状态，提供针对性的几何阐述。
- 🎨 **极简审美**：高对比度、暗黑系 UI 设计，适配现代工程审美。

## 🛠️ 技术堆栈

- **Frontend**: React 19 (ESM Modules)
- **Visualization**: D3.js + Math.js (用于高精度解析与渲染)
- **AI Engine**: Google Gemini API (@google/genai)
- **Styling**: Tailwind CSS
- **Typographies**: Inter + JetBrains Mono

---

## 🚀 快速开始

1. **配置 API Key**:
   确保您的环境中配置了 `process.env.API_KEY`。
2. **启动应用**:
   直接在支持现代 ES6 模块的浏览器中打开 `index.html`。

---

## 🗺️ 项目结构

```text
├── App.tsx             # 应用主入口，状态编排中心
├── types.ts            # 严格的数学模型与状态定义
├── constants.ts        # 核心内容矩阵（Units, Topics, Storylines）
├── services/           # 外部服务接口 (Gemini API)
├── components/         # 原子化交互组件
│   ├── VisualPanel     # D3 几何渲染引擎
│   ├── DerivationPanel # 故事线步进器
│   └── AIChatPanel     # 交互式对话终端
```

## 📜 开源协议
本项目采用 [MIT License](LICENSE) 协议。
