
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
    { id: 'ed-0', title: '误差控制', goal: '将“无限接近”数学化', assumption: '任意容差 ε > 0', expression: '|f(x) - L| < ε', explanation: '极限不是动态的过程，而是静态的控制能力。只要你能给定任意小的误差范围，我都能找到对应的控制范围。', isCompleted: true },
    { id: 'ed-1', title: '寻找 δ', goal: '锁定自变量区域', assumption: '存在 δ > 0', expression: '0 < |x - x₀| < δ', explanation: '这是对挑战的回应：你划定目标靶心（ε），我划定射击站位（δ）。', isCompleted: true }
  ],
  [MathTopic.LIMIT_ONESIDED]: [
    { id: 'lo-1', title: '左与右', goal: '处理断崖式跳变', assumption: 'x → a⁻ vs x → a⁺', expression: 'lim(x→a⁻) ≠ lim(x→a⁺)', explanation: '当你分别从左边和右边逼近悬崖时，看到的高度可能完全不同。只有两者相等，双侧极限才存在。', isCompleted: true }
  ],
  [MathTopic.LIMIT_INFINITE]: [
    { id: 'li-1', title: '垂直渐近线', goal: '描述爆炸性增长', assumption: '分母趋于 0', expression: 'f(x) → ±∞', explanation: '当函数值增长速度超过任何界限，图像会贴着一条垂直线无限延伸。', isCompleted: true }
  ],
  [MathTopic.SQUEEZE_THEOREM]: [{ id: 'sq-1', title: '夹逼逻辑', goal: '通过边界锁定核心', assumption: 'g ≤ f ≤ h', expression: 'L ≤ lim f ≤ L', explanation: '两名保镖把目标夹在中间走向同一个门。', isCompleted: true }],
  [MathTopic.IVT_THEOREMS]: [{ id: 'ivt-1', title: '中间值定理', goal: '连续性的本质', assumption: 'f 连续', expression: 'f(a) < N < f(b)', explanation: '穿越马路必须经过马路中间线，不能瞬移。', isCompleted: true }],
  [MathTopic.INFINTESIMAL_COMPARE]: [{ id: 'inf-1', title: '阶数比较', goal: '谁消失得更快？', assumption: 'x → 0', expression: 'o(x) vs O(x)', explanation: '高阶无穷小就像是“超级零”，在普通零面前可以忽略不计。', isCompleted: true }],

  // Unit 2
  [MathTopic.DERIVATIVE_BASIC]: [{ id: 'db-1', title: '切线斜率', goal: '瞬间的变化率', assumption: 'h → 0', expression: '[f(x+h)-f(x)]/h', explanation: '把两个点的连线无限拉近，直到它们看起来像一个点，割线就变成了切线。', isCompleted: true }],
  [MathTopic.DERIVATIVE_RULES]: [{ id: 'dr-1', title: '乘积法则', goal: '矩形面积变化', assumption: 'A = uv', expression: "d(uv) = u'v + uv'", explanation: '面积的增加 = 长边的延伸 + 短边的延伸 + 角落的微小面积（高阶无穷小）。', isCompleted: true }],
  [MathTopic.CHAIN_RULE]: [{ id: 'cr-1', title: '传动比', goal: '复合系统变化率', assumption: 'y=f(g(x))', expression: "dy/dx = f'(g) * g'(x)", explanation: '大齿轮带动中齿轮，中齿轮带动小齿轮。总倍率是各级倍率的乘积。', isCompleted: true }],
  [MathTopic.IMPLICIT_DIFF]: [{ id: 'id-1', title: '隐式求导', goal: '处理非函数曲线', assumption: 'F(x,y)=0', expression: 'd/dx两侧', explanation: '不解出y，直接对关系式求导，把y看作x的函数。', isCompleted: true }],
  [MathTopic.RELATED_RATES]: [{ id: 'rr-1', title: '相关变化率', goal: '动态关联', assumption: 't为参数', expression: 'dx/dt vs dy/dt', explanation: '梯子滑落时，顶端下降速度与底端滑行速度通过勾股定理实时联动。', isCompleted: true }],
  [MathTopic.LINEAR_APPROX]: [
    { id: 'la-1', title: '以直代曲', goal: '复杂函数的局部简化', assumption: 'x ≈ a', expression: "L(x) = f(a) + f'(a)(x-a)", explanation: '在显微镜下，任何光滑曲线看起来都是直的。我们用这直线来近似计算。', isCompleted: true },
    { id: 'la-2', title: '微分 dy', goal: '切线上的增量', assumption: 'dx = Δx', expression: "dy = f'(x)dx", explanation: 'dy 是切线上的上升高度，而 Δy 是曲线上实际的上升高度。当 dx 很小时，它们几乎相等。', isCompleted: true }
  ],

  // Unit 3
  [MathTopic.MVT_ROLLE]: [{ id: 'ro-1', title: '罗尔定理', goal: '水平切线的必然', assumption: '端点等高', expression: "f'(c)=0", explanation: '爬山回到原点，中间必有停顿（速度为0）的时刻。', isCompleted: true }],
  [MathTopic.MVT_LAGRANGE]: [{ id: 'lag-1', title: '拉格朗日中值', goal: '平均速度的瞬间再现', assumption: '旋转坐标系', expression: "f'(c) = Δy/Δx", explanation: '高速路上平均时速100，中间一定有一瞬间表盘指在100。', isCompleted: true, prerequisites: [{name: '罗尔定理', topicId: MathTopic.MVT_ROLLE}] }],
  [MathTopic.MVT_CAUCHY]: [{ id: 'cau-1', title: '柯西中值', goal: '双函数竞速', assumption: '参数化运动', expression: "f'/g'", explanation: '两个赛跑者的相对速度分析。', isCompleted: true, prerequisites: [{name: '拉格朗日中值', topicId: MathTopic.MVT_LAGRANGE}] }],
  [MathTopic.LHOPITAL_RULE]: [{ id: 'lhr-1', title: '洛必达法则', goal: '0/0 极限', assumption: '比值导数', expression: "lim f'/g'", explanation: '谁先跑到终点？看它们最后冲刺的速度。', isCompleted: true, prerequisites: [{name: '柯西中值', topicId: MathTopic.MVT_CAUCHY}] }],
  [MathTopic.CONCAVITY_CURVE]: [
    { id: 'cc-1', title: '二阶导数', goal: '弯曲的方向', assumption: "f'' > 0", expression: '凹 (Concave Up)', explanation: "f' 在增加，说明切线斜率越来越大，曲线像个碗一样向上弯。正二阶导意味着“加速向上”。", isCompleted: true },
    { id: 'cc-2', title: '拐点', goal: '凹凸性的转换', assumption: "f'' = 0", expression: 'Inflection Point', explanation: '方向盘回正的那一瞬间，曲线从左弯变为右弯。', isCompleted: true }
  ],
  [MathTopic.OPTIMIZATION]: [{ id: 'opt-1', title: '最优化', goal: '寻找最佳点', assumption: "f'=0", expression: 'Critical Points', explanation: '山顶或谷底的切线是水平的。', isCompleted: true }],

  // Unit 4
  [MathTopic.INTEGRAL_BASIC]: [{ id: 'ib-1', title: '黎曼和', goal: '无限切片', assumption: 'n → ∞', expression: 'Σ f(xi)Δx', explanation: '将面积切成无数细条累加。', isCompleted: true }],
  [MathTopic.FTC]: [
    { id: 'ftc-1', title: 'FTC 第一部分', goal: '积分是导数的逆', assumption: 'A(x)=∫f', expression: "A'(x)=f(x)", explanation: '面积累积的速度就是当前的高度。', isCompleted: true },
    { id: 'ftc-2', title: 'FTC 第二部分', goal: '计算定积分', assumption: 'F 是原函数', expression: 'F(b)-F(a)', explanation: '总变化量等于终态减初态。', isCompleted: true }
  ],
  [MathTopic.INTEGRATION_SUBSTITUTION]: [
    { id: 'sub-1', title: '换元法', goal: '逆向链式法则', assumption: 'u = g(x)', expression: '∫f(g(x))g\'(x)dx = ∫f(u)du', explanation: '这是积分中最强大的工具。当一部分包含另一部分的导数时，我们可以通过换元（Change of Variable）简化视角，就像把录像带倒回来解开链式法则。', isCompleted: true, prerequisites: [{name: '链式法则', topicId: MathTopic.CHAIN_RULE}] }
  ],
  [MathTopic.INTEGRATION_PARTS]: [{ id: 'ip-1', title: '分部积分', goal: '逆向乘积法则', assumption: '∫udv', expression: 'uv - ∫vdu', explanation: '交换积分的难易程度。', isCompleted: true, prerequisites: [{name: '乘积法则', topicId: MathTopic.DERIVATIVE_RULES}] }],
  [MathTopic.INTEGRATION_TRIG]: [{ id: 'it-1', title: '三角换元', goal: '处理平方根', assumption: 'x=sinθ', expression: '√(1-x²) → cosθ', explanation: '利用三角恒等式消去根号，将代数问题转化为几何角度问题。', isCompleted: true }],
  [MathTopic.IMPROPER_INTEGRAL]: [{ id: 'imp-1', title: '反常积分', goal: '无限区域的面积', assumption: 'b→∞', expression: 'lim ∫', explanation: '加百列号角：虽然无限长，但体积有限。', isCompleted: true }],

  // Unit 5
  [MathTopic.AREA_BETWEEN_CURVES]: [{ id: 'abc-1', title: '曲线间面积', goal: '差值的累积', assumption: 'f > g', expression: '∫(f-g)dx', explanation: '上下相减，得到每一条细丝的高度。', isCompleted: true }],
  [MathTopic.VOLUME_ROTATION]: [
    { id: 'vol-1', title: '圆盘法 (Disk)', goal: '切片为圆', assumption: '绕轴旋转', expression: '∫ π[f(x)]² dx', explanation: '像切黄瓜一样，每一片都是一个圆盘。', isCompleted: true },
    { id: 'vol-2', title: '壳层法 (Shell)', goal: '层层包裹', assumption: '平行于轴', expression: '∫ 2πx f(x) dx', explanation: '像洋葱一样，一层层剥开，每一层是薄圆柱壳。', isCompleted: true }
  ],
  [MathTopic.ARC_LENGTH]: [{ id: 'al-1', title: '弧长公式', goal: '拉直曲线', assumption: 'ds', expression: '∫√(1+[f\']²)dx', explanation: '微观下的勾股定理：ds² = dx² + dy²。', isCompleted: true }],

  // Unit 6
  [MathTopic.DE_SEPARABLE]: [
    { id: 'sep-1', title: '分离变量', goal: '归类治理', assumption: 'dy/dx = g(x)h(y)', expression: '∫dy/h(y) = ∫g(x)dx', explanation: '把 y 赶到左边，x 赶到右边，然后两边同时积分。', isCompleted: true }
  ],
  [MathTopic.DE_LOGISTIC]: [{ id: 'log-1', title: '阻滞增长', goal: '现实模型', assumption: '资源有限', expression: "P' = kP(1 - P/M)", explanation: '起初指数增长，随后受环境承载力 M 限制而减速。', isCompleted: true }],

  // Unit 7
  [MathTopic.SERIES_CONVERGENCE]: [{ id: 'sc-1', title: '部分和序列', goal: '无限加法的定义', assumption: 'Sn', expression: 'lim Sn', explanation: '如果加到最后不再剧烈波动，就叫收敛。', isCompleted: true }],
  [MathTopic.SERIES_TESTS]: [
    { id: 'st-1', title: '比值判别法', goal: '与几何级数对比', assumption: 'lim |a(n+1)/an| = L', expression: 'L < 1 收敛', explanation: '只要后一项总是比前一项明显小（比如总是0.9倍），它最终就会像几何级数一样收敛。', isCompleted: true }
  ],
  [MathTopic.POWER_SERIES]: [{ id: 'ps-1', title: '收敛半径', goal: '有效范围', assumption: '|x-a|<R', expression: 'R', explanation: '这个多项式机器只在 R 范围内不爆炸。', isCompleted: true }],
  [MathTopic.TAYLOR_SERIES]: [{ id: 'ts-1', title: '泰勒展开', goal: '克隆函数', assumption: '导数匹配', expression: 'Σ f(n)/n! x^n', explanation: '利用某一点的所有信息重构整个曲线。', isCompleted: true }],
  [MathTopic.FOURIER_SERIES]: [{ id: 'fs-1', title: '频域分解', goal: '万物皆波', assumption: '周期函数', expression: 'Σ sin/cos', explanation: '把复杂的汤（函数）分解成基本的原料（正弦波）。', isCompleted: true }],

  // Unit 8
  [MathTopic.MULTIVARIABLE_PARTIAL]: [{ id: 'mp-1', title: '偏导数', goal: '降维打击', assumption: 'y 固定', expression: '∂f/∂x', explanation: '切蛋糕。只看沿着 x 方向切开断面的斜率。', isCompleted: true }],
  [MathTopic.GRADIENT_VECTOR]: [{ id: 'grad-1', title: '梯度', goal: '最陡峭的方向', assumption: '∇f', expression: '<Fx, Fy>', explanation: '如果你在山上，梯度告诉你往哪走上坡最快。', isCompleted: true }],
  [MathTopic.LAGRANGE_MULTIPLIER]: [
    { id: 'lagm-1', title: '拉格朗日乘数', goal: '约束优化', assumption: '∇f = λ∇g', expression: '切点', explanation: '当你沿着约束路径（g=c）走，走到最高点（f最大）时，等高线一定与你的路径相切。如果不相切，你就可以往里或往外再走一点从而变得更高。', isCompleted: true }
  ],
  [MathTopic.DOUBLE_INTEGRAL]: [{ id: 'di-1', title: '二重积分', goal: '体积', assumption: 'dA', expression: '∬ f dA', explanation: '在底面上把无数根细薯条的高度加起来。', isCompleted: true }]
};

export const SYSTEM_PROMPT = `你是一个名为「直觉数学建筑师」的 AI 导师。
你的职责是解释微积分。优先解释“为什么公式长这样”，特别是逻辑血缘关系（如：罗尔定理如何通过旋转坐标系变成拉格朗日中值定理）。
遵循 3Blue1Brown 的风格：几何直觉优先，代数推导次之。`;
