
import React, { useState, useEffect } from 'react';
import DerivationPanel from './components/DerivationPanel';
import VisualPanel from './components/VisualPanel';
import AIChatPanel from './components/AIChatPanel';
import { VisualState, MathTopic } from './types';
import { UNITS, TOPIC_CONTENT } from './constants';

const App: React.FC = () => {
  const [activeUnitId, setActiveUnitId] = useState(UNITS[0].id); 
  const [topic, setTopic] = useState(MathTopic.LIMIT_DEFINITION);
  const [currentStepId, setCurrentStepId] = useState(TOPIC_CONTENT[MathTopic.LIMIT_DEFINITION][0].id);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [visualState, setVisualState] = useState<VisualState>({
    topic: MathTopic.LIMIT_DEFINITION,
    functionString: 'x^2',
    x0: 1,
    order: 0,
    param1: 0.5, 
    param2: 0.3,
    zoom: 1
  });

  const activeUnit = UNITS.find(u => u.id === activeUnitId) || UNITS[0];

  const handleTopicJump = (newTopicId: MathTopic) => {
    const targetUnit = UNITS.find(u => u.chapters.some(c => c.topics.some(t => t.id === newTopicId)));
    if (targetUnit) setActiveUnitId(targetUnit.id);
    setTopic(newTopicId);
  };

  useEffect(() => {
    const defaultSteps = TOPIC_CONTENT[topic];
    if (defaultSteps && defaultSteps.length > 0) {
      setCurrentStepId(defaultSteps[0].id);
    }
    
    // Default config
    let config = { fn: 'x^2', x0: 1, order: 0, p1: 0.5, p2: 0.3 };

    switch(topic) {
      // Unit 1 Limits
      case MathTopic.LIMIT_ONESIDED:
        config = { fn: 'x / abs(x)', x0: 0, order: 0, p1: 0.5, p2: 0.5 }; // Sign function
        break;
      case MathTopic.LIMIT_INFINITE:
        config = { fn: '1/x', x0: 0, order: 0, p1: 0.5, p2: 0.5 };
        break;
      case MathTopic.SQUEEZE_THEOREM:
        config = { fn: 'x^2 * sin(1/x)', x0: 0, order: 1, p1: 1, p2: 1 };
        break;
        
      // Unit 2 Derivatives
      case MathTopic.LINEAR_APPROX:
        config = { fn: 'sqrt(x)', x0: 4, order: 1, p1: 1, p2: 1 }; // Good for linearization
        break;
      case MathTopic.CHAIN_RULE:
        config = { fn: 'sin(x^2)', x0: 1, order: 1, p1: 1, p2: 1 };
        break;

      // Unit 3 MVT
      case MathTopic.MVT_ROLLE:
        config = { fn: 'cos(x)', x0: 0, order: 0, p1: 0.5, p2: 0.5 };
        break;
      case MathTopic.MVT_LAGRANGE:
        config = { fn: 'x^2 - 2x', x0: 1.5, order: 0, p1: 0.5, p2: 0.5 };
        break;
      case MathTopic.LHOPITAL_RULE:
        config = { fn: 'sin(x)/x', x0: 0, order: 1, p1: 1, p2: 1 };
        break;
      case MathTopic.CONCAVITY_CURVE:
        config = { fn: 'x^3 - 3x', x0: 0, order: 2, p1: 1, p2: 1 };
        break;
      case MathTopic.OPTIMIZATION:
        config = { fn: '-x^2 + 4x', x0: 2, order: 1, p1: 1, p2: 1 };
        break;

      // Unit 4 Integrals
      case MathTopic.INTEGRAL_BASIC:
        config = { fn: 'x^2', x0: 1, order: 1, p1: 10, p2: 1 }; 
        break;
      case MathTopic.FTC:
        config = { fn: '0.5x + 1', x0: 2, order: 1, p1: 1, p2: 1 };
        break;
      case MathTopic.INTEGRATION_SUBSTITUTION:
        config = { fn: '2x * e^(x^2)', x0: 1, order: 1, p1: 1, p2: 1 }; // u-sub classic
        break;

      // Unit 5 & 6 Applications
      case MathTopic.VOLUME_ROTATION:
        config = { fn: 'sqrt(x)', x0: 1, order: 1, p1: 10, p2: 1 };
        break;
      case MathTopic.DE_LOGISTIC:
        config = { fn: '1 / (1 + e^(-x))', x0: 0, order: 0, p1: 1, p2: 1 };
        break;

      // Unit 7 Series
      case MathTopic.TAYLOR_SERIES:
        config = { fn: 'sin(x)', x0: 0, order: 3, p1: 1, p2: 1 };
        break;
      case MathTopic.POWER_SERIES:
        config = { fn: '1 / (1 - x)', x0: 0, order: 5, p1: 1, p2: 1 };
        break;
        
      // Unit 8 Multi
      case MathTopic.LAGRANGE_MULTIPLIER:
        config = { fn: 'x^2 + y^2', x0: 1, order: 1, p1: 1, p2: 1 };
        break;
    }

    setVisualState(prev => ({
      ...prev,
      topic,
      functionString: config.fn,
      x0: config.x0,
      order: config.order,
      param1: config.p1,
      param2: config.p2,
    }));
  }, [topic]);

  const currentStep = TOPIC_CONTENT[topic]?.find(s => s.id === currentStepId) || { title: '未命名', explanation: '', goal: '', expression: '' } as any;

  return (
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden text-white selection:bg-blue-500/30 font-sans">
      <nav className="w-16 border-r border-white/5 flex flex-col items-center py-6 gap-6 bg-black z-50">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 cursor-pointer" onClick={() => handleTopicJump(MathTopic.LIMIT_DEFINITION)}>
          <span className="font-black text-xl italic">Σ</span>
        </div>
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar no-scrollbar w-full items-center">
          {UNITS.map(unit => (
            <button key={unit.id} onClick={() => setActiveUnitId(unit.id)}
              className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all group shrink-0 ${activeUnitId === unit.id ? 'bg-white/10 text-blue-400 border border-white/10 shadow-inner' : 'text-white/20 hover:text-white/60 hover:bg-white/5'}`}>
              <span className="text-[10px] font-black tracking-tighter">{unit.shortName}</span>
              <div className={`mt-1 h-0.5 rounded-full bg-blue-500 transition-all ${activeUnitId === unit.id ? 'w-4' : 'w-0'}`} />
            </button>
          ))}
        </div>
      </nav>

      <aside className={`transition-all duration-300 border-r border-white/5 flex flex-col h-full bg-[#0a0a0a] ${sidebarCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-[420px]'}`}>
        <div className="p-6 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-xs font-black text-white/20 uppercase tracking-[0.2em]">{activeUnit.name}</h2>
             <span className="text-[10px] text-blue-500/60 font-mono bg-blue-500/10 px-2 py-0.5 rounded tracking-tighter">U{activeUnit.id.replace('u', '')}</span>
          </div>
          <div className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
            {activeUnit.chapters.map(chapter => (
              <div key={chapter.id} className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 mb-1">
                   <div className="w-1 h-1 rounded-full bg-blue-500/40" />
                   {chapter.name}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {chapter.topics.map(t => (
                    <button key={t.id} onClick={() => setTopic(t.id)}
                      className={`px-3 py-2.5 rounded-xl text-[10px] font-bold text-left transition-all border leading-tight ${topic === t.id ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-white/[0.02] border-white/5 text-white/30 hover:border-white/20'}`}>
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-hidden px-8 py-6">
          <DerivationPanel topic={topic} currentStepId={currentStepId} onStepSelect={setCurrentStepId} onTopicJump={handleTopicJump} />
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full p-6 gap-6 overflow-hidden relative">
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-16 bg-white/5 border border-l-0 border-white/10 rounded-r-lg flex items-center justify-center group hover:bg-white/10 transition-all z-10">
          <div className={`w-1 h-4 bg-white/20 rounded-full group-hover:bg-blue-500 transition-all ${sidebarCollapsed ? 'translate-x-0.5' : ''}`} />
        </button>

        <header className="flex justify-between items-end shrink-0">
          <div className="space-y-1">
            <h2 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-white to-white/30 bg-clip-text text-transparent italic">
              {UNITS.flatMap(u => u.chapters).flatMap(c => c.topics).find(t => t.id === topic)?.name}
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase font-bold tracking-widest">
               <span className="text-blue-500">Intuition Architect</span>
               <span>/</span>
               <span>Visualizing: {currentStep.title}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          <div className="col-span-8 h-full flex flex-col min-h-0">
            <VisualPanel state={visualState} onStateChange={setVisualState} />
          </div>
          <div className="col-span-4 h-full flex flex-col min-h-0">
            <AIChatPanel currentStep={currentStep} visualState={visualState} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
