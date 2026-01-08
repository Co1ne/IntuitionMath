
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
  LIMIT_DEFINITION = 'LIMIT_DEFINITION',
  SQUEEZE_THEOREM = 'SQUEEZE_THEOREM',
  DERIVATIVE_BASIC = 'DERIVATIVE_BASIC',
  LHOPITAL_RULE = 'LHOPITAL_RULE',
  MVT_LAGRANGE = 'MVT_LAGRANGE',
  TAYLOR_SERIES = 'TAYLOR_SERIES',
  INTEGRAL_BASIC = 'INTEGRAL_BASIC',
  FTC = 'FTC',
  MULTIVARIABLE = 'MULTIVARIABLE',
  DIFF_EQUATIONS = 'DIFF_EQUATIONS'
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
  zoom: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}
