
import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import * as math from 'mathjs';
import { VisualState, MathTopic } from '../types';

interface VisualPanelProps {
  state: VisualState;
  onStateChange: (state: VisualState) => void;
}

const VisualPanel: React.FC<VisualPanelProps> = ({ state, onStateChange }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(d3.zoomIdentity);
  const [error, setError] = useState<string | null>(null);

  const coefficients = useMemo(() => {
    try {
      setError(null);
      const node = math.parse(state.functionString);
      const compiled = node.compile();
      const coeffs: number[] = [];
      let currentExpr = node;
      
      if (state.topic === MathTopic.TAYLOR_SERIES) {
        for (let i = 0; i <= state.order; i++) {
          const val = currentExpr.evaluate({ x: state.x0 });
          coeffs.push(val / math.factorial(i));
          try { currentExpr = math.derivative(currentExpr, 'x'); } catch { break; }
        }
      }
      return { coeffs, compiled, node };
    } catch (e) {
      setError("语法错误");
      return null;
    }
  }, [state.functionString, state.x0, state.order, state.topic]);

  const getTaylorY = (x: number) => {
    if (!coefficients?.coeffs) return 0;
    return coefficients.coeffs.reduce((acc, c, i) => acc + c * Math.pow(x - state.x0, i), 0);
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const xScale = transform.rescaleX(d3.scaleLinear().domain([-10, 10]).range([0, width]));
    const yScale = transform.rescaleY(d3.scaleLinear().domain([-5, 5]).range([height, 0]));

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 100])
      .on('zoom', (event) => setTransform(event.transform));
    svg.call(zoomBehavior);

    // 网格与坐标轴
    const gGrid = svg.append('g').attr('class', 'grid-container');
    gGrid.append('g').attr('class', 'text-white/5').attr('transform', `translate(0, ${yScale(0)})`)
      .call(d3.axisBottom(xScale).ticks(10).tickSize(-height).tickFormat(() => ""));
    gGrid.append('g').attr('class', 'text-white/5').attr('transform', `translate(${xScale(0)}, 0)`)
      .call(d3.axisLeft(yScale).ticks(10).tickSize(-width).tickFormat(() => ""));

    const axes = svg.append('g');
    axes.append('line').attr('x1', 0).attr('x2', width).attr('y1', yScale(0)).attr('y2', yScale(0)).attr('stroke', '#444');
    axes.append('line').attr('x1', xScale(0)).attr('x2', xScale(0)).attr('y1', 0).attr('y2', height).attr('stroke', '#444');

    const lineGen = d3.line<[number, number]>().x(d => xScale(d[0])).y(d => yScale(d[1]));

    // 1. 绘制基础函数
    if (coefficients?.compiled) {
      const xRange = xScale.domain();
      const points: [number, number][] = d3.range(xRange[0], xRange[1], 0.1).map(x => {
        try { return [x, coefficients.compiled.evaluate({ x })]; } catch { return [x, NaN]; }
      }).filter(d => !isNaN(d[1]));
      svg.append('path').datum(points).attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 2).attr('opacity', 0.3).attr('d', lineGen);
    }

    // 2. 根据 Topic 绘制特定层
    if (state.topic === MathTopic.TAYLOR_SERIES && coefficients) {
      const xRange = xScale.domain();
      const points: [number, number][] = d3.range(xRange[0], xRange[1], 0.1).map(x => [x, getTaylorY(x)]);
      svg.append('path').datum(points).attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 3).attr('d', lineGen);
    } 
    // Fix: Using DERIVATIVE_BASIC instead of DERIVATIVES to match MathTopic enum
    else if (state.topic === MathTopic.DERIVATIVE_BASIC && coefficients?.compiled) {
      const h = 0.5;
      const x1 = state.x0;
      const x2 = state.x0 + h;
      const y1 = coefficients.compiled.evaluate({ x: x1 });
      const y2 = coefficients.compiled.evaluate({ x: x2 });
      // 割线
      svg.append('line')
        .attr('x1', xScale(x1)).attr('y1', yScale(y1))
        .attr('x2', xScale(x2)).attr('y2', yScale(y2))
        .attr('stroke', '#10b981').attr('stroke-width', 2).attr('stroke-dasharray', '4');
    }
    // Fix: Using INTEGRAL_BASIC instead of INTEGRALS to match MathTopic enum
    else if (state.topic === MathTopic.INTEGRAL_BASIC && coefficients?.compiled) {
      const n = Math.floor(state.param1 || 10);
      const a = state.x0;
      const b = state.x0 + 5;
      const dx = (b - a) / n;
      for (let i = 0; i < n; i++) {
        const x = a + i * dx;
        const y = coefficients.compiled.evaluate({ x });
        svg.append('rect')
          .attr('x', xScale(x)).attr('y', y > 0 ? yScale(y) : yScale(0))
          .attr('width', xScale(x + dx) - xScale(x))
          .attr('height', Math.abs(yScale(y) - yScale(0)))
          .attr('fill', '#8b5cf6').attr('opacity', 0.3).attr('stroke', '#8b5cf6');
      }
    }

    // 锚点
    const currentY = coefficients?.compiled ? coefficients.compiled.evaluate({ x: state.x0 }) : 0;
    svg.append('circle').attr('cx', xScale(state.x0)).attr('cy', yScale(currentY)).attr('r', 6).attr('fill', '#ef4444').attr('stroke', '#fff');

  }, [state, transform, coefficients]);

  const updateOrder = (val: number) => onStateChange({ ...state, order: Math.max(0, Math.min(20, val)) });
  const handleX0Change = (val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num)) onStateChange({ ...state, x0: num });
  };

  return (
    <div className="flex flex-col h-full bg-[#070707] rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
      <div className="px-6 py-4 bg-[#0d0d0d] border-b border-white/5 flex flex-wrap items-center gap-6 z-30">
        <div className="flex-1 min-w-[200px]">
           <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 font-black italic text-xs">f(x) =</span>
              <input 
                type="text" 
                value={state.functionString}
                onChange={(e) => onStateChange({...state, functionString: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-14 py-2 text-sm font-mono text-white/90 focus:border-blue-500/50"
              />
              {error && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-red-500 font-bold">{error}</span>}
           </div>
        </div>

        <div className="flex items-center gap-3">
           <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">探测点 x₀</span>
           <input 
             type="number" step="0.1" value={state.x0.toFixed(2)}
             onChange={(e) => handleX0Change(e.target.value)}
             className="w-20 bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs font-mono text-red-500 text-center"
           />
        </div>

        {state.topic === MathTopic.TAYLOR_SERIES && (
          <div className="flex items-center gap-3">
             <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">阶数 N</span>
             <div className="flex items-center bg-black/40 border border-white/10 rounded-lg overflow-hidden h-8">
                <button onClick={() => updateOrder(state.order-1)} className="px-3 hover:bg-white/5 text-white/40">-</button>
                <div className="w-10 text-center font-black text-amber-500 text-xs">{state.order}</div>
                <button onClick={() => updateOrder(state.order+1)} className="px-3 hover:bg-white/5 text-white/40">+</button>
             </div>
          </div>
        )}

        {/* Fix: Using INTEGRAL_BASIC instead of INTEGRALS to match MathTopic enum */}
        {state.topic === MathTopic.INTEGRAL_BASIC && (
          <div className="flex items-center gap-3">
             <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">分段数 n</span>
             <input 
               type="range" min="1" max="100" value={state.param1 || 10}
               onChange={(e) => onStateChange({...state, param1: parseInt(e.target.value)})}
               className="w-24 accent-purple-500"
             />
             <span className="text-xs font-mono text-purple-400">{state.param1 || 10}</span>
          </div>
        )}
      </div>

      <div ref={containerRef} className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,_#121212_0%,_#070707_100%)]">
        <svg ref={svgRef} className="w-full h-full cursor-crosshair" />
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded text-[10px] text-white/20">
           滚轮缩放 / 拖拽平移
        </div>
      </div>
    </div>
  );
};

export default VisualPanel;
