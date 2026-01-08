
import React, { useState, useEffect } from 'react';
import DerivationPanel from './components/DerivationPanel';
import VisualPanel from './components/VisualPanel';
import AIChatPanel from './components/AIChatPanel';
import { VisualState, MathTopic } from './types';
import { UNITS, TOPIC_CONTENT } from './constants';

const App: React.FC = () => {
  const [activeUnitId, setActiveUnitId] = useState(UNITS[2].id); 
  const [topic, setTopic] = useState(MathTopic.TAYLOR_SERIES);
  const [currentStepId, setCurrentStepId] = useState(TOPIC_CONTENT[MathTopic.TAYLOR_SERIES][0].id);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [visualState, setVisualState] = useState<VisualState>({
    topic: MathTopic.TAYLOR_SERIES,
    functionString: 'sin(x)',
    x0: 0,
    order: 2,
    param1: 10,
    zoom: 1
  });

  const activeUnit = UNITS.find(u => u.id === activeUnitId) || UNITS[0];

  // 处理跳转逻辑
  const handleTopicJump = (newTopicId: MathTopic) => {
    // 自动寻找所属单元
    const targetUnit = UNITS.find(u => u.chapters.some(c => c.topics.some(t => t.id === newTopicId)));
    if (targetUnit) setActiveUnitId(targetUnit.id);
    setTopic(newTopicId);
  };

  useEffect(() => {
    const defaultSteps = TOPIC_CONTENT[topic];
    setCurrentStepId(defaultSteps[0].id);
    
    let initialFn = 'sin(x)';
    if (topic === MathTopic.LHOPITAL_RULE) initialFn = 'sin(x)/x';
    if (topic === MathTopic.SQUEEZE_THEOREM) initialFn = 'x^2 * sin(1/x)';
    if (topic === MathTopic.INTEGRAL_BASIC) initialFn = 'x^2';

    setVisualState(prev => ({
      ...prev,
      topic,
      functionString: initialFn,
      order: topic === MathTopic.TAYLOR_SERIES ? 0 : 1, // 泰勒展开初始从0阶开始
      param1: topic === MathTopic.INTEGRAL_BASIC ? 10 : 1
    }));
  }, [topic]);

  // 同步推导步骤到视觉面板
  useEffect(() => {
    if (topic === MathTopic.TAYLOR_SERIES) {
      const stepIndex = TOPIC_CONTENT[topic].findIndex(s => s.id === currentStepId);
      // 映射步骤 ID 到阶数 (t-1 -> 0阶, t-2 -> 1阶, t-3 -> 2阶, t-4 -> 5阶演示)
      const orderMap: Record<string, number> = {
        't-0': 0, 't-1': 0, 't-2': 1, 't-3': 2, 't-4': 5, 't-5': 5
      };
      if (orderMap[currentStepId] !== undefined) {
        setVisualState(prev => ({ ...prev, order: orderMap[currentStepId] }));
      }
    }
  }, [currentStepId, topic]);

  const currentStep = TOPIC_CONTENT[topic].find(s => s.id === currentStepId) || TOPIC_CONTENT[topic][0];

  return (
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden text-white selection:bg-blue-500/30 font-sans">
      
      {/* 1. 导航轨 (Navigation Rail) */}
      <nav className="w-16 border-r border-white/5 flex flex-col items-center py-6 gap-6 bg-black z-50">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 cursor-pointer" onClick={() => handleTopicJump(MathTopic.TAYLOR_SERIES)}>
          <span className="font-black text-xl">Σ</span>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          {UNITS.map(unit => (
            <button 
              key={unit.id}
              onClick={() => setActiveUnitId(unit.id)}
              className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all group ${
                activeUnitId === unit.id 
                ? 'bg-white/10 text-blue-400 border border-white/10' 
                : 'text-white/20 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              <span className="text-[10px] font-black tracking-tighter">{unit.shortName}</span>
              <div className={`mt-1 h-0.5 rounded-full bg-blue-500 transition-all ${activeUnitId === unit.id ? 'w-4' : 'w-0'}`} />
            </button>
          ))}
        </div>
      </nav>

      {/* 2. 目录面板 + 推导故事线 (Explorer Panel) */}
      <aside className={`transition-all duration-300 border-r border-white/5 flex flex-col h-full bg-[#0a0a0a] ${sidebarCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-[420px]'}`}>
        
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-xs font-black text-white/20 uppercase tracking-[0.2em]">{activeUnit.name}</h2>
             <span className="text-[10px] text-blue-500/60 font-mono">U{activeUnit.id.replace('u', '')}</span>
          </div>
          <div className="space-y-4">
            {activeUnit.chapters.map(chapter => (
              <div key={chapter.id} className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 mb-2">
                   <div className="w-1 h-1 rounded-full bg-white/20" />
                   {chapter.name}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {chapter.topics.map(t => (
                    <button 
                      key={t.id}
                      onClick={() => setTopic(t.id)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold text-left transition-all border ${
                        topic === t.id 
                        ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                        : 'bg-white/[0.02] border-white/5 text-white/30 hover:border-white/20'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden px-8 py-6">
          <DerivationPanel 
            topic={topic}
            currentStepId={currentStepId} 
            onStepSelect={setCurrentStepId} 
            onTopicJump={handleTopicJump}
          />
        </div>
      </aside>

      {/* 3. 主操作区 */}
      <main className="flex-1 flex flex-col h-full p-6 gap-6 overflow-hidden relative">
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-16 bg-white/5 border border-l-0 border-white/10 rounded-r-lg flex items-center justify-center group hover:bg-white/10 transition-all z-10"
        >
          <div className={`w-1 h-4 bg-white/20 rounded-full group-hover:bg-blue-500 transition-all ${sidebarCollapsed ? 'translate-x-0.5' : ''}`} />
        </button>

        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-white to-white/30 bg-clip-text text-transparent italic">
              {UNITS.flatMap(u => u.chapters).flatMap(c => c.topics).find(t => t.id === topic)?.name}
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase font-bold tracking-widest">
               <span className="text-blue-500">Intuition Builder</span>
               <span>/</span>
               <span>Step Focus: {currentStep.title}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          <div className="col-span-8 h-full flex flex-col min-h-0">
            <VisualPanel 
              state={visualState} 
              onStateChange={setVisualState} 
            />
          </div>

          <div className="col-span-4 h-full flex flex-col min-h-0">
            <AIChatPanel 
              currentStep={currentStep} 
              visualState={visualState} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
