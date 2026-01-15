
import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import * as d3 from 'd3';
import { all, create } from 'mathjs';
import { GoogleGenAI } from "@google/genai";

const math = create(all);

// --- Types & Constants ---

enum MathTopic {
  LIMIT_DEFINITION = 'LIMIT_DEFINITION',
  SQUEEZE_THEOREM = 'SQUEEZE_THEOREM',
  DERIVATIVE_BASIC = 'DERIVATIVE_BASIC',
  FTC = 'FTC',
  TAYLOR_SERIES = 'TAYLOR_SERIES'
}

interface VisualState {
  topic: MathTopic;
  functionString: string;
  x0: number;
  order: number;
  param1: number; // e.g., epsilon or h
  param2: number; // e.g., delta or n
}

interface DerivationStep {
  id: string;
  title: string;
  goal: string;
  expression: string;
  explanation: string;
  visualHint?: Partial<VisualState>;
}

interface TopicManifest {
  id: MathTopic;
  name: string;
  initialVisualState: VisualState;
  steps: DerivationStep[];
  aiSystemPrompt: string;
}

const TOPIC_REGISTRY: Record<MathTopic, TopicManifest> = {
  [MathTopic.LIMIT_DEFINITION]: {
    id: MathTopic.LIMIT_DEFINITION,
    name: 'ε-δ Definition of Limit',
    initialVisualState: { topic: MathTopic.LIMIT_DEFINITION, functionString: 'x^2', x0: 2, order: 0, param1: 0.8, param2: 0.5 },
    aiSystemPrompt: "You are a math tutor explaining limits using epsilon-delta. Focus on the challenge-response nature: given an epsilon (vertical tolerance), we find a delta (horizontal range).",
    steps: [
      { id: 'l1', title: 'Targeting a Point', goal: 'Observe x approaching c', expression: 'x → 2, f(x) → 4', explanation: 'We want to formalize what it means to "infinitely approach" a value.', visualHint: { param1: 0.8, param2: 0.6 } },
      { id: 'l2', title: 'The Epsilon Challenge', goal: 'Define vertical error', expression: '|f(x) - L| < ε', explanation: 'Imagine a skeptic sets a tolerance window ε around the limit L.', visualHint: { param1: 0.3 } },
      { id: 'l3', title: 'The Delta Response', goal: 'Find horizontal range', expression: '0 < |x - c| < δ', explanation: 'Can we find a range δ such that every x inside it maps to a value inside the ε-window?', visualHint: { param1: 0.3, param2: 0.15 } }
    ]
  },
  [MathTopic.DERIVATIVE_BASIC]: {
    id: MathTopic.DERIVATIVE_BASIC,
    name: 'The Derivative: Instantaneous Change',
    initialVisualState: { topic: MathTopic.DERIVATIVE_BASIC, functionString: '0.5*x^2', x0: 1, order: 0, param1: 2, param2: 0 },
    aiSystemPrompt: "Explain the derivative as the slope of the tangent line. Describe the secant line collapsing into a tangent line as h approaches 0.",
    steps: [
      { id: 'd1', title: 'Average Velocity', goal: 'Secant line slope', expression: 'Δy / Δx', explanation: 'The slope between two points is the average rate of change.', visualHint: { param1: 1.5 } },
      { id: 'd2', title: 'Shrinking the Gap', goal: 'h → 0', expression: 'lim h→0', explanation: 'Bring the second point closer and closer to the first point.', visualHint: { param1: 0.2 } },
      { id: 'd3', title: 'Tangency', goal: 'The Instantaneous Rate', expression: "f'(x)", explanation: 'At the limit, the secant becomes the tangent line, representing the rate at exactly one point.', visualHint: { param1: 0.01 } }
    ]
  },
  [MathTopic.TAYLOR_SERIES]: {
    id: MathTopic.TAYLOR_SERIES,
    name: 'Taylor Series: Function Cloning',
    initialVisualState: { topic: MathTopic.TAYLOR_SERIES, functionString: 'exp(x)', x0: 0, order: 1, param1: 0, param2: 0 },
    aiSystemPrompt: "Explain Taylor Series as approximating a complex function by matching its derivatives at a single point. Each higher order term adds more 'curviness' to match the original.",
    steps: [
      { id: 't1', title: 'Linear Approximation', goal: 'Match value & slope', expression: 'f(a) + f\'(a)(x-a)', explanation: 'Start with a tangent line. It matches the value and first derivative.', visualHint: { order: 1 } },
      { id: 't2', title: 'Curvature Matching', goal: 'Add quadratic term', expression: '...+ f\'\'(a)/2 * (x-a)^2', explanation: 'Add the second derivative to match how the function curves.', visualHint: { order: 2 } },
      { id: 't3', title: 'Infinite Detail', goal: 'Higher order terms', expression: 'Σ f^(n)(a)/n! * (x-a)^n', explanation: 'As we add terms, the polynomial "clones" the original function over a wider range.', visualHint: { order: 8 } }
    ]
  },
  [MathTopic.SQUEEZE_THEOREM]: {
    id: MathTopic.SQUEEZE_THEOREM,
    name: 'Squeeze Theorem',
    initialVisualState: { topic: MathTopic.SQUEEZE_THEOREM, functionString: 'x^2 * sin(1/x)', x0: 0, order: 0, param1: 1, param2: 0 },
    aiSystemPrompt: "Use the 'two bodyguards' analogy. If two functions that bound another function both go to the same limit, the middle one must too.",
    steps: [
      { id: 's1', title: 'The Oscillating Function', goal: 'Analyze complexity', expression: 'f(x) = x²sin(1/x)', explanation: 'This function oscillates wildly near 0, making direct limits hard.', visualHint: { param1: 1 } },
      { id: 's2', title: 'The Enclosure', goal: 'Bounding functions', expression: '-x² ≤ f(x) ≤ x²', explanation: 'We find two simpler functions that always stay above and below the target.', visualHint: { param1: 1 } },
      { id: 's3', title: 'The Pinch', goal: 'Convergence at 0', expression: 'lim g(x) = lim h(x) = 0', explanation: 'As both bounds approach 0, the oscillating function has nowhere else to go.', visualHint: { param1: 0.1 } }
    ]
  },
  [MathTopic.FTC]: {
    id: MathTopic.FTC,
    name: 'Fundamental Theorem of Calculus',
    initialVisualState: { topic: MathTopic.FTC, functionString: '0.1*x^2 + 1', x0: 0, order: 0, param1: 3, param2: 0 },
    aiSystemPrompt: "Explain the link between area and derivatives. The rate at which area under a curve increases is exactly the height of the curve at that point.",
    steps: [
      { id: 'f1', title: 'The Area Accumulator', goal: 'Define A(x)', expression: '∫ f(t) dt', explanation: 'Consider the area from a fixed point to a variable point x.', visualHint: { param1: 2 } },
      { id: 'f2', title: 'The Micro-Slice', goal: 'Add Δx', expression: 'ΔA ≈ f(x)Δx', explanation: 'A tiny increase in x adds a tiny slice of area, roughly a rectangle of height f(x).', visualHint: { param1: 3, param2: 0.1 } },
      { id: 'f3', title: 'The Grand Connection', goal: 'A\'(x) = f(x)', expression: 'd/dx ∫ f(t)dt = f(x)', explanation: 'The derivative of the area function IS the original function.', visualHint: { param1: 3, param2: 0.01 } }
    ]
  }
};

// --- Components ---

const VisualPanel: React.FC<{ state: VisualState; onStateChange: (s: VisualState) => void }> = ({ state, onStateChange }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState(d3.zoomIdentity);

  const mathContext = useMemo(() => {
    try {
      const node = math.parse(state.functionString);
      const compiled = node.compile();
      let taylorExpr = "";
      if (state.topic === MathTopic.TAYLOR_SERIES) {
        let currentExpr = node;
        for (let i = 0; i <= state.order; i++) {
          const val = currentExpr.evaluate({ x: state.x0 });
          const coeff = val / math.factorial(i);
          if (Math.abs(coeff) > 1e-10) {
            taylorExpr += (taylorExpr === "" ? "" : " + ") + `(${coeff.toFixed(4)})*(x-${state.x0})^${i}`;
          }
          try { currentExpr = math.derivative(currentExpr, 'x'); } catch { break; }
        }
      }
      return { compiled, taylorExpr };
    } catch { return null; }
  }, [state.functionString, state.x0, state.order, state.topic]);

  useEffect(() => {
    if (!svgRef.current) return;
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const xScale = transform.rescaleX(d3.scaleLinear().domain([-5, 5]).range([0, width]));
    const yScale = transform.rescaleY(d3.scaleLinear().domain([-3, 3]).range([height, 0]));

    // Grid
    svg.append('g').attr('class', 'text-white/5')
       .call(d3.axisBottom(xScale).ticks(10).tickSize(-height).tickFormat(() => ""))
       .attr('transform', `translate(0, ${height})`);
    svg.append('g').attr('class', 'text-white/5')
       .call(d3.axisLeft(yScale).ticks(10).tickSize(-width).tickFormat(() => ""));

    // Axes
    svg.append('line').attr('x1', 0).attr('x2', width).attr('y1', yScale(0)).attr('y2', yScale(0)).attr('stroke', 'rgba(255,255,255,0.2)');
    svg.append('line').attr('x1', xScale(0)).attr('x2', xScale(0)).attr('y1', 0).attr('y2', height).attr('stroke', 'rgba(255,255,255,0.2)');

    const drawLine = (expr: any, color: string, width: number = 3, opacity: number = 1, dash: string = "") => {
      const data: [number, number][] = [];
      const domain = xScale.domain();
      const steps = 300;
      for (let i = 0; i <= steps; i++) {
        const x = domain[0] + (domain[1] - domain[0]) * (i / steps);
        try {
          const y = typeof expr === 'string' ? math.evaluate(expr, {x}) : expr.evaluate({x});
          if (!isNaN(y) && isFinite(y)) data.push([x, y]);
        } catch {}
      }
      const line = d3.line<[number, number]>().x(d => xScale(d[0])).y(d => yScale(d[1]));
      svg.append('path').datum(data).attr('fill', 'none').attr('stroke', color).attr('stroke-width', width).attr('opacity', opacity).attr('stroke-dasharray', dash).attr('d', line);
    };

    if (mathContext?.compiled) drawLine(mathContext.compiled, '#3b82f6', 4);

    // Topic Specific Overlays
    if (state.topic === MathTopic.LIMIT_DEFINITION && mathContext?.compiled) {
      const L = mathContext.compiled.evaluate({ x: state.x0 });
      const eps = state.param1;
      const delta = state.param2;
      svg.append('rect').attr('x', 0).attr('y', yScale(L + eps)).attr('width', width).attr('height', Math.abs(yScale(L + eps) - yScale(L - eps))).attr('fill', '#f59e0b').attr('opacity', 0.15);
      svg.append('rect').attr('x', xScale(state.x0 - delta)).attr('y', 0).attr('width', Math.abs(xScale(state.x0 + delta) - xScale(state.x0 - delta))).attr('height', height).attr('fill', '#10b981').attr('opacity', 0.1);
    }

    if (state.topic === MathTopic.DERIVATIVE_BASIC && mathContext?.compiled) {
      const h = state.param1;
      const x1 = state.x0, x2 = state.x0 + h;
      const y1 = mathContext.compiled.evaluate({x: x1}), y2 = mathContext.compiled.evaluate({x: x2});
      const slope = (y2-y1)/h;
      drawLine(`(${slope})*(x-${x1}) + ${y1}`, '#f59e0b', 2, 0.8, '5,5');
      svg.append('circle').attr('cx', xScale(x1)).attr('cy', yScale(y1)).attr('r', 4).attr('fill', '#fff');
      svg.append('circle').attr('cx', xScale(x2)).attr('cy', yScale(y2)).attr('r', 4).attr('fill', '#fff').attr('opacity', 0.5);
    }

    if (state.topic === MathTopic.SQUEEZE_THEOREM) {
      drawLine('x^2', '#f59e0b', 2, 0.4, '5,5');
      drawLine('-x^2', '#f59e0b', 2, 0.4, '5,5');
    }

    if (state.topic === MathTopic.TAYLOR_SERIES && mathContext?.taylorExpr) {
      drawLine(mathContext.taylorExpr, '#10b981', 3, 0.9);
      svg.append('circle').attr('cx', xScale(state.x0)).attr('cy', yScale(mathContext.compiled.evaluate({x: state.x0}))).attr('r', 5).attr('fill', '#10b981');
    }

    if (state.topic === MathTopic.FTC && mathContext?.compiled) {
      const x = state.param1;
      const dx = state.param2 || 0;
      const f = (x: number) => mathContext.compiled.evaluate({x});
      const areaData = [];
      const domain = xScale.domain();
      for (let i = 0; i <= 200; i++) {
        const xi = 0 + (x - 0) * (i / 200);
        areaData.push([xi, f(xi)]);
      }
      const areaGen = d3.area<any>().x(d => xScale(d[0])).y0(yScale(0)).y1(d => yScale(d[1]));
      svg.append('path').datum(areaData).attr('fill', '#3b82f6').attr('opacity', 0.2).attr('d', areaGen);
      
      if (dx > 0) {
        svg.append('rect').attr('x', xScale(x)).attr('y', yScale(f(x))).attr('width', Math.abs(xScale(x+dx)-xScale(x))).attr('height', Math.abs(yScale(f(x))-yScale(0))).attr('fill', '#f59e0b').attr('opacity', 0.5);
      }
    }

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>().on('zoom', (event) => setTransform(event.transform));
    svg.call(zoomBehavior);
  }, [state, transform, mathContext]);

  return (
    <div className="flex-1 bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden relative shadow-inner">
      <div className="absolute top-6 left-6 right-6 flex items-center gap-4 z-10">
        <div className="flex-1 bg-black/40 backdrop-blur px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-3">
          <span className="text-[10px] text-white/40 font-mono">f(x) =</span>
          <input 
            className="bg-transparent text-sm font-mono text-blue-400 outline-none w-full" 
            value={state.functionString} 
            onChange={e => onStateChange({...state, functionString: e.target.value})}
          />
        </div>
        <div className="bg-black/40 backdrop-blur px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-3">
          <span className="text-[10px] text-white/40 font-mono">x₀ =</span>
          <input 
            type="number" step="0.1"
            className="bg-transparent text-sm font-mono text-orange-400 outline-none w-12" 
            value={state.x0} 
            onChange={e => onStateChange({...state, x0: parseFloat(e.target.value)})}
          />
        </div>
      </div>
      <svg ref={svgRef} className="w-full h-full cursor-crosshair" />
    </div>
  );
};

const AIChat: React.FC<{ topic: MathTopic; step: DerivationStep; visual: VisualState }> = ({ topic, step, visual }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Current Topic: ${topic}
        Current Step: ${step.title} (${step.explanation})
        Current Visual Context: Function is ${visual.functionString}, focusing on x0=${visual.x0}.
        User Question: ${userMsg}
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: TOPIC_REGISTRY[topic].aiSystemPrompt + " Keep responses concise, 3Blue1Brown style, and focus on visual intuition.",
        }
      });
      setMessages(prev => [...prev, { role: 'model', content: response.text || "I couldn't generate a response." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', content: "Error connecting to the math intuition engine." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 flex flex-col bg-[#0d0d0d] border-l border-white/5 h-full">
      <div className="p-6 border-b border-white/5">
        <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-1">AI Tutor</h3>
        <p className="text-[10px] text-white/30 italic">Context aware guidance</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-[11px] text-white/20 italic text-center pt-10">
            Ask me about the visual logic of this step...
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-2xl px-4 py-2 text-[11px] leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/5 border border-white/10 text-white/70'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-[10px] text-blue-500 animate-pulse font-mono uppercase">Thinking...</div>}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 bg-black/20">
        <input 
          className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500/50"
          placeholder="Type a question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
      </div>
    </div>
  );
};

const App = () => {
  const [activeTopic, setActiveTopic] = useState<MathTopic>(MathTopic.LIMIT_DEFINITION);
  const [activeStepId, setActiveStepId] = useState('');
  const [visualState, setVisualState] = useState<VisualState>(TOPIC_REGISTRY[MathTopic.LIMIT_DEFINITION].initialVisualState);

  useEffect(() => {
    const topic = TOPIC_REGISTRY[activeTopic];
    setVisualState(topic.initialVisualState);
    setActiveStepId(topic.steps[0].id);
  }, [activeTopic]);

  const handleStepClick = (step: DerivationStep) => {
    setActiveStepId(step.id);
    if (step.visualHint) {
      setVisualState(prev => ({ ...prev, ...step.visualHint }));
    }
  };

  const currentTopic = TOPIC_REGISTRY[activeTopic];
  const currentStep = currentTopic.steps.find(s => s.id === activeStepId) || currentTopic.steps[0];

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white overflow-hidden">
      {/* Sidebar Topics */}
      <div className="w-64 bg-black border-r border-white/5 flex flex-col p-8 shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-blue-500 rounded-