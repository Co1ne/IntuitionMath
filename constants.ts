
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
    name: 'Unit 1 极限与连续',
    shortName: 'LIM',
    chapters: [
      {
        id: 'ch1_1',
        name: '极限基础',
        topics: [
          { id: MathTopic.LIMIT_DEFINITION, name: 'ε-δ 语言' },
          { id: MathTopic.LIMIT_ONESIDED, name: '单侧极限' },
          { id: MathTopic.LIMIT_INFINITE, name: '无穷与渐近线' },
        ]
      },
      {
        id: 'ch1_2',
        name: '计算与性质',
        topics: [
          { id: MathTopic.SQUEEZE_THEOREM, name: '夹逼准则' },
          { id: MathTopic.IVT_THEOREMS, name: '介值定理 (IVT)' },
          { id: MathTopic.INFINTESIMAL_COMPARE, name: '无穷小阶数' },
        ]
      }
    ]
  },
  {
    id: 'u2',
    name: 'Unit 2 导数：微观世界',
    shortName: 'DIFF',
    chapters: [
      {
        id: 'ch2_1',
        name: '导数定义与法则',
        topics: [
          { id: MathTopic.DERIVATIVE_BASIC, name: '切线与变化率' },
          { id: MathTopic.DERIVATIVE_RULES, name: '乘积与商法则' },
          { id: MathTopic.CHAIN_RULE, name: '链式法则' },
        ]
      },
      {
        id: 'ch2_2',
        name: '进阶微分',
        topics: [
          { id: MathTopic.IMPLICIT_DIFF, name: '隐函数求导' },
          { id: MathTopic.RELATED_RATES, name: '相关变化率' },
          { id: MathTopic.LINEAR_APPROX, name: '线性近似与微分' },
        ]
      }
    ]
  },
  {
    id: 'u3',
    name: 'Unit 3 导数的应用',
    shortName: 'APP',
    chapters: [
      {
        id: 'ch3_1',
        name: '中值定理家族',
        topics: [
          { id: MathTopic.MVT_ROLLE, name: '罗尔定理' },
          { id: MathTopic.MVT_LAGRANGE, name: '拉格朗日中值定理' },
          { id: MathTopic.MVT_CAUCHY, name: '柯西中值定理' },
          { id: MathTopic.LHOPITAL_RULE, name: '洛必达法则' },
        ]
      },
      {
        id: 'ch3_2',
        name: '函数形态分析',
        topics: [
          { id: MathTopic.CONCAVITY_CURVE, name: '凹凸性与拐点' },
          { id: MathTopic.OPTIMIZATION, name: '最优化问题' },
        ]
      }
    ]
  },
  {
    id: 'u4',
    name: 'Unit 4 积分：累积的力量',
    shortName: 'INT',
    chapters: [
      {
        id: 'ch4_1',
        name: '积分定义',
        topics: [
          { id: MathTopic.INTEGRAL_BASIC, name: '黎曼和' },
          { id: MathTopic.FTC, name: '微积分基本定理' },
        ]
      },
      {
        id: 'ch4_2',
        name: '积分技法',
        topics: [
          { id: MathTopic.INTEGRATION_SUBSTITUTION, name: '换元法 (U-Sub)' },
          { id: MathTopic.INTEGRATION_PARTS, name: '分部积分' },
          { id: MathTopic.INTEGRATION_TRIG, name: '三角换元与分式' },
          { id: MathTopic.IMPROPER_INTEGRAL, name: '反常积分' },
        ]
      }
    ]
  },
  {
    id: 'u5',
    name: 'Unit 5 积分的几何应用',
    shortName: 'GEO',
    chapters: [
      {
        id: 'ch5_1',
        name: '空间度量',
        topics: [
          { id: MathTopic.AREA_BETWEEN_CURVES, name: '曲线间面积' },
          { id: MathTopic.VOLUME_ROTATION, name: '旋转体体积' },
          { id: MathTopic.ARC_LENGTH, name: '弧长' },
        ]
      }
    ]
  },
  {
    id: 'u6',
    name: 'Unit 6 微分方程入门',
    shortName: 'DE',
    chapters: [
      {
        id: 'ch6_1',
        name: '一阶方程',
        topics: [
          { id: MathTopic.DE_SEPARABLE, name: '分离变量法' },
          { id: MathTopic.DE_LOGISTIC, name: '阻滞增长模型' },
        ]
      }
    ]
  },
  {
    id: 'u7',
    name: 'Unit 7 级数：无限之美',
    shortName: 'SER',
    chapters: [
      {
        id: 'ch7_1',
        name: '收敛性测试',
        topics: [
          { id: MathTopic.SERIES_CONVERGENCE, name: '级数定义' },
          { id: MathTopic.SERIES_TESTS, name: '比值与根值判别' },
        ]
      },
      {
        id: 'ch7_2',
        name: '幂级数与展开',
        topics: [
          { id: MathTopic.POWER_SERIES, name: '幂级数' },
          { id: MathTopic.TAYLOR_SERIES, name: '泰勒/麦克劳林级数' },
          { id: MathTopic.FOURIER_SERIES, name: '傅里叶级数' },
        ]
      }
    ]
  },
  {
    id: 'u8',
    name: 'Unit 8 多元微积分预览',
    shortName: 'MULTI',
    chapters: [
      {
        id: 'ch8_1',
        name: '多维变化',
        topics: [
          { id: MathTopic.MULTIVARIABLE_PARTIAL, name: '偏导数' },
          { id: MathTopic.GRADIENT_VECTOR, name: '梯度场' },
          { id: MathTopic.LAGRANGE_MULTIPLIER, name: '拉格朗日乘数' },
          { id: MathTopic.DOUBLE_INTEGRAL, name: '二重积分' },
        ]
      }
    ]
  }
];

export const TOPIC_CONTENT: Record<MathTopic, DerivationStep[]> = {
  // Unit 1
  [MathTopic.LIMIT_DEFINITION]: [
    { id: 'ed-0', title: 'Step 1: 怀疑者的挑战 (ε)', goal: '设定高度容差', assumption: 'ε > 0', expression: '|f(x) - L| < ε', explanation: '怀疑者不相信极限是 L，于是画出两条高度为 ε 的黄线。', isCompleted: true },
    { id: 'ed-1', title: 'Step 2: 你的回应 (δ)', goal: '寻找 x 轴安全区', assumption: 'δ > 0', expression: '0 < |x - x₀| < δ', explanation: '你需要在 x 轴找一个范围，只要 x 在这，y 就不出黄线。', isCompleted: true },
    { id: 'ed-2', title: 'Step 3: 无限博弈', goal: '验证任意性', assumption: '∀ ε', expression: 'L = lim f(x)', explanation: '无论 ε 多小，你总能找到 δ。这就是极限。', isCompleted: true }
  ],
  [MathTopic.LIMIT_ONESIDED]: [{ id: 'lo-1', title: '左与右', goal: '处理跳跃点', assumption: 'x → a⁻ vs x → a⁺', expression: 'lim⁻ ≠ lim⁺', explanation: '左右高度必须一致，极限才存在。', isCompleted: true }],
  [MathTopic.LIMIT_INFINITE]: [{ id: 'li-1', title: '垂直渐近线', goal: '描述爆炸增长', assumption: '1/x, x→0', expression: 'f(x) → ∞', explanation: '分母变小，整体变大。', isCompleted: true }],
  [MathTopic.SQUEEZE_THEOREM]: [{ id: 'sq-1', title: '夹逼准则', goal: '通过边界锁定核心', assumption: 'g ≤ f ≤ h', expression: 'L ≤ lim f ≤ L', explanation: '两个保镖夹着你走向同一扇门。', isCompleted: true }],
  [MathTopic.IVT_THEOREMS]: [{ id: 'ivt-1', title: '介值定理', goal: '连续性的保证', assumption: 'f 连续', expression: 'f(a) < N < f(b)', explanation: '过马路必须经过路中间。', isCompleted: true }],
  [MathTopic.INFINTESIMAL_COMPARE]: [{ id: 'inf-1', title: '无穷小比较', goal: '消失的速度', assumption: 'x → 0', expression: 'o(x)', explanation: '有的零比别的零“消失得更快”。', isCompleted: true }],

  // Unit 2 - 导数基础完善
  [MathTopic.DERIVATIVE_BASIC]: [
    { 
      id: 'db-0', 
      title: 'Step 1: 割线斜率 (平均速度)', 
      goal: '计算两点间的连线', 
      assumption: 'Δx = h', 
      expression: 'm = [f(x+h) - f(x)] / h', 
      explanation: '想象你在开车，这是你过去 1 小时的平均速度。', 
      isCompleted: true 
    },
    { 
      id: 'db-1', 
      title: 'Step 2: 缩短间隔 (h → 0)', 
      goal: '让第二个点靠近第一个点', 
      assumption: 'h 越来越小', 
      expression: 'lim_{h→0}', 
      explanation: '如果把观测时间从 1 小时缩短到 0.0001 秒，平均速度就变成了“瞬时速度”。', 
      isCompleted: true 
    },
    { 
      id: 'db-2', 
      title: 'Step 3: 诞生切线', 
      goal: '得到该点的确切斜率', 
      assumption: '割线消失', 
      expression: "f'(x)", 
      explanation: '这就是导数：它描述了曲线在“这一瞬间”向哪个方向倾斜。', 
      isCompleted: true 
    }
  ],
  [MathTopic.DERIVATIVE_RULES]: [], [MathTopic.CHAIN_RULE]: [], [MathTopic.IMPLICIT_DIFF]: [], [MathTopic.RELATED_RATES]: [], [MathTopic.LINEAR_APPROX]: [],

  // Unit 3
  [MathTopic.MVT_ROLLE]: [], [MathTopic.MVT_LAGRANGE]: [], [MathTopic.MVT_CAUCHY]: [], [MathTopic.LHOPITAL_RULE]: [], [MathTopic.CONCAVITY_CURVE]: [], [MathTopic.OPTIMIZATION]: [],

  // Unit 4
  [MathTopic.INTEGRAL_BASIC]: [], [MathTopic.FTC]: [], [MathTopic.INTEGRATION_SUBSTITUTION]: [], [MathTopic.INTEGRATION_PARTS]: [], [MathTopic.INTEGRATION_TRIG]: [], [MathTopic.IMPROPER_INTEGRAL]: [],

  // Unit 5
  [MathTopic.AREA_BETWEEN_CURVES]: [], [MathTopic.VOLUME_ROTATION]: [], [MathTopic.ARC_LENGTH]: [],

  // Unit 6
  [MathTopic.DE_SEPARABLE]: [], [MathTopic.DE_LOGISTIC]: [],

  // Unit 7 - 泰勒展开完善
  [MathTopic.TAYLOR_SERIES]: [
    { 
      id: 'ts-0', 
      title: 'Step 1: 零阶匹配 (高度一致)', 
      goal: '让多项式经过那个点', 
      assumption: 'P(a) = f(a)', 
      expression: 'P₀(x) = f(a)', 
      explanation: '如果你想“克隆”一个函数，最起码在起始点 a，你们的高度得是一样的。', 
      isCompleted: true 
    },
    { 
      id: 'ts-1', 
      title: 'Step 2: 一阶匹配 (斜率一致)', 
      goal: '让多项式的方向也一致', 
      assumption: "P'(a) = f'(a)", 
      expression: "P₁(x) = f(a) + f'(a)(x-a)", 
      explanation: '这不就是切线吗？现在你的克隆函数不仅高度对，出门的方向也跟原版一模一样。', 
      isCompleted: true 
    },
    { 
      id: 'ts-2', 
      title: 'Step 3: 二阶匹配 (弯曲度一致)', 
      goal: '让弯曲的趋势也一致', 
      assumption: "P''(a) = f''(a)", 
      expression: "P₂(x) = P₁(x) + [f''(a)/2!](x-a)²", 
      explanation: '为什么要除以 2？因为对 x² 求两次导会多出个 2。除掉它，才能让“二阶变化率”完美对接。', 
      isCompleted: true 
    },
    { 
      id: 'ts-3', 
      title: 'Step 4: 无限匹配 (阶乘之谜)', 
      goal: '匹配任意阶导数', 
      assumption: 'P⁽ⁿ⁾(a) = f⁽ⁿ⁾(a)', 
      expression: 'Σ [f⁽ⁿ⁾(a)/n!] (x-a)ⁿ', 
      explanation: '阶乘 n! 是为了抵消求导产生的“系数累积”。只要阶数够高，多项式就能在更大范围内“吞掉”原函数。', 
      isCompleted: true 
    }
  ],
  [MathTopic.SERIES_CONVERGENCE]: [], [MathTopic.SERIES_TESTS]: [], [MathTopic.POWER_SERIES]: [], [MathTopic.FOURIER_SERIES]: [],

  // Unit 8
  [MathTopic.MULTIVARIABLE_PARTIAL]: [], [MathTopic.GRADIENT_VECTOR]: [], [MathTopic.LAGRANGE_MULTIPLIER]: [], [MathTopic.DOUBLE_INTEGRAL]: []
};

export const SYSTEM_PROMPT = `你是一个名为「直觉数学建筑师」的 AI 导师。
你的职责是解释微积分。优先解释“为什么公式长这样”，特别是逻辑血缘关系。
遵循 3Blue1Brown 的风格：几何直觉优先，代数推导次之。`;
