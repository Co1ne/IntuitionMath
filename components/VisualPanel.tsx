
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

    const gGrid = svg.append('g').attr('class', 'grid-container');
    gGrid.append('g').attr('class', 'text-white/5').attr('transform', `translate(0, ${yScale(0)})`)
      .call(d3.axisBottom(xScale).ticks(10).tickSize(-height).tickFormat(() => ""));
    gGrid.append('g').attr('class', 'text-white/5').attr('transform', `translate(${xScale(0)}, 0)`)
      .call(d3.axisLeft(yScale).ticks(10).tickSize(-width).tickFormat(() => ""));

    const axes = svg.append('g');
    axes.append('line').attr('x1', 0).attr('x2', width).attr('y1', yScale(0)).attr('y2', yScale(0)).attr('stroke', '#333');
    axes.append('line').attr('x1', xScale(0)).attr('x2', xScale(0)).attr('y1', 0).attr('y2', height).attr('stroke', '#333');

    const lineGen = d3.line<[number, number]>().x(d => xScale(d[0])).y(d => yScale(d[1]));

    if (coefficients?.compiled) {
      const xRange = xScale.domain();
      const step = (xRange[1] - xRange[0]) / 300;
      const points: [number, number][] = d3.range(xRange[0], xRange[1], step).map(x => {
        try { return [x, coefficients.compiled.evaluate({ x })]; } catch { return [x, NaN]; }
      }).filter(d => !isNaN(d[1]) && isFinite(d[1]));
      svg.append('path').datum(points).attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 2).attr('opacity', 0.4).attr('d', lineGen);
    }

    if (state.topic === MathTopic.LIMIT_DEFINITION && coefficients?.compiled) {
      try {
        const L = coefficients.compiled.evaluate({ x: state.x0 });
        const eps = state.param1;
        const delta = state.param2;

        if (!isNaN(L) && isFinite(L)) {
          // Validation Logic: Check if graph exits epsilon band WITHIN delta band
          let isSafe = true;
          // Sample points within [x0 - delta, x0 + delta]
          const checkStep = delta / 20; 
          for (let tx = state.x0 - delta; tx <= state.x0 + delta; tx += checkStep) {
             const ty = coefficients.compiled.evaluate({x: tx});
             if (Math.abs(ty - L) > eps) {
                isSafe = false;
                break;
             }
          }

          const statusColor = isSafe ? '#10b981' : '#ef4444'; // Green or Red
          
          // Draw Epsilon Band (The Challenge) - Horizontal
          svg.append('rect')
            .attr('x', 0)
            .attr('y', yScale(L + eps))
            .attr('width', width)
            .attr('height', Math.abs(yScale(L + eps) - yScale(L - eps)))
            .attr('fill', '#f59e0b')
            .attr('opacity', 0.1);

          svg.append('line').attr('x1', 0).attr('x2', width).attr('y1', yScale(L + eps)).attr('y2', yScale(L + eps)).attr('stroke', '#f59e0b').attr('stroke-dasharray', '4').attr('opacity', 0.5);
          svg.append('line').attr('x1', 0).attr('x2', width).attr('y1', yScale(L - eps)).attr('y2', yScale(L - eps)).attr('stroke', '#f59e0b').attr('stroke-dasharray', '4').attr('opacity', 0.5);

          // Draw Delta Band (The Response) - Vertical
          const xLeft = xScale(state.x0 - delta);
          const xRight = xScale(state.x0 + delta);
          
          svg.append('line').attr('x1', xLeft).attr('x2', xLeft).attr('y1', 0).attr('y2', height).attr('stroke', statusColor).attr('stroke-width', 2).attr('opacity', 0.5);
          svg.append('line').attr('x1', xRight).attr('x2', xRight).attr('y1', 0).attr('y2', height).attr('stroke', statusColor).attr('stroke-width', 2).attr('opacity', 0.5);

          // Intersection Box (The Logic Zone)
          svg.append('rect')
             .attr('x', xLeft)
             .attr('y', yScale(L + eps))
             .attr('width', xRight - xLeft)
             .attr('height', Math.abs(yScale(L + eps) - yScale(L - eps)))
             .attr('fill', statusColor)
             .attr('opacity', 0.2)
             .attr('stroke', statusColor)
             .attr('stroke-width', 1);

          // Central Point
          svg.append('circle').attr('cx', xScale(state.x0)).attr('cy', yScale(L)).attr('r', 4).attr('fill', statusColor);
          
          // Label
          svg.append('text')
            .attr('x', xRight + 5)
            .attr('y', yScale(L) - 10)
            .text(isSafe ? "SAFE (δ works)" : "FAIL (δ too big)")
            .attr('fill', statusColor)
            .attr('font-size', '10px')
            .attr('font-weight', 'bold');
        }
      } catch (e) {}
    } 
    else if ((state.topic === MathTopic.TAYLOR_SERIES || state.topic === MathTopic.POWER_SERIES) && coefficients) {
      const xRange = xScale.domain();
      const step = (xRange[1] - xRange[0]) / 300;
      const points: [number, number][] = d3.range(xRange[0], xRange[1], step).map(x => [x, getTaylorY(x)]).filter(d => Math.abs(d[1]) < 50);
      svg.append('path').datum(points).attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 3).attr('d', lineGen);
    }
    else if (state.topic === MathTopic.INTEGRAL_BASIC && coefficients?.compiled) {
      const n = Math.floor(state.param1);
      const dx = 1 / n;
      for (let i = 0; i < n; i++) {
        const x = state.x0 + i * dx;
        const y = coefficients.compiled.evaluate({ x });
        svg.append('rect')
          .attr('x', xScale(x))
          .attr('y', yScale(Math.max(0, y)))
          .attr('width', xScale(x + dx) - xScale(x))
          .attr('height', Math.abs(yScale(y) - yScale(0)))
          .attr('fill', '#3b82f6')
          .attr('opacity', 0.3)
          .attr('stroke', '#3b82f6');
      }
    }

    try {
      const currentY = coefficients?.compiled ? coefficients.compiled.evaluate({ x: state.x0 }) : 0;
      if (!isNaN(currentY) && isFinite(currentY)) {
        svg.append('circle').attr('cx', xScale(state.x0)).attr('cy', yScale(currentY)).attr('r', 5).attr('fill', '#ef4444').attr('stroke', '#fff').attr('stroke-width', 2);
      }
    } catch (e) {}

  }, [state, transform, coefficients]);

  const renderSliders = () => {
    switch(state.topic) {
      case MathTopic.LIMIT_DEFINITION:
        return (
          <div className="flex gap-6">
            <div className="flex items-center gap-3">
               <span className="text-[10px] text-amber-500 font-black tracking-widest uppercase">Challenge ε</span>
               <input type="range" min="0.1" max="2" step="0.1" value={state.param1} onChange={(e) => onStateChange({...state, param1: parseFloat(e.target.value)})} className="w-24 accent-amber-500" />
               <span className="text-[10px] font-mono w-6">{state.param1.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-[10px] text-emerald-500 font-black tracking-widest uppercase">Response δ</span>
               <input type="range" min="0.05" max="2" step="0.05" value={state.param2} onChange={(e) => onStateChange({...state, param2: parseFloat(e.target.value)})} className="w-24 accent-emerald-500" />
               <span className="text-[10px] font-mono w-6">{state.param2.toFixed(2)}</span>
            </div>
          </div>
        );
      case MathTopic.TAYLOR_SERIES:
      case MathTopic.POWER_SERIES:
        return (
          <div className="flex items-center gap-3">
             <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">逼近项数 N</span>
             <div className="flex items-center bg-black/40 border border-white/10 rounded-lg overflow-hidden h-8">
                <button onClick={() => onStateChange({...state, order: Math.max(0, state.order - 1)})} className="px-3 hover:bg-white/5 text-white/40 transition-colors">-</button>
                <div className="w-10 text-center font-black text-amber-500 text-xs">{state.order}</div>
                <button onClick={() => onStateChange({...state, order: Math.min(20, state.order + 1)})} className="px-3 hover:bg-white/5 text-white/40 transition-colors">+</button>
             </div>
          </div>
        );
      case MathTopic.INTEGRAL_BASIC:
        return (
          <div className="flex items-center gap-3">
             <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">矩形个数 n</span>
             <input type="range" min="2" max="100" step="1" value={state.param1} onChange={(e) => onStateChange({...state, param1: parseFloat(e.target.value)})} className="w-32 accent-blue-500" />
             <span className="text-[10px] font-mono text-blue-400 w-6">{Math.floor(state.param1)}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#070707] rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative group/panel">
      <div className="px-6 py-4 bg-[#0d0d0d] border-b border-white/5 flex flex-wrap items-center gap-6 z-30 shadow-lg">
        <div className="flex-1 min-w-[200px]">
           <div className="relative group/input">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 font-black italic text-[10px] tracking-tighter uppercase opacity-50 group-hover/input:opacity-100 transition-opacity">Function:</span>
              <input type="text" value={state.functionString} onChange={(e) => onStateChange({...state, functionString: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-16 py-2.5 text-sm font-mono text-white/90 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all" />
              {error && <div className="absolute -bottom-10 left-0 bg-red-500/90 text-[10px] px-2 py-1 rounded-md z-50 animate-in fade-in slide-in-from-top-1">{error}</div>}
           </div>
        </div>
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-xl">
           <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">中心 x₀</span>
           <input type="number" step="0.1" value={state.x0} onChange={(e) => onStateChange({...state, x0: parseFloat(e.target.value) || 0})} className="w-14 bg-transparent border-none p-0 text-xs font-mono text-red-500 text-center focus:ring-0" />
        </div>
        {renderSliders()}
      </div>
      <div ref={containerRef} className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,_#121212_0%,_#070707_100%)]">
        <svg ref={svgRef} className="w-full h-full cursor-crosshair" />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 text-[9px] text-white/40 font-bold uppercase tracking-widest opacity-0 group-hover/panel:opacity-100 transition-opacity">
           Drag to Pan • Scroll to Zoom
        </div>
      </div>
    </div>
  );
};

export default VisualPanel;
