
import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { all, create } from 'mathjs';
import { VisualState, MathTopic } from '../types';

const math = create(all);

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
      if (!state.functionString || !state.functionString.trim()) return null;
      setError(null);
      const node = math.parse(state.functionString);
      const compiled = node.compile();
      const coeffs: number[] = [];
      let currentExpr = node;
      
      // Calculate Taylor coefficients dynamically up to order 20
      if (state.topic === MathTopic.TAYLOR_SERIES || state.topic === MathTopic.POWER_SERIES) {
        for (let i = 0; i <= state.order; i++) {
          const val = currentExpr.evaluate({ x: state.x0 });
          coeffs.push(val / math.factorial(i));
          try { 
            currentExpr = math.derivative(currentExpr, 'x'); 
          } catch { 
            break; 
          }
        }
      }
      return { coeffs, compiled, node };
    } catch (e) {
      setError("公式解析错误");
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
    if (width <= 0 || height <= 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const xScale = transform.rescaleX(d3.scaleLinear().domain([-5, 5]).range([0, width]));
    const yScale = transform.rescaleY(d3.scaleLinear().domain([-3, 3]).range([height, 0]));

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 100])
      .on('zoom', (event) => setTransform(event.transform));
    svg.call(zoomBehavior);

    // Grid System
    const gGrid = svg.append('g').attr('class', 'grid-container');
    gGrid.append('g').attr('class', 'text-white/5').attr('transform', `translate(0, ${yScale(0)})`)
      .call(d3.axisBottom(xScale).ticks(10).tickSize(-height).tickFormat(() => ""));
    gGrid.append('g').attr('class', 'text-white/5').attr('transform', `translate(${xScale(0)}, 0)`)
      .call(d3.axisLeft(yScale).ticks(10).tickSize(-width).tickFormat(() => ""));

    // Main Axes
    const axes = svg.append('g');
    axes.append('line').attr('x1', 0).attr('x2', width).attr('y1', yScale(0)).attr('y2', yScale(0)).attr('stroke', '#333');
    axes.append('line').attr('x1', xScale(0)).attr('x2', xScale(0)).attr('y1', 0).attr('y2', height).attr('stroke', '#333');

    const lineGen = d3.line<[number, number]>().x(d => xScale(d[0])).y(d => yScale(d[1]));

    // Plot Base Function
    if (coefficients?.compiled) {
      const xRange = xScale.domain();
      const step = (xRange[1] - xRange[0]) / 400;
      const points: [number, number][] = d3.range(xRange[0], xRange[1], step).map(x => {
        try { return [x, coefficients.compiled.evaluate({ x })]; } catch { return [x, NaN]; }
      }).filter(d => !isNaN(d[1]) && isFinite(d[1]));
      
      svg.append('path')
        .datum(points)
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 2)
        .attr('opacity', 0.4)
        .attr('d', lineGen);
    }

    // Specific Visualizations for Topics
    if (state.topic === MathTopic.LIMIT_DEFINITION && coefficients?.compiled) {
      try {
        const L = coefficients.compiled.evaluate({ x: state.x0 });
        const eps = state.param1;
        const delta = state.param2;

        if (!isNaN(L) && isFinite(L)) {
          // Epsilon Band
          svg.append('rect').attr('x', 0).attr('y', yScale(L + eps)).attr('width', width).attr('height', Math.abs(yScale(L + eps) - yScale(L - eps))).attr('fill', '#f59e0b').attr('opacity', 0.1);
          // Delta Band
          const xLeft = xScale(state.x0 - delta), xRight = xScale(state.x0 + delta);
          svg.append('rect').attr('x', xLeft).attr('y', 0).attr('width', xRight - xLeft).attr('height', height).attr('fill', '#10b981').attr('opacity', 0.1);
        }
      } catch (e) {}
    } 
    else if (state.topic === MathTopic.DERIVATIVE_BASIC && coefficients?.compiled) {
       // Visualizing Secant vs Tangent
       const h = state.param1 || 0.5;
       try {
         const y0 = coefficients.compiled.evaluate({ x: state.x0 });
         const yh = coefficients.compiled.evaluate({ x: state.x0 + h });
         
         // Secant Line
         const m = (yh - y0) / h;
         const xRange = xScale.domain();
         const secantPoints: [number, number][] = [
           [state.x0 - 2, y0 - 2*m],
           [state.x0 + 2, y0 + 2*m]
         ];
         svg.append('path').datum(secantPoints).attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 1.5).attr('stroke-dasharray', '4').attr('d', lineGen);
         
         // Point Markers
         svg.append('circle').attr('cx', xScale(state.x0)).attr('cy', yScale(y0)).attr('r', 4).attr('fill', '#ef4444');
         svg.append('circle').attr('cx', xScale(state.x0 + h)).attr('cy', yScale(yh)).attr('r', 4).attr('fill', '#f59e0b');
       } catch(e){}
    }
    else if ((state.topic === MathTopic.TAYLOR_SERIES || state.topic === MathTopic.POWER_SERIES) && coefficients) {
      const xRange = xScale.domain();
      const step = (xRange[1] - xRange[0]) / 300;
      const points: [number, number][] = d3.range(xRange[0], xRange[1], step).map(x => [x, getTaylorY(x)]).filter(d => Math.abs(d[1]) < 50);
      
      svg.append('path')
        .datum(points)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 3)
        .attr('d', lineGen);

      // Expansion Point marker
      try {
        const y0 = coefficients.compiled.evaluate({x: state.x0});
        svg.append('circle').attr('cx', xScale(state.x0)).attr('cy', yScale(y0)).attr('r', 6).attr('fill', '#fff').attr('stroke', '#f59e0b').attr('stroke-width', 2);
        svg.append('text').attr('x', xScale(state.x0) + 10).attr('y', yScale(y0) - 10).text(`a = ${state.x0.toFixed(1)}`).attr('fill', '#fff').attr('font-size', '10px').attr('font-weight', 'bold');
      } catch(e){}
    }

    // Default current point highlight
    try {
      const currentY = coefficients?.compiled ? coefficients.compiled.evaluate({ x: state.x0 }) : 0;
      if (!isNaN(currentY) && isFinite(currentY)) {
        svg.append('circle').attr('cx', xScale(state.x0)).attr('cy', yScale(currentY)).attr('r', 4).attr('fill', '#ef4444').attr('opacity', 0.5);
      }
    } catch (e) {}

  }, [state, transform, coefficients]);

  const renderSliders = () => {
    switch(state.topic) {
      case MathTopic.LIMIT_DEFINITION:
        return (
          <div className="flex gap-6">
            <div className="flex items-center gap-3">
               <span className="text-[10px] text-amber-500 font-black uppercase">ε</span>
               <input type="range" min="0.1" max="2" step="0.1" value={state.param1} onChange={(e) => onStateChange({...state, param1: parseFloat(e.target.value)})} className="w-20 accent-amber-500" />
            </div>
            <div className="flex items-center gap-3">
               <span className="text-[10px] text-emerald-500 font-black uppercase">δ</span>
               <input type="range" min="0.05" max="2" step="0.05" value={state.param2} onChange={(e) => onStateChange({...state, param2: parseFloat(e.target.value)})} className="w-20 accent-emerald-500" />
            </div>
          </div>
        );
      case MathTopic.DERIVATIVE_BASIC:
        return (
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-amber-500 font-black uppercase">间隔 h</span>
            <input type="range" min="0.01" max="2" step="0.01" value={state.param1} onChange={(e) => onStateChange({...state, param1: parseFloat(e.target.value)})} className="w-32 accent-amber-500" />
            <span className="text-[10px] font-mono text-amber-500 w-8">{state.param1.toFixed(2)}</span>
          </div>
        );
      case MathTopic.TAYLOR_SERIES:
      case MathTopic.POWER_SERIES:
        return (
          <div className="flex items-center gap-3">
             <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">阶数 N</span>
             <div className="flex items-center bg-black/40 border border-white/10 rounded-lg h-8">
                <button onClick={() => onStateChange({...state, order: Math.max(0, state.order - 1)})} className="px-3 hover:bg-white/5 text-white/40">-</button>
                <div className="w-10 text-center font-black text-amber-500 text-xs">{state.order}</div>
                <button onClick={() => onStateChange({...state, order: Math.min(20, state.order + 1)})} className="px-3 hover:bg-white/5 text-white/40">+</button>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#070707] rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative group/panel">
      <div className="px-6 py-4 bg-[#0d0d0d] border-b border-white/5 flex flex-wrap items-center gap-6 z-30">
        <div className="flex-1 min-w-[200px]">
           <div className="relative">
              <input type="text" value={state.functionString} onChange={(e) => onStateChange({...state, functionString: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white/90 focus:border-blue-500/50" />
           </div>
        </div>
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-xl">
           <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">中心 x₀</span>
           <input type="number" step="0.1" value={state.x0} onChange={(e) => onStateChange({...state, x0: parseFloat(e.target.value) || 0})} className="w-12 bg-transparent border-none p-0 text-xs font-mono text-red-500 text-center" />
        </div>
        {renderSliders()}
      </div>
      <div ref={containerRef} className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,_#121212_0%,_#070707_100%)]">
        <svg ref={svgRef} className="w-full h-full cursor-crosshair" />
      </div>
    </div>
  );
};

export default VisualPanel;
