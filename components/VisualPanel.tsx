
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

  const mathContext = useMemo(() => {
    try {
      if (!state.functionString?.trim()) return null;
      setError(null);
      const node = math.parse(state.functionString);
      const compiled = node.compile();
      
      let taylorExpr = "";
      if (state.topic === MathTopic.TAYLOR_SERIES) {
        let currentExpr = node;
        for (let i = 0; i <= (state.order || 8); i++) {
          const val = currentExpr.evaluate({ x: state.x0 });
          const coeff = val / math.factorial(i);
          if (Math.abs(coeff) > 1e-10) {
            taylorExpr += (taylorExpr === "" ? "" : " + ") + `(${coeff.toFixed(3)})*(x-${state.x0})^${i}`;
          }
          try { currentExpr = math.derivative(currentExpr, 'x'); } catch { break; }
        }
      }
      return { compiled, taylorExpr };
    } catch (e) {
      setError("公式解析错误");
      return null;
    }
  }, [state.functionString, state.x0, state.order, state.topic]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const xScale = transform.rescaleX(d3.scaleLinear().domain([-5, 5]).range([0, width]));
    const yScale = transform.rescaleY(d3.scaleLinear().domain([-3, 3]).range([height, 0]));

    const drawAxes = () => {
      svg.append('g').attr('class', 'grid text-white/5')
        .attr('transform', `translate(0, ${yScale(0)})`)
        .call(d3.axisBottom(xScale).ticks(20).tickSize(-height).tickFormat(() => ""));
      svg.append('g').attr('class', 'grid text-white/5')
        .attr('transform', `translate(${xScale(0)}, 0)`)
        .call(d3.axisLeft(yScale).ticks(20).tickSize(-width).tickFormat(() => ""));
      const axes = svg.append('g');
      axes.append('line').attr('x1', 0).attr('x2', width).attr('y1', yScale(0)).attr('y2', yScale(0)).attr('stroke', 'rgba(255,255,255,0.3)').attr('stroke-width', 1.5);
      axes.append('line').attr('x1', xScale(0)).attr('x2', xScale(0)).attr('y1', 0).attr('y2', height).attr('stroke', 'rgba(255,255,255,0.3)').attr('stroke-width', 1.5);
    };

    const plot = (expr: any, color: string, opacity: number = 1, strokeWidth: number = 3, dash: string = "") => {
      const lineGen = d3.line<[number, number]>().x(d => xScale(d[0])).y(d => yScale(d[1]));
      const xRange = xScale.domain();
      const data: [number, number][] = [];
      const steps = 400;
      for (let i = 0; i <= steps; i++) {
        const x = xRange[0] + (xRange[1] - xRange[0]) * (i / steps);
        try {
          const y = typeof expr === 'string' ? math.evaluate(expr, {x}) : expr.evaluate({x});
          if (!isNaN(y) && isFinite(y) && Math.abs(y) < 100) data.push([x, y]);
        } catch {}
      }
      if (data.length > 1) {
        svg.append('path').datum(data).attr('fill', 'none').attr('stroke', color).attr('stroke-width', strokeWidth).attr('opacity', opacity).attr('stroke-dasharray', dash).attr('d', lineGen);
      }
      return data;
    };

    const RENDER_STRATEGIES: Record<string, () => void> = {
      [MathTopic.LIMIT_DEFINITION]: () => {
        if (!mathContext?.compiled) return;
        const L = mathContext.compiled.evaluate({ x: state.x0 });
        svg.append('rect').attr('x', 0).attr('y', yScale(L + state.param1)).attr('width', width).attr('height', Math.abs(yScale(L + state.param1) - yScale(L - state.param1))).attr('fill', '#f59e0b').attr('opacity', 0.15);
        if (state.param2 > 0.001) {
          const xl = xScale(state.x0 - state.param2), xr = xScale(state.x0 + state.param2);
          svg.append('rect').attr('x', xl).attr('y', 0).attr('width', xr - xl).attr('height', height).attr('fill', '#10b981').attr('opacity', 0.1);
        }
      },
      [MathTopic.SQUEEZE_THEOREM]: () => {
        plot('x^2', '#f59e0b', 0.4, 2, '5,5');
        plot('-x^2', '#f59e0b', 0.4, 2, '5,5');
      },
      [MathTopic.IVT_THEOREMS]: () => {
        const K = state.param2;
        svg.append('line').attr('x1', 0).attr('y1', yScale(K)).attr('x2', width).attr('y2', yScale(K)).attr('stroke', '#f59e0b').attr('stroke-width', 2).attr('stroke-dasharray', '5,5');
        svg.append('text').attr('x', 10).attr('y', yScale(K)-5).attr('fill', '#f59e0b').text(`Height K = ${K}`).style('font-size', '10px');
      },
      [MathTopic.DERIVATIVE_BASIC]: () => {
        if (!mathContext?.compiled) return;
        const x1 = state.x0, x2 = state.x0 + (state.param1 || 0.1);
        const y1 = mathContext.compiled.evaluate({x: x1}), y2 = mathContext.compiled.evaluate({x: x2});
        svg.append('line').attr('x1', xScale(x1)).attr('y1', yScale(y1)).attr('x2', xScale(x2)).attr('y2', yScale(y2)).attr('stroke', '#f59e0b').attr('stroke-width', 2);
        svg.append('circle').attr('cx', xScale(x1)).attr('cy', yScale(y1)).attr('r', 4).attr('fill', 'white');
      },
      [MathTopic.MVT_LAGRANGE]: () => {
        if (!mathContext?.compiled) return;
        const a = state.x0, b = state.param1;
        const ya = mathContext.compiled.evaluate({x: a}), yb = mathContext.compiled.evaluate({x: b});
        svg.append('line').attr('x1', xScale(a)).attr('y1', yScale(ya)).attr('x2', xScale(b)).attr('y2', yScale(yb)).attr('stroke', '#f59e0b').attr('stroke-width', 2).attr('stroke-dasharray', '5,5');
        if (state.param2 >= 2) {
           plot(`((${yb}-${ya})/(${b}-${a}))*(x-${a}) + ${ya}`, '#10b981', 0.5, 2);
        }
      },
      [MathTopic.INTEGRAL_BASIC]: () => {
        if (!mathContext?.compiled) return;
        const n = Math.floor(state.param2) || 4;
        const a = 0, b = state.param1 || 4;
        const dx = (b - a) / n;
        for (let i = 0; i < n; i++) {
          const x = a + i * dx;
          const y = mathContext.compiled.evaluate({x});
          svg.append('rect').attr('x', xScale(x)).attr('y', yScale(Math.max(0, y))).attr('width', Math.abs(xScale(x + dx) - xScale(x))).attr('height', Math.abs(yScale(y) - yScale(0))).attr('fill', '#3b82f6').attr('opacity', 0.3).attr('stroke', 'rgba(255,255,255,0.1)');
        }
      },
      [MathTopic.AREA_BETWEEN_CURVES]: () => {
        const gExpr = '0.5x + 0.5';
        const fData = plot(state.functionString, '#3b82f6', 1, 4);
        const gData = plot(gExpr, '#ef4444', 0.6, 2, '5,5');
        
        // Shading between
        const areaGen = d3.area<[number, number]>()
          .x(d => xScale(d[0]))
          .y0(d => {
            try { return yScale(math.evaluate(gExpr, {x: d[0]})); } catch { return yScale(0); }
          })
          .y1(d => yScale(d[1]));
        svg.append('path').datum(fData).attr('fill', '#3b82f6').attr('opacity', 0.15).attr('d', areaGen);
      },
      [MathTopic.VOLUME_ROTATION]: () => {
        if (!mathContext?.compiled) return;
        const xRange = [0, state.param1 || 4];
        const step = 0.5;
        for (let x = xRange[0]; x <= xRange[1]; x += step) {
          const r = mathContext.compiled.evaluate({x});
          if (r > 0) {
            svg.append('ellipse')
              .attr('cx', xScale(x))
              .attr('cy', yScale(0))
              .attr('rx', 5)
              .attr('ry', Math.abs(yScale(r) - yScale(0)))
              .attr('fill', 'none')
              .attr('stroke', '#3b82f6')
              .attr('opacity', 0.3);
          }
        }
      },
      [MathTopic.DE_LOGISTIC]: () => {
        const K = state.param2;
        svg.append('line').attr('x1', 0).attr('y1', yScale(K)).attr('x2', width).attr('y2', yScale(K)).attr('stroke', '#ef4444').attr('stroke-width', 1).attr('stroke-dasharray', '4,4');
        svg.append('text').attr('x', width - 80).attr('y', yScale(K)-5).attr('fill', '#ef4444').text(`Limit K`).style('font-size', '10px');
      },
      [MathTopic.TAYLOR_SERIES]: () => {
        if (mathContext?.taylorExpr) plot(mathContext.taylorExpr, '#f59e0b', 0.85, 3);
        svg.append('circle').attr('cx', xScale(state.x0)).attr('cy', yScale(mathContext?.compiled.evaluate({x: state.x0}))).attr('r', 5).attr('fill', '#f59e0b');
      },
      [MathTopic.GRADIENT_VECTOR]: () => {
        if (!mathContext?.compiled) return;
        const step = 0.8;
        for (let ix = -4; ix <= 4; ix += step) {
          for (let iy = -3; iy <= 3; iy += step) {
            const h = 0.05;
            try {
              const gx = (mathContext.compiled.evaluate({x: ix+h, y: iy}) - mathContext.compiled.evaluate({x: ix, y: iy})) / h;
              const gy = (mathContext.compiled.evaluate({x: ix, y: iy+h}) - mathContext.compiled.evaluate({x: ix, y: iy})) / h;
              const mag = Math.sqrt(gx*gx + gy*gy) || 0.001;
              const u = (gx/mag) * 12, v = -(gy/mag) * 12;
              svg.append('line').attr('x1', xScale(ix)).attr('y1', yScale(iy)).attr('x2', xScale(ix) + u).attr('y2', yScale(iy) + v).attr('stroke', 'rgba(59, 130, 246, 0.4)').attr('marker-end', 'url(#arrow)');
            } catch {}
          }
        }
      }
    };

    drawAxes();
    if (mathContext?.compiled) plot(mathContext.compiled, '#3b82f6', 1, 4);
    if (RENDER_STRATEGIES[state.topic]) RENDER_STRATEGIES[state.topic]();

    svg.call(d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.1, 500]).on('zoom', (event) => setTransform(event.transform)));
  }, [state, transform, mathContext]);

  return (
    <div className="flex flex-col h-full bg-[#070707] rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
      <div className="px-6 py-4 bg-[#0d0d0d] border-b border-white/5 flex items-center gap-6 z-30">
        <div className="flex-1 flex flex-col gap-1">
           <span className="text-[8px] text-white/20 font-black uppercase tracking-widest">Active Function</span>
           <input type="text" value={state.functionString} onChange={(e) => onStateChange({...state, functionString: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm font-mono text-white focus:border-blue-500/50" />
        </div>
        <div className="flex items-center gap-2">
           <div className="flex flex-col gap-1">
             <span className="text-[8px] text-white/20 font-black uppercase tracking-widest">Pivot X₀</span>
             <input type="number" step="0.1" value={state.x0} onChange={(e) => onStateChange({...state, x0: parseFloat(e.target.value) || 0})} className="w-16 bg-transparent border-b border-white/10 p-1 text-xs font-mono text-blue-500 text-center" />
           </div>
        </div>
      </div>
      <div ref={containerRef} className="flex-1 bg-black relative">
        <svg ref={svgRef} className="w-full h-full cursor-move">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(59, 130, 246, 0.4)" />
            </marker>
          </defs>
        </svg>
        {error && <div className="absolute bottom-4 left-6 text-red-500 text-[10px] bg-black/80 px-2 py-1 rounded border border-red-500/20 font-mono tracking-tighter">ERROR: {error}</div>}
      </div>
    </div>
  );
};

export default VisualPanel;
