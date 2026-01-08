
export interface DerivationStep {
  id: string;
  title: string;
  goal: string;
  assumption: string;
  expression: string;
  explanation: string;
  isCompleted: boolean;
  prerequisites?: { name: string; topicId?: MathTopic }[];
}

export enum MathTopic {
  // Unit 1: 极限与连续
  LIMIT_DEFINITION = 'LIMIT_DEFINITION',
  LIMIT_ONESIDED = 'LIMIT_ONESIDED', // 新增：左/右极限
  LIMIT_INFINITE = 'LIMIT_INFINITE', // 新增：无穷极限与渐近线
  SQUEEZE_THEOREM = 'SQUEEZE_THEOREM',
  INFINTESIMAL_COMPARE = 'INFINTESIMAL_COMPARE',
  IVT_THEOREMS = 'IVT_THEOREMS',
  
  // Unit 2: 导数与微分
  DERIVATIVE_BASIC = 'DERIVATIVE_BASIC',
  DERIVATIVE_RULES = 'DERIVATIVE_RULES', // 新增：乘积/商法则直觉
  CHAIN_RULE = 'CHAIN_RULE',
  IMPLICIT_DIFF = 'IMPLICIT_DIFF',
  RELATED_RATES = 'RELATED_RATES',
  LINEAR_APPROX = 'LINEAR_APPROX', // 新增：线性近似与微分
  
  // Unit 3: 导数应用 (MVT & Graphing)
  MVT_ROLLE = 'MVT_ROLLE',
  MVT_LAGRANGE = 'MVT_LAGRANGE',
  MVT_CAUCHY = 'MVT_CAUCHY',
  LHOPITAL_RULE = 'LHOPITAL_RULE',
  CONCAVITY_CURVE = 'CONCAVITY_CURVE', // 新增：凹凸性与拐点
  OPTIMIZATION = 'OPTIMIZATION',
  
  // Unit 4: 积分与技法
  INTEGRAL_BASIC = 'INTEGRAL_BASIC',
  FTC = 'FTC',
  INTEGRATION_SUBSTITUTION = 'INTEGRATION_SUBSTITUTION', // 新增：换元法 (U-Sub)
  INTEGRATION_PARTS = 'INTEGRATION_PARTS',
  INTEGRATION_TRIG = 'INTEGRATION_TRIG', // 新增：三角换元
  IMPROPER_INTEGRAL = 'IMPROPER_INTEGRAL',
  
  // Unit 5: 积分几何应用
  AREA_BETWEEN_CURVES = 'AREA_BETWEEN_CURVES', // 新增
  VOLUME_ROTATION = 'VOLUME_ROTATION', // 新增：旋转体体积
  ARC_LENGTH = 'ARC_LENGTH', // 新增：弧长
  
  // Unit 6: 微分方程 (新增单元)
  DE_SEPARABLE = 'DE_SEPARABLE', // 分离变量
  DE_LOGISTIC = 'DE_LOGISTIC', // 阻滞增长模型
  
  // Unit 7: 级数
  SERIES_CONVERGENCE = 'SERIES_CONVERGENCE',
  SERIES_TESTS = 'SERIES_TESTS', // 新增：比值/根值判别
  POWER_SERIES = 'POWER_SERIES',
  TAYLOR_SERIES = 'TAYLOR_SERIES',
  FOURIER_SERIES = 'FOURIER_SERIES',
  
  // Unit 8: 多元微积分
  MULTIVARIABLE_PARTIAL = 'MULTIVARIABLE_PARTIAL',
  GRADIENT_VECTOR = 'GRADIENT_VECTOR',
  LAGRANGE_MULTIPLIER = 'LAGRANGE_MULTIPLIER', // 新增：拉格朗日乘数
  DOUBLE_INTEGRAL = 'DOUBLE_INTEGRAL'
}

export interface Chapter {
  id: string;
  name: string;
  topics: { id: MathTopic; name: string }[];
}

export interface VisualState {
  topic: MathTopic;
  functionString: string;
  x0: number;
  order: number;
  param1: number; 
  param2: number;
  zoom: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}
