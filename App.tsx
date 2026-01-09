
import React, { useState, useEffect } from 'react';
import DerivationPanel from './components/DerivationPanel';
import VisualPanel from './components/VisualPanel';
import AIChatPanel from './components/AIChatPanel';
import { VisualState, MathTopic, DerivationStep } from './types';
import { UNITS, TOPIC_REGISTRY } from './constants';

const App: React.FC = () => {
  const [activeUnitId, setActiveUnitId] = useState(UNITS[0].id); 
  const [topicId, setTopicId] = useState<MathTopic>(MathTopic.LIMIT_DEFINITION);
  const [currentStepId, setCurrentStepId] = useState('');
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
  const currentManifest = TOPIC_REGISTRY[topicId];

  useEffect(() => {
    if (currentManifest) {
      setVisualState(prev => ({
        ...prev,
        ...currentManifest.initialVisualState,
        topic: topicId
      }));
      if (currentManifest.steps.length > 0) {
        setCurrentStepId(currentManifest.steps[0].id);
      }
    }
  }, [topicId]);

  const handleStepSelect = (stepId: string) => {
    setCurrentStepId(stepId);
    const step = currentManifest?.steps.find(s => s.id === stepId);
    if (step?.visualHint) {
      setVisualState(prev => ({
        ...prev,
        ...step.visualHint
      }));
    }
  };

  const handleTopicJump = (newTopicId: MathTopic) => {
    const targetUnit = UNITS.find(u => u.chapters.some(c => c.topics.some(t => t.id === newTopicId)));
    if (targetUnit) setActiveUnitId(targetUnit.id);
    setTopicId(newTopicId);
  };

  const currentStep = currentManifest?.steps.find(s => s.id === currentStepId) || 
    { title: '未开始', explanation: '请选择一个推导步骤...', goal: '', expression: '' } as DerivationStep;

  return (
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden text-white font-sans selection:bg-blue-500/30">
      {/* 侧边导航栏 */}
      <nav className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-8 bg-black z-50 shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] mb-4 cursor-pointer hover:scale-105 transition-transform" onClick={() => handleTopicJump(MathTopic.LIMIT_DEFINITION)}>
          <span className="font-black text-2xl italic">Σ</span>
        </div>
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar no-scrollbar w-full items-center">
          {UNITS.map(unit => (
            <button key={unit.id} onClick={() => setActiveUnitId(unit.id)}
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all group shrink-0 relative ${activeUnitId === unit.id ? 'bg-white/10 text-blue-400 border border-white/10' : 'text-white/20 hover:text-white/60'}`}>
              <span className="text-[10px] font-black tracking-tighter uppercase">{unit.shortName}</span>
              {activeUnitId === unit.id && <div className="absolute right-0 w-1 h-6 bg-blue-500 rounded-l-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
            </button>
          ))}
        </div>
      </nav>

      {/* 章节目录与推导面板 */}
      <aside className={`transition-all duration-500 border-r border-white/5 flex flex-col h-full bg-[#0a0a0a] overflow-hidden ${sidebarCollapsed ? 'w-0 opacity-0' : 'w-[440px]'}`}>
        <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent shrink-0">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{activeUnit.name}</h2>
          </div>
          <div className="space-y-6 max-h-[35vh] overflow-y-auto custom-scrollbar pr-3">
            {activeUnit.chapters.map(chapter => (
              <div key={chapter.id} className="space-y-3">
                <div className="text-[9px] font-black text-blue-500/50 uppercase tracking-widest flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-blue-500" />
                   {chapter.name}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {chapter.topics.map(t => (
                    <button key={t.id} onClick={() => setTopicId(t.id)}
                      className={`px-4 py-3 rounded-xl text-[11px] font-bold text-left transition-all border leading-tight ${topicId === t.id ? 'bg-blue-500/10 border-blue-500/40 text-blue-400 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]' : 'bg-white/[0.02] border-white/5 text-white/30 hover:border-white/20'}`}>
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <DerivationPanel topic={topicId} currentStepId={currentStepId} onStepSelect={handleStepSelect} onTopicJump={handleTopicJump} />
        </div>
      </aside>

      {/* 主画布与 AI 面板 */}
      <main className="flex-1 flex flex-col h-full p-8 gap-8 overflow-hidden relative min-w-0">
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-24 bg-white/5 border border-l-0 border-white/10 rounded-r-2xl flex items-center justify-center group z-10 hover:bg-white/10 transition-colors">
          <div className={`w-1 h-6 bg-white/10 rounded-full group-hover:bg-blue-500 transition-all ${sidebarCollapsed ? 'translate-x-0.5' : ''}`} />
        </button>

        <header className="flex justify-between items-end shrink-0">
          <div className="space-y-2">
            <h2 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent italic truncate max-w-3xl drop-shadow-2xl">{currentManifest?.name}</h2>
            <div className="flex items-center gap-3 text-[10px] text-white/20 uppercase font-black tracking-[0.2em]">
               <span className="text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">Intuition System</span>
               <span className="text-white/10">|</span>
               <span className="truncate">Active Trace: {currentStep.title}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-12 gap-8 min-h-0">
          <div className="col-span-8 h-full flex flex-col min-h-0 group">
            <VisualPanel state={visualState} onStateChange={setVisualState} />
          </div>
          <div className="col-span-4 h-full flex flex-col min-h-0">
            <AIChatPanel topicId={topicId} currentStep={currentStep} visualState={visualState} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
