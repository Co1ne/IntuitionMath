
import { DerivationStep, MathTopic, Chapter } from './types';

export interface Unit {
  id: string;
  name: string;
  shortName: string;
  chapters: Chapter[];
}

export const UNITS: Unit[] = [
  {
    id: 'u1',
    name: '极限与连续性',
    shortName: 'LIM',
    chapters: [
      {
        id: 'ch1_1',
        name: '极限定义',
        topics: [
          { id: MathTopic.LIMIT_DEFINITION, name: 'ε-δ 定义' },
          { id: MathTopic.SQUEEZE_THEOREM, name: '夹逼准则' },
        ]
      },
    ]
  },
  {
    id: 'u2',
    name: '一元函数导数',
    shortName: 'DER',
    chapters: [
      {
        id: 'ch2_1',
        name: '导数本质',
        topics: [
          { id: MathTopic.DERIVATIVE_BASIC, name: '几何意义' },
          { id: MathTopic.LHOPITAL_RULE, name: '洛必达法则' },
        ]
      }
    ]
  },
  {
    id: 'u3',
    name: '微分中值定理',
    shortName: 'MVT',
    chapters: [
      {
        id: 'ch3_1',
        name: '核心定理',
        topics: [
          { id: MathTopic.MVT_LAGRANGE, name: '拉格朗日' },
          { id: MathTopic.TAYLOR_SERIES, name: '泰勒级数' },
        ]
      }
    ]
  },
  {
    id: 'u4',
    name: '积分学',
    shortName: 'INT',
    chapters: [
      {
        id: 'ch4_1',
        name: '定积分',
        topics: [
          { id: MathTopic.INTEGRAL_BASIC, name: '黎曼和' },
          { id: MathTopic.FTC, name: '基本定理' },
        ]
      }
    ]
  },
  {
    id: 'u5',
    name: '高级课题',
    shortName: 'ADV',
    chapters: [
      {
        id: 'ch5_1',
        name: '多元与方程',
        topics: [
          { id: MathTopic.MULTIVARIABLE, name: '偏导数' },
          { id: MathTopic.DIFF_EQUATIONS, name: '微分方程' }
        ]
      }
    ]
  }
];

export const TOPIC_CONTENT: Record<MathTopic, DerivationStep[]> = {
  [MathTopic.TAYLOR_SERIES]: [
    {
      id: 't-0',
      title: '任务：函数“指纹”克隆',
      goal: '构造一个多项式 P(x)，使其在 x₀ 表现得和 f(x) 一模一样',
      assumption: 'P(x₀)=f(x₀), P\'(x₀)=f\'(x₀)...',
      expression: 'P(x) ≈ f(x)',
      explanation: '如果两个函数在某一点的坐标、斜率、弯曲度（所有阶导数）都相同，那么它们在该点附近的行为必然极其相似。这就是泰勒展开的野心。',
      isCompleted: true
    },
    {
      id: 't-1',
      title: '零阶：位置同步',
      goal: '至少要确保两个函数在起点重合',
      assumption: 'P(x₀) = f(x₀)',
      expression: 'P₀(x) = f(x₀)',
      explanation: '这是最基础的拟合。此时 P(x) 只是一个常数（水平线），它抓住了函数此时此刻的值，但对未来的走向一无所知。',
      isCompleted: true
    },
    {
      id: 't-2',
      title: '一阶：速度同步（线性近似）',
      goal: '让拟合多项式的斜率也保持一致',
      assumption: "P'(x₀) = f'(x₀)",
      expression: "P₁(x) = f(x₀) + f'(x₀)(x - x₀)",
      explanation: '我们增加了一个线性项。现在 P(x) 不仅在点上重合，还能顺着函数的切线方向延伸。这本质上就是微分的线性近似。',
      isCompleted: false,
      prerequisites: [{ name: '导数的几何意义', topicId: MathTopic.DERIVATIVE_BASIC }]
    },
    {
      id: 't-3',
      title: '二阶：弯曲度同步（为什么是 1/2？）',
      goal: '匹配函数的“加速度”',
      assumption: "P''(x₀) = f''(x₀)",
      expression: "P₂(x) = P₁(x) + ½ f''(x₀)(x - x₀)²",
      explanation: '注意那个 1/2。当我们对 (x-x₀)² 求导两次时，幂函数会滚下来一个系数 2。为了抵消它并精准匹配 f\'\'(x₀)，我们必须在分母预置一个 2。这开启了阶乘序列的序幕。',
      isCompleted: false
    },
    {
      id: 't-4',
      title: '高阶：阶乘的必然性',
      goal: '推广到 n 阶导数同步',
      assumption: 'P⁽ⁿ⁾(x₀) = f⁽ⁿ⁾(x₀)',
      expression: 'Σ [f⁽ᵏ⁾(x₀) / k!] (x - x₀)ᵏ',
      explanation: '每多求一次导，(x-x₀)ⁿ 就会多滚下一个系数。求导 n 次后会产生 n!。为了让 P⁽ⁿ⁾ 依然等于 f⁽ⁿ⁾，分母必须是 k!。阶乘不是数学家的恶作剧，而是幂函数求导规则的必然产物。',
      isCompleted: false
    },
    {
      id: 't-5',
      title: '余项：未竟的旅程',
      goal: '描述拟合与真实函数之间的鸿沟',
      assumption: 'Rₙ(x) = f(x) - Pₙ(x)',
      expression: 'Rₙ(x) = [f⁽ⁿ⁺¹⁾(ξ) / (n+1)!] (x - x₀)ⁿ⁺¹',
      explanation: '泰勒展开通常不是无限的。当我们停在第 n 项时，剩下的部分由拉格朗日余项描述。它告诉我们，距离 x₀ 越远，误差增长得越快。',
      isCompleted: false,
      prerequisites: [{ name: '拉格朗日中值定理', topicId: MathTopic.MVT_LAGRANGE }]
    }
  ],
  [MathTopic.LIMIT_DEFINITION]: [
    { id: 'lim-1', title: '误差挑战 ε', goal: '设定偏差', assumption: '|f(x) - L| < ε', expression: '∀ ε > 0', explanation: '无论你要求误差多小...', isCompleted: true },
    { id: 'lim-2', title: '响应精度 δ', goal: '寻找范围', assumption: '0 < |x - x₀| < δ', expression: '∃ δ > 0', explanation: 'δ 是数学上的防火墙...', isCompleted: false }
  ],
  [MathTopic.DERIVATIVE_BASIC]: [
    { id: 'der-1', title: '瞬间斜率', goal: '从平均到瞬间', assumption: 'h → 0', expression: "f'(x) = lim [f(x+h) - f(x)]/h", explanation: '那一瞬的模糊轨迹，就是变化的本质。', isCompleted: true }
  ],
  [MathTopic.MVT_LAGRANGE]: [
    { id: 'mvt-1', title: '平均速度 = 瞬时速度', goal: '寻找那一个平衡点', assumption: 'f(b)-f(a) = f\'(c)(b-a)', expression: 'f\'(c) = [f(b)-f(a)]/(b-a)', explanation: '如果在一段时间内你的平均时速是 60km/h，那么在某一瞬间，你的仪表盘必然正好指向 60。', isCompleted: true }
  ],
  [MathTopic.SQUEEZE_THEOREM]: [],
  [MathTopic.LHOPITAL_RULE]: [],
  [MathTopic.INTEGRAL_BASIC]: [],
  [MathTopic.FTC]: [],
  [MathTopic.MULTIVARIABLE]: [],
  [MathTopic.DIFF_EQUATIONS]: []
};

export const SYSTEM_PROMPT = `你是一个名为「直觉数学建筑师」的 AI 导师。
你的职责是解释微积分。优先解释“为什么公式长这样”，特别是系数和分母的直觉。
如果涉及到当前章节外的知识，引导学生跳转。`;
