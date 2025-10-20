import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Image, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatWithDeepSeek } from '../api/deepseek';
import { SYSTEM_PROMPT } from '../config/systemPrompt';
import PortfolioGallery from '../components/PortfolioGallery';
import CalendlyWidget from '../components/CalendlyWidget';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m here to answer your questions about ProgressIT. Whether you\'re interested in blockchain development, casino platforms, mobile apps, or any of our services, I\'m here to help. What would you like to know?',
      showPortfolio: false,
      showCalendly: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [portfolioVisible, setPortfolioVisible] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, showPortfolio: false, showCalendly: false };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    // Check if user is asking for portfolio
    const portfolioKeywords = ['portfolio', 'портфолио', 'examples', 'примеры', 'projects', 'проекты', 'работы', 'works', 'showcase', 'gallery'];
    const shouldShowPortfolio = portfolioKeywords.some(keyword => 
      currentInput.toLowerCase().includes(keyword)
    );

    // Check if user wants to book a call
    const calendlyKeywords = ['call', 'звонок', 'встреча', 'meeting', 'book', 'забронировать', 'schedule', 'назначить', 'связаться', 'contact me', 'представитель', 'consultation', 'консультация', 'talk', 'discuss', 'поговорить', 'обсудить'];
    const shouldShowCalendly = calendlyKeywords.some(keyword => 
      currentInput.toLowerCase().includes(keyword)
    );

    try {
      // Prepare messages for DeepSeek API
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.slice(1).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: currentInput }
      ];

      const response = await chatWithDeepSeek(apiMessages);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response,
        showPortfolio: shouldShowPortfolio,
        showCalendly: shouldShowCalendly
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I\'m having trouble connecting right now. Please contact us directly:\n\n📞 Call: +37120531400\n✉️ Email: info@progressit.online\n🌐 Website: https://www.progressit.online',
        showPortfolio: false,
        showCalendly: false
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isExpanded = messages.length > 1;

  return (
    <div className={`min-h-screen bg-black text-white flex flex-col items-center p-4 transition-all duration-500 ${isExpanded ? 'pt-8' : 'justify-center'}`}>
      <div className={`w-full transition-all duration-500 ${isExpanded ? 'max-w-6xl' : 'max-w-3xl'}`}>
        {/* Header */}
        <div className={`text-center mb-8 transition-all duration-500 ${isExpanded ? 'mb-6' : 'mb-8'}`}>
          <h1 className={`font-bold mb-3 transition-all duration-500 ${isExpanded ? 'text-3xl' : 'text-5xl'}`}>ProgressIT</h1>
          <h2 className={`font-light mb-6 transition-all duration-500 ${isExpanded ? 'text-lg' : 'text-2xl'}`}>Your Vision, Infinite Possibilities</h2>
          {!isExpanded && (
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto">
              UK-based software development company with 15+ years of expertise in Blockchain, 
              Web3, Casino, Gaming, and Full-Stack Development. 500+ projects delivered worldwide.
            </p>
          )}
        </div>

        {/* Chat Interface */}
        <div className="w-full max-w-5xl mx-auto">
          {/* Messages Area - Improved */}
          {messages.length > 1 && (
            <div className={`mb-6 space-y-4 overflow-y-auto scrollbar-hide pr-2 transition-all duration-500 ${isExpanded ? 'max-h-[calc(100vh-280px)]' : 'max-h-96'}`} style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              {messages.slice(1).map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600">
                      <Bot size={18} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-xl px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gray-800 text-white border border-gray-600'
                        : 'bg-gray-900 text-white border border-gray-700'
                    }`}
                  >
                    <div className="text-sm prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                          li: ({node, ...props}) => <li className="text-gray-200" {...props} />,
                          a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                      
                      {/* Show portfolio gallery if requested */}
                      {message.showPortfolio && message.role === 'assistant' && (
                        <div className="mt-3">
                          <PortfolioGallery />
                        </div>
                      )}
                      
                      {/* Show Calendly widget if requested */}
                      {message.showCalendly && message.role === 'assistant' && (
                        <div className="mt-3">
                          <CalendlyWidget />
                        </div>
                      )}
                      
                      {/* Action buttons for easy access */}
                      {message.role === 'assistant' && index === messages.slice(1).length - 1 && (
                        <div className="mt-3 pt-3 border-t border-gray-700 flex gap-2 flex-wrap">
                          {!message.showPortfolio && (
                            <button
                              onClick={() => {
                                const newMessages = [...messages];
                                const msgIndex = messages.findIndex((m, i) => i === index + 1);
                                if (msgIndex !== -1) {
                                  newMessages[msgIndex] = { ...newMessages[msgIndex], showPortfolio: true };
                                  setMessages(newMessages);
                                }
                              }}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all border border-gray-600 text-xs font-medium"
                            >
                              <Image size={14} />
                              Show Portfolio
                            </button>
                          )}
                          
                          {!message.showCalendly && (
                            <button
                              onClick={() => {
                                const newMessages = [...messages];
                                const msgIndex = messages.findIndex((m, i) => i === index + 1);
                                if (msgIndex !== -1) {
                                  newMessages[msgIndex] = { ...newMessages[msgIndex], showCalendly: true };
                                  setMessages(newMessages);
                                }
                              }}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-black rounded-lg hover:bg-gray-200 transition-all border border-gray-300 text-xs font-medium"
                            >
                              <Calendar size={14} />
                              Book a Call
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center border border-gray-500">
                      <UserIcon size={18} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600">
                    <Bot size={18} className="text-white" />
                  </div>
                  <div className="bg-gray-900 text-white px-4 py-3 rounded-2xl border border-gray-700">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Area - Enhanced */}
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about ProgressIT's services, blockchain, casino, gaming..."
              className="w-full px-6 py-4 bg-gray-900 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-500 border border-gray-700"
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black p-3 rounded-full hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

