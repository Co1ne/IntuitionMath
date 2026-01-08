
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, DerivationStep, VisualState } from '../types';
import { sendMessageStream } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

interface AIChatPanelProps {
  currentStep: DerivationStep;
  visualState: VisualState;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({ currentStep, visualState }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const visualContextStr = `Function: sin(x), x0: ${visualState.x0.toFixed(2)}, Order: ${visualState.order}`;
      const stepContextStr = `Current Step: ${currentStep.title}, Expression: ${currentStep.expression}, Logic: ${currentStep.explanation}`;
      
      const stream = await sendMessageStream(inputValue, stepContextStr, visualContextStr);
      
      let assistantMessageContent = '';
      setMessages(prev => [...prev, { role: 'model', content: '', timestamp: Date.now() }]);

      for await (const chunk of stream) {
        const text = (chunk as GenerateContentResponse).text;
        if (text) {
          assistantMessageContent += text;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            return [...prev.slice(0, -1), { ...last, content: assistantMessageContent }];
          });
        }
      }
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: '抱歉，目前的公式推导出现了一点扰动，请稍后尝试。', timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5">
      <div className="p-5 border-b border-white/5 bg-[#121212] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#121212] rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white/80 uppercase tracking-widest">Intuition AI</h3>
            <p className="text-[9px] text-white/30 font-mono italic">Context Locked: {currentStep.title}</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center opacity-20">
               <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 9h8m-8 4h6m4-9a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h14Z" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-white/40 leading-relaxed">
                我是你的数学建筑导师。<br/>目前的对话焦点被锁定在 <span className="text-blue-400 font-bold">{currentStep.title}</span>。
              </p>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {['为什么有 ½ ?', '几何意义是什么?', '怎么推导的?'].map(q => (
                  <button 
                    key={q}
                    onClick={() => { setInputValue(q); }}
                    className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/40 hover:text-white/60 hover:bg-white/10 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none shadow-[0_4px_15px_rgba(37,99,235,0.3)]' 
                : 'bg-white/[0.05] text-white/90 border border-white/10 rounded-bl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#121212] border-t border-white/5">
        <div className="relative group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="针对此步骤的逻辑发问..."
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-white/10"
          />
          <button 
            onClick={handleSend}
            disabled={isTyping || !inputValue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-blue-400 transition-colors disabled:opacity-0"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14m-7-7 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPanel;
