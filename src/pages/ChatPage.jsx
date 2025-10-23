import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Bot, User as UserIcon, Image, Calendar, Facebook, Instagram, Twitter, MessageCircle, Youtube } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatWithDeepSeek } from '../api/deepseek';
import { generateSiteSystemPrompt } from '../utils/dynamicPrompt';
import PortfolioGallery from '../components/PortfolioGallery';
import CalendlyWidget from '../components/CalendlyWidget';
import { saveChat, generateChatId } from '../utils/chatStorage';
import { getDesignSettings, applyColorScheme } from '../utils/designStorage';
import ClientSitePage from './ClientSitePage';

export default function ChatPage({ siteData, embedded = false }) {
  console.log('🔍 ChatPage received siteData:', {
    id: siteData?.id,
    name: siteData?.name,
    companyName: siteData?.data?.hero?.companyName,
    fullStructure: siteData
  });
  
  const companyName = siteData?.data?.hero?.companyName || 'ProgressIT';
  const colorScheme = siteData?.design?.colorScheme || 'default';
  const services = siteData?.services || [];
  const currentSiteId = siteData?.id;
  
  console.log('📌 Using siteId:', currentSiteId, '| Company:', companyName);
  
  // Генерируем динамический промпт для этого сайта
  const systemPrompt = useMemo(() => {
    const prompt = generateSiteSystemPrompt(siteData?.data, services);
    console.log('🤖 Generated system prompt for:', companyName, '\n📝 Prompt preview:', prompt.substring(0, 300));
    return prompt;
  }, [siteData, services, companyName]);
  
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! Welcome to ${companyName}! 👋\n\nI'm here to help you learn about our services. To get started, may I ask your name? 😊\n\n*I can communicate in English, Russian, or your preferred language.*`,
      showPortfolio: false,
      showCalendly: false,
      hideButtons: true
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [portfolioVisible, setPortfolioVisible] = useState({});
  const [activeLanding, setActiveLanding] = useState(siteData?.design?.activeLanding || 'main');
  const messagesEndRef = useRef(null);
  const chatIdRef = useRef(generateChatId()); // Уникальный ID чата

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Применить цветовую схему при загрузке и при изменениях
  useEffect(() => {
    applyColorScheme(colorScheme);
  }, [colorScheme]);

  // Обновить данные при изменении siteData
  useEffect(() => {
    if (siteData?.design?.activeLanding) {
      setActiveLanding(siteData.design.activeLanding);
    }
    
    // Обновить приветственное сообщение с новым названием компании
    setMessages((prevMessages) => {
      if (prevMessages.length > 0 && prevMessages[0].role === 'assistant') {
        const updatedMessages = [...prevMessages];
        updatedMessages[0] = {
          ...updatedMessages[0],
          content: `Hello! Welcome to ${companyName}! 👋\n\nI'm here to help you learn about our services. To get started, may I ask your name? 😊\n\n*I can communicate in English, Russian, or your preferred language.*`
        };
        return updatedMessages;
      }
      return prevMessages;
    });
  }, [siteData, companyName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Автосохранение чата после каждого сообщения
  useEffect(() => {
    // Сохраняем только если есть хотя бы одно сообщение от пользователя
    const hasUserMessage = messages.some(msg => msg.role === 'user');
    if (!hasUserMessage) return;

    // Извлекаем имя пользователя из сообщений
    let userName = 'Анонимный';
    const userMessages = messages.filter(msg => msg.role === 'user');
    if (userMessages.length > 0) {
      // Ищем имя в первых сообщениях
      const firstMessage = userMessages[0].content;
      // Простая проверка на имя (можно улучшить)
      const words = firstMessage.split(' ');
      if (words.length <= 3 && !firstMessage.includes('?')) {
        userName = firstMessage.trim();
      }
    }

    // Извлекаем email если есть
    let email = null;
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    for (const msg of userMessages) {
      const match = msg.content.match(emailRegex);
      if (match) {
        email = match[0];
        break;
      }
    }

    // Сохраняем чат
    const chatInfo = {
      name: userName,
      email: email,
      source: 'main',
      siteId: currentSiteId // Добавляем ID сайта
    };
    console.log('💾 Saving chat for site:', currentSiteId, '| Site name:', companyName, '| Messages:', messages.length);
    saveChat(chatIdRef.current, messages, chatInfo);
  }, [messages, currentSiteId, companyName]);

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
      // Prepare messages for DeepSeek API - include ALL messages for context
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: currentInput }
      ];

      console.log('🤖 Sending to AI with company:', companyName, '| System prompt length:', systemPrompt.length);

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

  // Если выбран Client Site layout, показываем ClientSitePage
  if (activeLanding === 'client' && !embedded) {
    return <ClientSitePage />;
  }

  // Иначе показываем стандартный Main Landing layout
  return (
    <div className={`landing-theme ${embedded ? 'h-full' : 'h-screen'} bg-black text-white flex flex-col p-4 overflow-hidden` } style={{contain: 'layout'}}>
      {/* Верхняя часть - заголовок */}
      <div className={`text-center ${isExpanded ? 'mb-3' : 'mb-4'} z-10`}> 
        <h1 className={`font-bold ${isExpanded ? 'text-2xl mb-2' : 'text-3xl sm:text-4xl lg:text-5xl mb-3'}`}>
          {companyName}
        </h1>
        {!isExpanded && (
          <>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-light mb-3">
              {siteData?.data?.hero?.tagline || 'Your Vision, Infinite Possibilities'}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto px-2">
              {siteData?.data?.hero?.description || 'UK-based software development company with 15+ years of expertise in Blockchain, Web3, Casino, Gaming, and Full-Stack Development. 500+ projects delivered worldwide.'}
            </p>
          </>
        )}
      </div>

      {/* Убираем spacer полностью, чтобы ничто не перекрывало чат */}

      {/* Область сообщений */}
      {messages.length > 1 && (
        <div className="flex-1 overflow-y-auto mb-6 space-y-4 relative z-10" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              {messages.slice(1).map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-theme-primary rounded-full flex items-center justify-center">
                      <Bot size={18} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] sm:max-w-xl px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'message-bubble-user text-white border'
                        : 'message-bubble-assistant text-white border'
                    }`}
                  >
                    <div className="text-sm sm:text-base prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                          li: ({node, ...props}) => <li className="text-gray-200" {...props} />,
                          a: ({node, ...props}) => <a className="text-theme-primary hover:opacity-80 underline" target="_blank" rel="noopener noreferrer" {...props} />,
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
                      
                      {/* Action buttons - show only when logically appropriate */}
                      {message.role === 'assistant' && index === messages.slice(1).length - 1 && !message.hideButtons && (message.showPortfolio || message.showCalendly) && (
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
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all border border-gray-600 text-sm font-medium"
                            >
                              <Image size={16} />
                              Portfolio
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
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-theme-primary text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium"
                            >
                              <Calendar size={16} />
                              Book Call
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
                  <div className="flex-shrink-0 w-8 h-8 bg-theme-primary rounded-full flex items-center justify-center">
                    <Bot size={18} className="text-white" />
                  </div>
                  <div className="message-bubble-assistant text-white px-4 py-3 rounded-2xl border">
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

      {/* Input Area - всегда внизу перед иконками */}
      <div className="w-full max-w-3xl mx-auto mt-auto relative z-20">
        <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask about ${companyName}'s services...`}
              className="w-full px-4 py-3 pr-12 bg-gray-900 text-sm sm:text-base text-white rounded-full focus:outline-none focus:ring-2 ring-theme-primary placeholder-gray-500 border border-gray-700"
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-theme-primary text-white p-2.5 rounded-full hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
        </div>

        {/* Social Media Links - прямо под input */}
        <div className="flex justify-center items-center gap-5 mt-4 pb-2">
        <a
          href="https://facebook.com/progressit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-white transition-colors"
          aria-label="Facebook"
        >
          <Facebook size={18} />
        </a>
        <a
          href="https://instagram.com/progressit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-white transition-colors"
          aria-label="Instagram"
        >
          <Instagram size={18} />
        </a>
        <a
          href="https://twitter.com/progressit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-white transition-colors"
          aria-label="X (Twitter)"
        >
          <Twitter size={18} />
        </a>
        <a
          href="https://discord.gg/progressit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-white transition-colors"
          aria-label="Discord"
        >
          <MessageCircle size={18} />
        </a>
        <a
          href="https://youtube.com/@progressit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-white transition-colors"
          aria-label="YouTube"
        >
          <Youtube size={18} />
        </a>
        </div>
      </div>
    </div>
  );
}

