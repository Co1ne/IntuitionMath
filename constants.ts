
import { DerivationStep, MathTopic, TopicManifest } from './types';

export interface Unit {
  id: string;
  name: string;
  shortName: string;
  chapters: { id: string; name: string; topics: { id: MathTopic; name: string }[] }[];
}

export const UNITS: Unit[] = [
  {
    id: 'u1', name: 'Unit 1 极限与连续性', shortName: 'LIM',
    chapters: [
      { id: 'ch1_1', name: '极限本质', topics: [{ id: MathTopic.LIMIT_DEFINITION, name: 'ε-δ 语言：逻辑闭环' }] },
      { id: 'ch1_2', name: '围堵逻辑', topics: [{ id: MathTopic.SQUEEZE_THEOREM, name: '夹逼准则：几何围堵' }] },
      { id: 'ch1_3', name: '连续性', topics: [{ id: MathTopic.IVT_THEOREMS, name: '介值定理：必然的跨越' }] }
    ]
  },
  {
    id: 'u2', name: 'Unit 2 导数：微观变化', shortName: 'DIFF',
    chapters: [
      { id: 'ch2_1', name: '导数定义', topics: [{ id: MathTopic.DERIVATIVE_BASIC, name: '瞬时率：割线到切线' }] },
      { id: 'ch2_2', name: '复合逻辑', topics: [{ id: MathTopic.CHAIN_RULE, name: '链式法则：传动放大' }] }
    ]
  },
  {
    id: 'u3', name: 'Unit 3 导数应用', shortName: 'APP',
    chapters: [
      { id: 'ch3_1', name: '核心中值', topics: [{ id: MathTopic.MVT_LAGRANGE, name: '中值定理：瞬时与平均' }] },
      { id: 'ch3_2', name: '极限求解', topics: [{ id: MathTopic.LHOPITAL_RULE, name: '洛必达法则：速率对决' }] }
    ]
  },
  {
    id: 'u4', name: 'Unit 4 积分基础', shortName: 'INT',
    chapters: [
      { id: 'ch4_1', name: '积分本质', topics: [{ id: MathTopic.INTEGRAL_BASIC, name: '黎曼和：矩形堆叠' }] },
      { id: 'ch4_2', name: '根本联系', topics: [{ id: MathTopic.FTC, name: 'FTC：导数与面积的桥梁' }] }
    ]
  },
  {
    id: 'u5', name: 'Unit 5 积分几何', shortName: 'GEO',
    chapters: [
      { id: 'ch5_1', name: '空间度量', topics: [
        { id: MathTopic.AREA_BETWEEN_CURVES, name: '曲线间面积：差值累积' },
        { id: MathTopic.VOLUME_ROTATION, name: '旋转体：磁盘法' }
      ]}
    ]
  },
  {
    id: 'u6', name: 'Unit 6 微分方程', shortName: 'DEQ',
    chapters: [{ id: 'ch6_1', name: '增长模型', topics: [{ id: MathTopic.DE_LOGISTIC, name: '逻辑斯谛增长：环境上限' }] }]
  },
  {
    id: 'u7', name: 'Unit 7 无穷级数', shortName: 'SER',
    chapters: [{ id: 'ch7_1', name: '函数近似', topics: [{ id: MathTopic.TAYLOR_SERIES, name: '泰勒级数：信息展开' }] }]
  },
  {
    id: 'u8', name: 'Unit 8 多元微积分', shortName: 'MVC',
    chapters: [{ id: 'ch8_1', name: '场与梯度', topics: [{ id: MathTopic.GRADIENT_VECTOR, name: '梯度：最速上升' }] }]
  }
];

export const TOPIC_REGISTRY: Record<string, TopicManifest> = {
  [MathTopic.LIMIT_DEFINITION]: {
    id: MathTopic.LIMIT_DEFINITION,
    name: 'ε-δ 语言：逻辑闭环',
    initialVisualState: { functionString: 'x^2', x0: 2, param1: 0.8, param2: 0.5 },
    aiSystemPrompt: "解释 ε-δ 定义时，强调它是在进行一场‘逻辑决斗’：对方给出误差范围 ε，你给出对应的自变量范围 δ。",
    steps: [
      { id: 'ed-1', title: '1. 直觉观察', goal: '寻找趋向点', assumption: 'x → c', expression: 'f(x) → L', explanation: '当 x 靠近 2，函数值靠近 4。我们要如何用数学语言证明这种“无限靠近”？', isCompleted: true },
      { id: 'ed-2', title: '2. 设定容差 ε', goal: '怀疑者的挑战', assumption: '∀ε > 0', expression: '|f(x) - L| < ε', explanation: '给定一个 y 轴上的误差带 ε。你的任务是确保函数值落入此区域。', isCompleted: true, visualHint: { param1: 0.3 } },
      { id: 'ed-3', title: '3. 寻找范围 δ', goal: '逻辑回应', assumption: '∃δ > 0', expression: '0 < |x - c| < δ', explanation: '只要 x 在 c 的 δ 邻域内，f(x) 就必然在 L 的 ε 邻域内。', isCompleted: true, visualHint: { param1: 0.3, param2: 0.1 } },
      { id: 'ed-4', title: '4. 无限逼近', goal: '收缩测试', assumption: 'ε 变小', expression: 'δ(ε) 始终存在', explanation: '无论挑战者给出的 ε 多么小，你总能给出一个有效的 δ，极限便宣告成立。', isCompleted: true, visualHint: { param1: 0.05, param2: 0.02 } },
      { id: 'ed-5', title: '5. 严谨判据', goal: '逻辑终点', assumption: '完备定义', expression: '∀ε>0, ∃δ>0 s.t. 0<|x-c|<δ ⇒ |f(x)-L|<ε', explanation: '这就是微积分的逻辑基石：用静态的范围限制动态的趋向。', isCompleted: true }
    ]
  },
  [MathTopic.SQUEEZE_THEOREM]: {
    id: MathTopic.SQUEEZE_THEOREM,
    name: '夹逼准则：几何围堵',
    initialVisualState: { functionString: 'x^2 * sin(1/x)', x0: 0, param1: 1, param2: 1 },
    aiSystemPrompt: "比喻：两个保镖（包络函数）把一个坏蛋（震荡函数）夹在中间，两个保镖去了同一个地方，坏蛋也必须去那里。",
    steps: [
      { id: 'sq-1', title: '1. 定义上下界', goal: '寻找包络', assumption: 'g(x) ≤ f(x) ≤ h(x)', expression: '-x^2 ≤ f(x) ≤ x^2', explanation: '对于复杂的震荡函数，我们先找到两个容易计算极限的“包络函数”。', isCompleted: true },
      { id: 'sq-2', title: '2. 观察 0 点趋向', goal: '保镖的目标', assumption: 'x → 0', expression: 'lim g(x) = 0, lim h(x) = 0', explanation: '当 x 趋向 0，两个包络函数都在向 0 靠拢。', isCompleted: true, visualHint: { param1: 0.5 } },
      { id: 'sq-3', title: '3. 几何夹逼', goal: '空间压缩', assumption: '区间围堵', expression: '0 ≤ lim f(x) ≤ 0', explanation: '由于被夹在中间，蓝色的震荡线被金色的包络线完全锁死在 0。', isCompleted: true, visualHint: { param1: 0.1 } },
      { id: 'sq-4', title: '4. 结论导出', goal: '确定极限', assumption: '夹逼结论', expression: 'lim[x→0] f(x) = 0', explanation: '既然左右两边都在同一个终点，中间的函数别无选择。', isCompleted: true }
    ]
  },
  [MathTopic.IVT_THEOREMS]: {
    id: MathTopic.IVT_THEOREMS,
    name: '介值定理：必然的跨越',
    initialVisualState: { functionString: '0.1x^3 - x + 1', x0: -3, param1: 3, param2: 1.5 },
    aiSystemPrompt: "强调‘连续性’。如果你想从 1 楼去 3 楼且不通过瞬移，你必须经过 2 楼。",
    steps: [
      { id: 'ivt-1', title: '1. 设定闭区间', goal: '定义边界', assumption: 'f(x) 在 [a, b] 连续', expression: '[a, b] = [-3, 3]', explanation: '在连续函数上选取两个端点。由于函数连续，中间没有断裂。', isCompleted: true },
      { id: 'ivt-2', title: '2. 任选介值 K', goal: '设定目标高度', assumption: 'f(a) < K < f(b)', expression: 'K = 1.5', explanation: '在端点高度之间任选一个高度 K。', isCompleted: true, visualHint: { param2: 1.5 } },
      { id: 'ivt-3', title: '3. 扫描交点', goal: '寻找 c', assumption: 'f(c) = K', expression: '∃c ∈ (a, b)', explanation: '曲线必须“穿过”扫描线 K 才能到达终点，这意味着交点 c 必然存在。', isCompleted: true },
      { id: 'ivt-4', title: '4. 定理总结', goal: '逻辑终点', assumption: '介值结论', expression: 'f(c) = K', explanation: '只要函数连续，任何介于端点间的值都必然在区间内被取到。', isCompleted: true }
    ]
  },
  [MathTopic.DERIVATIVE_BASIC]: {
    id: MathTopic.DERIVATIVE_BASIC,
    name: '瞬时率：割线到切线',
    initialVisualState: { functionString: '0.5x^2', x0: 1, param1: 2, param2: 0 },
    aiSystemPrompt: "引导用户理解导数是斜率的极限。随着点 Q 靠近 P，平均速度变成了瞬时速度。",
    steps: [
      { id: 'db-1', title: '1. 定义两点', goal: '确定割线', assumption: 'P(x, f(x)), Q(x+h, f(x+h))', expression: 'h = 2', explanation: '在曲线上选两个点，它们的连线坡度代表了平均变化率。', isCompleted: true, visualHint: { param1: 2 } },
      { id: 'db-2', title: '2. 平均斜率', goal: '计算速率', assumption: 'Δy / Δx', expression: '[f(x+h) - f(x)] / h', explanation: '这是这一段有限区间的平均“坡度”。', isCompleted: true },
      { id: 'db-3', title: '3. 压缩间距 h', goal: 'h 趋向 0', assumption: 'h → 0', expression: 'h = 0.5', explanation: '让 Q 点不断靠近 P 点。观察割线如何慢慢“对准”曲线。', isCompleted: true, visualHint: { param1: 0.5 } },
      { id: 'db-4', title: '4. 极限时刻', goal: '切线的诞生', assumption: 'lim[h→0]', expression: 'f\'(x) = Slope', explanation: '当 h 趋于 0，割线最终稳定成为切线。这便是瞬时变化率。', isCompleted: true, visualHint: { param1: 0.01 } }
    ]
  },
  [MathTopic.CHAIN_RULE]: {
    id: MathTopic.CHAIN_RULE,
    name: '链式法则：传动放大',
    initialVisualState: { functionString: 'sin(x^2)', x0: 1, param1: 1, param2: 1 },
    aiSystemPrompt: "将复合函数想象成齿轮组。第一级齿轮（内层）的变动率乘以第二级齿轮（外层）的变动率。",
    steps: [
      { id: 'cr-1', title: '1. 拆解工序', goal: '拆解 u = g(x)', assumption: 'y = f(u), u = g(x)', expression: 'u = x^2, y = sin(u)', explanation: '复合函数就像生产线的两道工序：x 影响 u，u 再影响最终的 y。', isCompleted: true },
      { id: 'cr-2', title: '2. 内层敏感度', goal: '计算 du/dx', assumption: 'Inner Derivative', expression: 'du/dx = 2x', explanation: '当 x 移动一点，u 变动的倍率是 2x。', isCompleted: true },
      { id: 'cr-3', title: '3. 外层敏感度', goal: '计算 dy/du', assumption: 'Outer Derivative', expression: 'dy/du = cos(u)', explanation: '接着，u 的变动又被外层函数按照 cos(u) 的倍率放大。', isCompleted: true },
      { id: 'cr-4', title: '4. 总变化率', goal: '相乘累积', assumption: 'dy/dx = (dy/du) * (du/dx)', expression: 'dy/dx = cos(x^2) * 2x', explanation: '整体的变动速率是各级“传动比”的乘积。', isCompleted: true }
    ]
  },
  [MathTopic.MVT_LAGRANGE]: {
    id: MathTopic.MVT_LAGRANGE,
    name: '中值定理：瞬时与平均',
    initialVisualState: { functionString: '0.2x^2 + 0.5x', x0: -1, param1: 3, param2: 1 },
    aiSystemPrompt: "比喻：如果你平均时速 100km/h，在某个瞬时你的仪表盘一定恰好指向过 100km/h。",
    steps: [
      { id: 'mvt-1', title: '1. 建立平均线', goal: '割线斜率', assumption: 'Slope(AB)', expression: '[f(b)-f(a)]/(b-a)', explanation: '连接区间端点，得到这段路程的平均变化率。', isCompleted: true, visualHint: { param2: 1 } },
      { id: 'mvt-2', title: '2. 寻找平行切线', goal: '平移割线', assumption: 'f\'(c) = Slope', expression: '∃c ∈ (a, b)', explanation: '在曲线内部，总能找到一个点 c，其瞬时切线方向与平均斜率完美平行。', isCompleted: true, visualHint: { param2: 2 } },
      { id: 'mvt-3', title: '3. 定理导出', goal: '存在性结论', assumption: 'MVT Statement', expression: "f'(c) = [f(b)-f(a)]/(b-a)", explanation: '这证明了平滑运动中，瞬时值必然在某个时刻等于平均值。', isCompleted: true }
    ]
  },
  [MathTopic.LHOPITAL_RULE]: {
    id: MathTopic.LHOPITAL_RULE,
    name: '洛必达法则：速率对决',
    initialVisualState: { functionString: 'sin(x)/x', x0: 0, param1: 1, param2: 0 },
    aiSystemPrompt: "当分子分母都去 0 时，我们比较的是谁去 0 的‘速度’（导数）更快。",
    steps: [
      { id: 'lh-1', title: '1. 识别 0/0 型', goal: '检查前提', assumption: 'lim f(x)=0, lim g(x)=0', expression: 'lim f(x)/g(x) = 0/0', explanation: '当分子分母同时消失，极限变得模糊。我们需要寻找新的线索。', isCompleted: true },
      { id: 'lh-2', title: '2. 关注切线斜率', goal: '局部线性化', assumption: 'f(x) ≈ f\'(c)x', expression: 'Slope(f) / Slope(g)', explanation: '在 0 点附近，函数的值可以用它的切线（增长率）来代表。', isCompleted: true },
      { id: 'lh-3', title: '3. 结果计算', goal: '得出极限', assumption: 'Derivative Ratio', expression: 'lim f\'(x)/g\'(x)', explanation: '比较它们的增长速率比值，得出了原本不确定的极限。', isCompleted: true }
    ]
  },
  [MathTopic.INTEGRAL_BASIC]: {
    id: MathTopic.INTEGRAL_BASIC,
    name: '黎曼和：矩形堆叠',
    initialVisualState: { functionString: '0.1x^2 + 1', x0: 0, param1: 4, param2: 4 },
    aiSystemPrompt: "讲解积分是无限求和。展示当矩形变得无限细时，误差如何彻底消失。",
    steps: [
      { id: 'rb-1', title: '1. 确定区域', goal: '设定区间', assumption: 'Area [a, b]', expression: '∫ f(x) dx', explanation: '我们的目标是计算曲线下的总面积。', isCompleted: true },
      { id: 'rb-2', title: '2. 离散切分', goal: '矩形近似', assumption: 'n = 4', expression: 'Σ f(x_i) Δx', explanation: '先用 4 个矩形填充。可以看到明显的“锯齿”误差。', isCompleted: true, visualHint: { param2: 4 } },
      { id: 'rb-3', title: '3. 增加细粒度', goal: '细化矩形', assumption: 'n = 20', expression: 'Δx → 0', explanation: '增加矩形数量。矩形顶部的缝隙正在快速变小，贴近曲线。', isCompleted: true, visualHint: { param2: 20 } },
      { id: 'rb-4', title: '4. 极限求和', goal: 'n → ∞', assumption: 'Limit Sum', expression: 'lim Σ f(x_i)Δx', explanation: '当矩形变得无限细，它们的面积之和就精确等于定积分。', isCompleted: true, visualHint: { param2: 80 } }
    ]
  },
  [MathTopic.FTC]: {
    id: MathTopic.FTC,
    name: 'FTC：导数与面积的桥梁',
    initialVisualState: { functionString: 'x', x0: 0, param1: 3, param2: 0 },
    aiSystemPrompt: "FTC 是微积分最伟大的发现：面积的增长率就是函数本身的值。",
    steps: [
      { id: 'ftc-1', title: '1. 定义面积函数', goal: 'A(x)', assumption: 'A(x) = ∫[a,x] f(t)dt', expression: 'Area Function', explanation: '设 A(x) 为从起点到 x 的曲线下面积。', isCompleted: true },
      { id: 'ftc-2', title: '2. 观察面积微增', goal: 'ΔA', assumption: 'ΔA ≈ f(x)Δx', expression: 'f(x) * dx', explanation: '当 x 增加一点点，增加的面积几乎就是一个高为 f(x) 的窄矩形。', isCompleted: true, visualHint: { param2: 0.1 } },
      { id: 'ftc-3', title: '3. 根本联系', goal: 'A\'(x) = f(x)', assumption: 'Fundamental Theorem', expression: 'd/dx ∫ f(t)dt = f(x)', explanation: '惊人的结论：面积的增长速度正是函数的高度本身！', isCompleted: true }
    ]
  },
  [MathTopic.AREA_BETWEEN_CURVES]: {
    id: MathTopic.AREA_BETWEEN_CURVES,
    name: '曲线间面积：差值累积',
    initialVisualState: { functionString: 'x^2', x0: 0, param1: 2, param2: 1.5 },
    aiSystemPrompt: "想象我们在计算两个海拔高度之间的净土方量。本质是高度差的积分。",
    steps: [
      { id: 'abc-1', title: '1. 确定上下界', goal: '识别 f(x) 与 g(x)', assumption: 'f(x) ≥ g(x)', expression: 'Height = f - g', explanation: '选取两个函数。我们要计算它们在给定区间内围成的“夹层”面积。', isCompleted: true },
      { id: 'abc-2', title: '2. 构建差值矩形', goal: 'ΔArea', assumption: '[f(x)-g(x)]Δx', expression: 'Net Height', explanation: '每一个微小矩形的高度现在是两个函数值的差。', isCompleted: true },
      { id: 'abc-3', title: '3. 积分求和', goal: 'Total Area', assumption: '∫[a,b] (f-g)dx', expression: 'Total Shaded Area', explanation: '将所有差值矩形累加起来，得到最终的几何面积。', isCompleted: true }
    ]
  },
  [MathTopic.VOLUME_ROTATION]: {
    id: MathTopic.VOLUME_ROTATION,
    name: '旋转体：磁盘法',
    initialVisualState: { functionString: 'sqrt(x)', x0: 0, param1: 4, param2: 4 },
    aiSystemPrompt: "想象将一个图形在空间中旋转一周。每一个 x 处都产生一个圆形的‘磁盘’。",
    steps: [
      { id: 'vr-1', title: '1. 定义旋转轴', goal: '围绕 x 轴', assumption: 'Radius = f(x)', expression: 'Circle Cross Section', explanation: '曲线上的点到旋转轴的距离就是切面圆形的半径。', isCompleted: true },
      { id: 'vr-2', title: '2. 计算磁盘体积', goal: 'dV', assumption: 'π * R^2 * dx', expression: 'π * [f(x)]^2 * dx', explanation: '每一个微小切片都是一个极薄的圆柱体（磁盘）。', isCompleted: true },
      { id: 'vr-3', title: '3. 累积总体积', goal: 'Total Volume', assumption: '∫ π [f(x)]^2 dx', expression: 'Rotational Solid', explanation: '将所有磁盘的体积累加，得到旋转体的总容积。', isCompleted: true }
    ]
  },
  [MathTopic.DE_LOGISTIC]: {
    id: MathTopic.DE_LOGISTIC,
    name: '逻辑斯谛增长：环境上限',
    initialVisualState: { functionString: '1/(1+exp(-x))', x0: 0, param1: 0.8, param2: 2.5 },
    aiSystemPrompt: "讲解 S 曲线。前期资源无限时指数增长，后期接近承载力时增长停止。",
    steps: [
      { id: 'log-1', title: '1. 指数起步', goal: '资源丰富期', assumption: 'dP/dt ∝ P', expression: 'P(t) ≈ e^rt', explanation: '在早期，个体数量较少，资源充足，种群呈指数级爆发增长。', isCompleted: true },
      { id: 'log-2', title: '2. 引入阻力项', goal: '环境上限 K', assumption: 'Growth × (1 - P/K)', expression: 'dP/dt = rP(1-P/K)', explanation: '随着数量接近承载力 K，增长受到资源限制而开始减速。', isCompleted: true, visualHint: { param2: 2.5 } },
      { id: 'log-3', title: '3. 动态平衡', goal: 'S 曲线稳态', assumption: 'lim[t→∞] P = K', expression: 'Stable Population', explanation: '最终，种群规模将平稳地停留在环境所能支撑的最大限度。', isCompleted: true }
    ]
  },
  [MathTopic.TAYLOR_SERIES]: {
    id: MathTopic.TAYLOR_SERIES,
    name: '泰勒级数：信息展开',
    initialVisualState: { functionString: 'exp(x)', x0: 0, order: 0 },
    aiSystemPrompt: "用‘克隆’的概念讲解。阶数越高，多项式锁定的函数局部特征（斜率、曲率等）越多。",
    steps: [
      { id: 'ts-1', title: '1. 0 阶拟合', goal: '位置同步', assumption: 'P(a) = f(a)', expression: 'P₀ = f(a)', explanation: '最基础的近似：多项式穿过函数所在的那个点。', isCompleted: true, visualHint: { order: 0 } },
      { id: 'ts-2', title: '2. 1 阶拟合', goal: '趋势同步', assumption: 'P\'(a) = f\'(a)', expression: 'P₁ = f(a) + f\'(a)(x-a)', explanation: '不仅穿过点，连瞬时坡度也完全匹配（切线）。', isCompleted: true, visualHint: { order: 1 } },
      { id: 'ts-3', title: '3. 高阶克隆', goal: '曲率与加速度', assumption: 'n = 5', expression: 'P_n(x) ≈ f(x)', explanation: '随着阶数增加，多项式在基准点附近完美“贴合”了原函数的所有细节。', isCompleted: true, visualHint: { order: 5 } },
      { id: 'ts-4', title: '4. 无限级数', goal: '泰勒公式', assumption: 'n → ∞', expression: 'Σ f⁽ⁿ⁾(a)/n! (x-a)ⁿ', explanation: '这就是将复杂函数转化为无限多项式的魔法公式。', isCompleted: true, visualHint: { order: 10 } }
    ]
  },
  [MathTopic.GRADIENT_VECTOR]: {
    id: MathTopic.GRADIENT_VECTOR,
    name: '梯度：最速上升',
    initialVisualState: { functionString: '0.1*(x^2 + y^2)', x0: 0, param1: 0, param2: 1 },
    aiSystemPrompt: "想象你在山上。梯度向量告诉你在地面上往哪个方向走，高度上升最快。",
    steps: [
      { id: 'gv-1', title: '1. 定义地形', goal: '标量场', assumption: 'z = f(x, y)', expression: 'Height Map', explanation: '在三维空间中，每个 (x,y) 坐标都有一个对应的高度。', isCompleted: true },
      { id: 'gv-2', title: '2. 偏导合成', goal: '计算 ∇f', assumption: '[∂f/∂x, ∂f/∂y]', expression: 'Gradient Vector', explanation: '将 X 和 Y 方向的坡度合成一个向量，它指向海拔上升最快的方向。', isCompleted: true, visualHint: { param2: 1 } },
      { id: 'gv-3', title: '3. 几何特性', goal: '垂直等高线', assumption: '∇f ⊥ Level Curve', expression: 'Direction of Steepest Ascent', explanation: '观察梯度：它总是垂直于等高线，坚定地指向“山顶”。', isCompleted: true }
    ]
  }
};

export const TOPIC_CONTENT: Record<string, DerivationStep[]> = Object.fromEntries(
  Object.entries(TOPIC_REGISTRY).map(([key, value]) => [key, value.steps])
);
