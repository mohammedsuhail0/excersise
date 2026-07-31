import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, Flame, Dumbbell, Zap } from 'lucide-react';
import { UserProfile } from '../types';
import { callMultiProviderLLMCoachAPI } from '../services/aiEngine';
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Dynamic Welcome Greeting Based on Logged-in User
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'coach',
          text: `OSS ${user.name.toUpperCase()}! 🥋 I am your AI Calisthenics Coach. Ask me ANY question about workouts, form cues, or diet!`,
          time: 'Just now',
        },
      ]);
    }
  }, [isOpen, user.name, messages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
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

    try {
      const coachReply = await callMultiProviderLLMCoachAPI(text.trim(), {
        name: user.name,
        weightKg: user.weightKg,
        heightCm: user.heightCm,
        targetPhysique: user.targetPhysique,
      });

      soundEngine.playSetCompleteChime();
      const coachMsg: Message = {
        id: `reply-${Date.now()}`,
        sender: 'coach',
        text: coachReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      const fallbackMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'coach',
        text: `OSS ${user.name}! Push through today's session. Keep your core tight and maintain clean form! 💪`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    '🥗 High Protein Meal Plan',
    '💪 Muscle-Up Progression',
    '🔥 Form Check: Decline Push-Ups',
    '⚡ 5-Minute Abs Blast',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fade-up">
      <div className="w-full max-w-sm h-[90vh] max-h-[620px] bg-[#0f1420]/95 border border-white/15 rounded-[32px] p-4 flex flex-col justify-between shadow-2xl relative text-white">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md">
              <Bot className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-[15px] font-extrabold leading-tight flex items-center gap-1">
                Sensei AI Coach <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              </h2>
              <p className="text-[10px] text-orange-400 font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3 text-orange-400" /> Groq 50ms Sub-Second Response
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full liquid-glass flex items-center justify-center text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CHAT MESSAGES STREAM */}
        <div className="flex-1 overflow-y-auto my-2 space-y-3 pr-1 no-scrollbar text-[12px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-black'
                    : 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white'
                }`}
              >
                {msg.sender === 'user' ? user.name.charAt(0).toUpperCase() : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] rounded-[20px] p-3 leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-tr-none shadow-md'
                    : 'liquid-glass border border-white/10 text-white/90 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <span className="text-[9px] text-white/40 block text-right mt-1 font-mono">{msg.time}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-white/60 text-[11px] font-semibold animate-pulse">
              <Bot className="w-4 h-4 text-orange-400" />
              <span>Sensei AI is analyzing form & macros...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* QUICK PROMPT CHIPS */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1 shrink-0">
          {quickPrompts.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSendMessage(chip)}
              className="liquid-glass hover:border-orange-500/50 px-2.5 py-1 rounded-full text-[10px] font-bold text-orange-400 shrink-0 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* CHAT INPUT BAR */}
        <div className="pt-2 border-t border-white/10 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder={`Ask Sensei AI, ${user.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-full py-2.5 px-4 text-[12px] text-white placeholder-white/40 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center disabled:opacity-40 transition-all shrink-0 hover:scale-105 active:scale-95 shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
