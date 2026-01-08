
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
    <div className="h-full flex flex-col gap-6 overflow-y-auto pr-3 custom-scrollbar">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent italic">推导故事线</h2>
          <span className="text-[9px] text-blue-500 font-black tracking-widest border border-blue-500/30 px-2 py-0.5 rounded uppercase">{topic.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="relative space-y-8 mt-4">
        <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-blue-500/30 via-white/5 to-transparent z-0" />

        {steps.map((step) => {
          const isActive = currentStepId === step.id;
          return (
            <div 
              key={step.id}
              onClick={() => onStepSelect(step.id)}
              className={`group relative pl-14 transition-all duration-500 cursor-pointer ${
                isActive ? 'opacity-100' : 'opacity-40 hover:opacity-80'
              }`}
            >
              <div className={`absolute left-4 top-1 w-4 h-4 rounded-full border-2 z-10 transition-all duration-500 ${
                isActive ? 'bg-blue-500 border-white scale-125 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-[#0d0d0d] border-white/20'
              }`} />

              <div className={`p-5 rounded-2xl border transition-all duration-500 ${
                isActive ? 'bg-white/[0.05] border-white/10 shadow-2xl scale-[1.02]' : 'bg-transparent border-transparent'
              }`}>
                <h3 className={`text-sm font-black ${isActive ? 'text-blue-400' : 'text-white/70'}`}>{step.title}</h3>
                
                {isActive && step.prerequisites && (
                  <div className="flex flex-wrap gap-2 my-3">
                    {step.prerequisites.map(p => (
                      <button 
                        key={p.name} 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (p.topicId && onTopicJump) onTopicJump(p.topicId);
                        }}
                        className="text-[9px] bg-blue-500/10 text-blue-400/80 px-2 py-1 rounded border border-blue-500/20 hover:bg-blue-500/20 transition-all flex items-center gap-1.5"
                      >
                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                        前情提要: {p.name}
                      </button>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-white/40 mb-4 leading-relaxed italic">{step.goal}</p>
                
                <div className={`p-4 rounded-xl border math-font text-xs transition-all ${
                  isActive ? 'bg-black border-blue-500/30 text-blue-200' : 'bg-white/5 border-white/5 text-white/20'
                }`}>
                  {step.expression}
                </div>

                {isActive && (
                  <div className="mt-5 animate-in fade-in slide-in-from-top-2 duration-500 border-l-2 border-white/5 pl-4">
                    <p className="text-xs leading-relaxed text-white/60 font-light text-justify">{step.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DerivationPanel;
