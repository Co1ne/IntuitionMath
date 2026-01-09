
export interface DerivationStep {
  id: string;
  title: string;
  goal: string;
  assumption: string;
  expression: string;
  explanation: string;
  isCompleted: boolean;
  prerequisites?: { name: string; topicId?: MathTopic }[];
  visualHint?: Partial<VisualState>;
  // 引导用户进行具体操作的提示
  actionHint?: string;
}

export enum MathTopic {
  LIMIT_DEFINITION = 'LIMIT_DEFINITION',
  LIMIT_ONESIDED = 'LIMIT_ONESIDED',
  LIMIT_INFINITE = 'LIMIT_INFINITE',
  SQUEEZE_THEOREM = 'SQUEEZE_THEOREM',
  INFINTESIMAL_COMPARE = 'INFINTESIMAL_COMPARE',
  IVT_THEOREMS = 'IVT_THEOREMS',
  DERIVATIVE_BASIC = 'DERIVATIVE_BASIC',
  DERIVATIVE_RULES = 'DERIVATIVE_RULES',
  CHAIN_RULE = 'CHAIN_RULE',
  IMPLICIT_DIFF = 'IMPLICIT_DIFF',
  RELATED_RATES = 'RELATED_RATES',
  LINEAR_APPROX = 'LINEAR_APPROX',
  MVT_LAGRANGE = 'MVT_LAGRANGE',
  LHOPITAL_RULE = 'LHOPITAL_RULE',
  OPTIMIZATION = 'OPTIMIZATION',
  INTEGRAL_BASIC = 'INTEGRAL_BASIC',
  FTC = 'FTC',
  INTEGRATION_SUBSTITUTION = 'INTEGRATION_SUBSTITUTION',
  AREA_BETWEEN_CURVES = 'AREA_BETWEEN_CURVES',
  VOLUME_ROTATION = 'VOLUME_ROTATION',
  DE_SEPARABLE = 'DE_SEPARABLE',
  DE_LOGISTIC = 'DE_LOGISTIC',
  SERIES_CONVERGENCE = 'SERIES_CONVERGENCE',
  TAYLOR_SERIES = 'TAYLOR_SERIES',
  GRADIENT_VECTOR = 'GRADIENT_VECTOR'
}

export interface TopicManifest {
  id: MathTopic;
  name: string;
  initialVisualState: Partial<VisualState>;
  steps: DerivationStep[];
  aiSystemPrompt: string; // 针对该主题的 AI 教学策略
}

export interface VisualState {
  topic: MathTopic;
  functionString: string;
  x0: number;
  order: number;
  param1: number; // 通常用于控制进度/扫描位置
  param2: number; // 通常用于控制 Δ/ε/δ 宽度
  zoom: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}
