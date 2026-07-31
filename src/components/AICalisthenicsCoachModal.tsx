import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, Flame, Dumbbell, Zap } from 'lucide-react';
import { UserProfile } from '../types';
import { generateCoachResponse } from '../services/aiEngine';
import { soundEngine } from '../services/soundEngine';

interface AICalisthenicsCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

interface Message {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  time: string;
}

export const AICalisthenicsCoachModal: React.FC<AICalisthenicsCoachModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'coach',
      text: `OSS ${user.name}! I am your AI Calisthenics Sensei. Ask me anything about form cues, wrist mobility, muscle-up transitions, or nutrition for your ${user.targetPhysique} goal!`,
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    soundEngine.playTick();
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      soundEngine.playSetCompleteChime();
      const replyText = generateCoachResponse(text, user);
      const coachMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'coach',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, coachMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleQuickChip = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fade-up">
      <div className="w-full max-w-sm h-[90vh] max-h-[620px] bg-[#0f1420]/95 border border-orange-500/40 rounded-[32px] flex flex-col justify-between overflow-hidden shadow-2xl relative text-white">
        
        {/* MODAL HEADER */}
        <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md border border-white/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <h2 className="text-[15px] font-extrabold leading-tight">AI Calisthenics Sensei</h2>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[9.5px] text-orange-400 font-semibold">LLM Master Trainer Active</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full liquid-glass flex items-center justify-center text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MESSAGES VIEWPORT */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar min-h-0">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white'
                    : 'bg-white/10 text-orange-400 border border-orange-500/30'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[80%] rounded-[20px] p-3 text-[12px] leading-relaxed font-medium ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md rounded-tr-none'
                    : 'liquid-glass text-white/90 border border-white/10 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className="text-[8.5px] text-white/50 block text-right mt-1 font-mono">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-white/10 text-orange-400 border border-orange-500/30 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="liquid-glass px-3 py-2 rounded-[18px] text-[11px] text-orange-400 flex items-center space-x-1.5 animate-pulse">
                <span>Sensei is thinking...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* QUICK ACTION PROMPT CHIPS */}
        <div className="px-3 py-1.5 border-t border-white/10 overflow-x-auto no-scrollbar flex items-center space-x-1.5 shrink-0">
          <button
            onClick={() => handleQuickChip('How do I fix wrist pain during Pike Push-Ups?')}
            className="liquid-glass px-2.5 py-1 rounded-full text-[9.5px] font-semibold text-orange-400 border border-orange-500/30 hover:border-orange-500/60 shrink-0 flex items-center space-x-1"
          >
            <Zap className="w-3 h-3" />
            <span>Wrist Pain Fix</span>
          </button>

          <button
            onClick={() => handleQuickChip('What should I eat for my 78kg target physique?')}
            className="liquid-glass px-2.5 py-1 rounded-full text-[9.5px] font-semibold text-amber-400 border border-amber-500/30 hover:border-amber-500/60 shrink-0 flex items-center space-x-1"
          >
            <Flame className="w-3 h-3" />
            <span>78kg Diet Baseline</span>
          </button>

          <button
            onClick={() => handleQuickChip('How to unlock the Muscle-Up transition?')}
            className="liquid-glass px-2.5 py-1 rounded-full text-[9.5px] font-semibold text-white/90 border border-white/20 hover:border-white/40 shrink-0 flex items-center space-x-1"
          >
            <Dumbbell className="w-3 h-3" />
            <span>Muscle-Up Transition</span>
          </button>
        </div>

        {/* INPUT BAR */}
        <div className="p-3 border-t border-white/10 bg-black/50 backdrop-blur-md shrink-0">
          <div className="liquid-glass rounded-full flex items-center px-3 py-1.5 border border-white/15">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask Sensei about calisthenics form or diet..."
              className="flex-1 bg-transparent text-white text-[12px] outline-none placeholder:text-white/40"
            />
            <button
              onClick={() => handleSendMessage()}
              className="w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-transform ml-1"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
