
import React from 'react';
import { DerivationStep, MathTopic } from '../types';
import { TOPIC_CONTENT } from '../constants';

interface DerivationPanelProps {
  topic: MathTopic;
  currentStepId: string;
  onStepSelect: (id: string) => void;
  onTopicJump?: (topicId: MathTopic) => void;
}

const DerivationPanel: React.FC<DerivationPanelProps> = ({ topic, currentStepId, onStepSelect, onTopicJump }) => {
  const steps = TOPIC_CONTENT[topic] || [];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Header section (Non-scrolling) */}
      <div className="px-6 py-4 border-b border-white/5 bg-[#0d0d0d]/50">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-white uppercase tracking-widest italic">推导故事线</h2>
          <span className="text-[9px] text-blue-500 font-black tracking-widest border border-blue-500/30 px-2 py-0.5 rounded uppercase">
            {topic.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Scrolling container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
        <div className="relative space-y-6 pb-20">
          {/* Vertical path line */}
          <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-blue-500/30 via-white/5 to-transparent z-0" />

          {steps.map((step) => {
            const isActive = currentStepId === step.id;
            return (
              <div 
                key={step.id}
                onClick={() => onStepSelect(step.id)}
                className={`group relative pl-12 transition-all duration-500 cursor-pointer ${
                  isActive ? 'opacity-100' : 'opacity-40 hover:opacity-80'
                }`}
              >
                {/* Connector Point */}
                <div className={`absolute left-4 top-2 w-4 h-4 rounded-full border-2 z-10 transition-all duration-500 ${
                  isActive ? 'bg-blue-500 border-white scale-110 shadow-[0_0_12px_rgba(59,130,246,0.4)]' : 'bg-[#0a0a0a] border-white/10'
                }`} />

                {/* Step Card */}
                <div className={`p-4 rounded-xl border transition-all duration-500 ${
                  isActive ? 'bg-white/[0.04] border-white/10 shadow-xl' : 'bg-transparent border-transparent'
                }`}>
                  <h3 className={`text-xs font-black uppercase tracking-wide ${isActive ? 'text-blue-400' : 'text-white/60'}`}>
                    {step.title}
                  </h3>
                  
                  <p className="text-[11px] text-white/30 mt-1 mb-3 leading-snug italic line-clamp-2">
                    {step.goal}
                  </p>

                  <div className={`p-3 rounded-lg border math-font text-[11px] transition-all break-all ${
                    isActive ? 'bg-black/60 border-blue-500/30 text-blue-100' : 'bg-white/5 border-white/5 text-white/10'
                  }`}>
                    {step.expression}
                  </div>

                  {isActive && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-1 duration-300 border-l border-white/10 pl-3">
                      <p className="text-[11px] leading-relaxed text-white/60 font-light">
                        {step.explanation}
                      </p>
                      
                      {step.prerequisites && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {step.prerequisites.map(p => (
                            <button 
                              key={p.name} 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (p.topicId && onTopicJump) onTopicJump(p.topicId);
                              }}
                              className="text-[9px] bg-blue-500/10 text-blue-400/80 px-1.5 py-0.5 rounded border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                            >
                              提要: {p.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DerivationPanel;
