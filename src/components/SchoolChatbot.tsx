'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, X, Send, Sparkles, RotateCcw, MessageSquare, 
  HelpCircle, ChevronDown, User, Lightbulb 
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const INITIAL_SUGGESTIONS = [
  '🍱 오늘의 급식 영양 팁 알려줘',
  '📚 시험 기간 효과적인 집중 공부법',
  '🎒 분실물 찾으려면 어떻게 해야 해?',
  '💬 친구와 더 친해지는 대화 꿀팁',
  '🎪 학교 축제 부스 준비 아이디어 추천',
];

interface SchoolChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const SchoolChatbot: React.FC<SchoolChatbotProps> = ({
  isOpen,
  onClose,
  onOpen,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `반가워요! 👋 저는 **학교 대화 사이트 AI 도우미 '빛솔이'**예요! ✨\n\n학교 생활, 공부/과제 질문, 교우 관계, 학교 소통 등 궁금한 점이 있다면 무엇이든 편하게 물어보세요!`,
      timestamp: '방금',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyPayload }),
      });

      const data = await res.json();
      const botReply = data.reply || data.error || '답변을 불러오지 못했습니다.';

      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        role: 'assistant',
        content: botReply,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot_err_' + Date.now(),
          role: 'assistant',
          content: '⚠️ 죄송합니다. 네트워크 통신 오류가 발생했습니다. 잠시 후 다시 질문해 주세요.',
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome_' + Date.now(),
        role: 'assistant',
        content: `대화가 초기화되었습니다! ✨\n새롭게 궁금한 학교 생활이나 공부 질문을 입력해 주세요!`,
        timestamp: '방금',
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={onOpen}
          aria-label="AI 챗봇 열기"
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full clay-btn bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900 animate-ping"></span>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-black tracking-wide flex items-center gap-1">
              <span>AI 도우미</span>
              <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
            </div>
            <div className="text-[10px] text-white/80 font-medium">질문하면 답변해요</div>
          </div>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] max-h-[85vh] flex flex-col clay-card glass-panel border border-white/60 dark:border-white/15 shadow-2xl rounded-3xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl shadow-inner border border-white/30">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black tracking-tight">AI 학교 도우미 '빛솔이'</h3>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-400 text-emerald-950">
                    ON
                  </span>
                </div>
                <p className="text-[10px] text-white/80 flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  ChatGPT API 연동 실시간 답변
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleResetChat}
                title="대화 지우기"
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                title="닫기"
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-900/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[85%] ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gradient-to-tr from-purple-500 to-indigo-500 text-white'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'clay-btn bg-indigo-600 text-white rounded-tr-none shadow-md'
                        : 'clay-card bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/70 dark:border-slate-700 shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 dark:text-slate-500 px-9 mt-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-xl bg-purple-500 text-white flex items-center justify-center shrink-0 text-xs shadow-sm">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 rounded-2xl clay-card bg-white dark:bg-slate-800 rounded-tl-none border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-[11px] text-slate-400 font-bold ml-1">빛솔이가 생각 중...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips (when message count is low) */}
          {messages.length <= 3 && !loading && (
            <div className="p-2.5 bg-indigo-50/70 dark:bg-slate-800/60 border-t border-indigo-100/60 dark:border-slate-800 shrink-0">
              <div className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1 mb-1.5 px-1">
                <Lightbulb className="w-3 h-3 text-amber-500 fill-amber-400" />
                자주 묻는 질문 탭:
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {INITIAL_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sug)}
                    className="text-[11px] text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-600 px-2.5 py-1 rounded-xl clay-badge border border-slate-200/80 dark:border-slate-600 text-left transition"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200/80 dark:border-slate-700 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="학교 생활이나 공부, 무엇이든 질문하세요..."
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 text-xs clay-input text-slate-800 dark:text-white rounded-xl focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="clay-btn p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-md transition flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="text-[10px] text-slate-400 text-center mt-1.5">
              Powered by ChatGPT API (CHATGPT_API)
            </div>
          </div>
        </div>
      )}
    </>
  );
};
