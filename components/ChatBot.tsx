import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { streamChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { translations } from '../translations';

interface ChatBotProps {
  language: 'English' | 'Hindi' | 'French' | 'Spanish';
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialMessageContext?: string | null;
}

const ChatBot: React.FC<ChatBotProps> = ({ language, isOpen, setIsOpen, initialMessageContext }) => {
  const t = translations[language];
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: t.chatWelcome }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Handle external triggers (like clicking "Chat with Agent" in sidebar)
  useEffect(() => {
    if (initialMessageContext && isOpen) {
       // Only add if it's not the last message to prevent loops if state isn't cleared immediately
       const lastMsg = messages[messages.length - 1];
       if (lastMsg.text !== initialMessageContext) {
           setInputValue(initialMessageContext);
       }
    }
  }, [initialMessageContext, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    // Convert internal message format to Gemini history format
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      setMessages(prev => [...prev, { role: 'model', text: '' }]); // Placeholder for streaming
      
      const stream = streamChat(userMessage, history, language);
      let fullResponse = '';

      for await (const chunk of stream) {
        if (chunk) {
          fullResponse += chunk;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = fullResponse;
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.', isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-300 z-50 ${
          isOpen ? 'bg-red-400 rotate-90' : 'bg-violet-400 hover:bg-violet-500'
        }`}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200 animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-violet-400 p-4 flex items-center gap-2 text-white shadow-md">
            <Bot className="w-5 h-5" />
            <h3 className="font-bold">{t.chatHeader}</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-violet-400 text-white rounded-br-none'
                      : msg.isError
                      ? 'bg-red-100 text-red-700 rounded-bl-none'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-400 p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 text-sm">
                  {t.chatThinking}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.chatPlaceholder}
              className="flex-1 p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-300 outline-none text-sm"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-2 bg-violet-400 text-white rounded-xl hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;