
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, DerivationStep, VisualState, MathTopic } from '../types';
import { sendMessageStream } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

interface AIChatPanelProps {
  topicId: MathTopic;
  currentStep: DerivationStep;
  visualState: VisualState;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({ topicId, currentStep, visualState }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;
    const userMessage: ChatMessage = { role: 'user', content: inputValue, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const visualContextStr = `Function: ${visualState.functionString}, x0: ${visualState.x0.toFixed(2)}, Param1: ${visualState.param1.toFixed(2)}`;
      const historyForAI = messages.map(msg => ({ role: msg.role, content: msg.content }));
      
      const stream = await sendMessageStream(inputValue, topicId, currentStep.title, visualContextStr, historyForAI);
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
      setMessages(prev => [...prev, { role: 'model', content: '推导扰动，请稍后。', timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-[#121212] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div>
          <h3 className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Intuition AI</h3>
          <p className="text-[8px] text-white/30 font-mono italic">Context: {currentStep.title}</p>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/5 border border-white/10 text-white/80'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-[10px] text-white/20 animate-pulse">Thinking...</div>}
      </div>
      <div className="p-4 bg-[#121212] border-t border-white/5">
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask about the visual logic..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500/50 outline-none" />
      </div>
    </div>
  );
};

export default AIChatPanel;
