
# 📖 新增章节/主题技术指南

本应用采用**内容驱动架构**，新增一个主题通常需要修改四个位置。

### 第一步：注册 Topic ID (`types.ts`)
在 `MathTopic` 枚举中新增你的主题，例如：
```typescript
export enum MathTopic {
  // ... 现有主题
  FOURIER_TRANSFORM = 'FOURIER_TRANSFORM' // 新增
}
```

### 第二步：编排推导逻辑 (`constants.ts`)
在 `TOPIC_REGISTRY` 中定义该主题的“故事线”：
```typescript
[MathTopic.FOURIER_TRANSFORM]: {
  id: MathTopic.FOURIER_TRANSFORM,
  name: '傅里叶变换：圆周的舞蹈',
  initialVisualState: { functionString: 'sin(x)', param1: 1 },
  aiSystemPrompt: "引导用户理解频率域。将信号看作是一系列旋转向量的叠加。",
  steps: [
    { 
      id: 'ft-1', 
      title: '1. 缠绕频率', 
      goal: '观察波形变化', 
      assumption: 'f = 1Hz', 
      expression: 'e^(iwt)', 
      explanation: '当我们将正弦波缠绕在圆周上...',
      visualHint: { param1: 1 } 
    },
    // 更多步骤...
  ]
}
```

### 第三步：挂载到目录 (`constants.ts`)
将主题放入对应的单元 `UNITS` 中：
```typescript
{ 
  id: 'u9', 
  name: 'Unit 9 信号分析', 
  shortName: 'SIG', 
  chapters: [
    { id: 'ch9_1', name: '傅里叶分析', topics: [{ id: MathTopic.FOURIER_TRANSFORM, name: '傅里叶变换' }] }
  ]
}
```

### 第四步：编写可视化逻辑 (`VisualPanel.tsx`)
在 `RENDER_STRATEGIES` 中实现几何绘制。你可以通过 `state.param1` 和 `state.param2` 获取当前步骤的交互参数：
```typescript
[MathTopic.FOURIER_TRANSFORM]: () => {
  // 使用 D3.js 绘制旋转向量、圆周缠绕效果等
  const freq = state.param1;
  // ... 绘图代码
}
```

---

### 💡 提示
- **AI 联调**：AI 会自动获取你在 `TOPIC_REGISTRY` 中填写的 `aiSystemPrompt`。
- **视觉联动**：通过 `visualHint` 属性，你可以让应用在用户点击某个推导步骤时，自动调整图像的缩放或特定参数。
