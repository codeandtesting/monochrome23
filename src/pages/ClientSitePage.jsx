import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User as UserIcon, X, Image as ImageIcon, Mic } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatWithDeepSeek } from '../api/deepseek';
import { SYSTEM_PROMPT } from '../config/systemPrompt';

export default function ClientSitePage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [showHero, setShowHero] = useState(true); // Показывать Hero до первого сообщения
  const messagesEndRef = useRef(null);

  // AI-генерируемый контент для левой части
  const contentVariants = [
    // О нас
    {
      type: 'about',
      content: (
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-4">О нас</h2>
          <p className="text-gray-400 mb-6">
            Мы специализируемся на профессиональном ремонте мебели с 2010 года.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">✓</span>
              <span>Быстрые сроки 1-3 дня</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">✓</span>
              <span>Гарантия 12 месяцев</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">✓</span>
              <span>500+ довольных клиентов</span>
            </div>
          </div>
        </div>
      )
    },
    // Портфолио
    {
      type: 'portfolio',
      content: (
        <div className="max-w-md">
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              <img src="/portfolio/1a.jpg" alt="Work 1" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              <img src="/portfolio/2a.jpg" alt="Work 2" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              <img src="/portfolio/3a.jpg" alt="Work 3" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              <img src="/portfolio/4a.jpg" alt="Work 4" className="w-full h-full object-cover" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3">Наше портфолио</h2>
          <p className="text-gray-400">Примеры наших работ по ремонту кожаной мебели</p>
        </div>
      )
    },
    // Услуги
    {
      type: 'services',
      content: (
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-6">Наши услуги</h2>
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Ремонт царапин</h3>
              <p className="text-gray-400 text-sm">Устранение царапин и потертостей на кожаной мебели</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Реставрация обивки</h3>
              <p className="text-gray-400 text-sm">Полная замена и восстановление обивки</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Замена наполнителя</h3>
              <p className="text-gray-400 text-sm">Обновление внутреннего наполнителя мебели</p>
            </div>
          </div>
        </div>
      )
    },
    // Преимущества
    {
      type: 'benefits',
      content: (
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-6">Почему выбирают нас</h2>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-5xl mb-3">⚡</div>
              <p className="text-2xl font-bold mb-1">1-3</p>
              <p className="text-gray-400 text-sm">дня</p>
            </div>
            <div>
              <div className="text-5xl mb-3">🛡️</div>
              <p className="text-2xl font-bold mb-1">12</p>
              <p className="text-gray-400 text-sm">месяцев гарантии</p>
            </div>
            <div>
              <div className="text-5xl mb-3">⭐</div>
              <p className="text-2xl font-bold mb-1">500+</p>
              <p className="text-gray-400 text-sm">клиентов</p>
            </div>
          </div>
        </div>
      )
    },
    // Отзывы
    {
      type: 'testimonials',
      content: (
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-6">Отзывы клиентов</h2>
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center font-bold">
                  И
                </div>
                <div>
                  <p className="font-semibold">Иван П.</p>
                  <div className="text-yellow-400 text-sm">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Отличная работа! Диван как новый. Спасибо за профессионализм.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center font-bold">
                  М
                </div>
                <div>
                  <p className="font-semibold">Мария К.</p>
                  <div className="text-yellow-400 text-sm">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Быстро и качественно. Рекомендую всем!
              </p>
            </div>
          </div>
        </div>
      )
    },
    // Контакты
    {
      type: 'contacts',
      content: (
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-6">Свяжитесь с нами</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                📞
              </div>
              <div>
                <p className="text-gray-400 text-sm">Телефон</p>
                <p className="font-semibold">+7 999 123-45-67</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                📧
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="font-semibold">info@company.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                📍
              </div>
              <div>
                <p className="text-gray-400 text-sm">Адрес</p>
                <p className="font-semibold">Москва, ул. Примерная, 123</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Автоматическая смена контента каждые 5 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentContentIndex((prev) => (prev + 1) % 6);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Скрыть Hero при первом сообщении
    if (showHero) {
      setShowHero(false);
    }

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Prepare messages for DeepSeek API
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: currentInput }
      ];

      const response = await chatWithDeepSeek(apiMessages);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I\'m having trouble connecting right now. Please contact us directly:\n\n📞 Call: +37120531400\n✉️ Email: info@progressit.online\n🌐 Website: https://www.progressit.online'
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Content - Split Layout */}
      <div className="h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT - Auto-generated Content */}
        <div className="p-8 lg:p-12 flex items-center justify-center bg-black relative overflow-hidden">
          {/* Animated content transitions */}
          <div className="relative w-full flex items-center justify-center min-h-[400px]">
            {contentVariants.map((variant, index) => (
              <div
                key={variant.type}
                className={`absolute transition-all duration-500 ${
                  index === currentContentIndex
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                {variant.content}
              </div>
            ))}
          </div>

          {/* Indicator dots - subtle */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {contentVariants.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentContentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentContentIndex
                    ? 'bg-white w-6'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT - AI Chat */}
        <div className="border-l border-gray-800 flex flex-col bg-black h-screen overflow-hidden">
          {/* Hero Screen или Messages */}
          {showHero ? (
            // Hero Screen - показывается до первого сообщения
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black overflow-hidden">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 text-center">
                ProgressIT
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 mb-8 text-center">
                Your Vision, Infinite Possibilities
              </p>
              <p className="text-sm lg:text-base text-gray-400 text-center max-w-3xl leading-relaxed">
                UK-based software development company with 15+ years of expertise in Blockchain, Web3, Casino, Gaming,
                <br />and Full-Stack Development. 500+ projects delivered worldwide.
              </p>
            </div>
          ) : (
            // Messages - показывается после первого сообщения
            <div className="flex-1 p-4 lg:p-6 space-y-4 overflow-y-auto bg-black scrollbar-hide"
                 style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-900 text-white border border-gray-800'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="text-sm prose prose-invert max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon size={20} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  AI
                </div>
                <div className="bg-gray-900 text-white rounded-lg p-4 border border-gray-800">
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

          {/* Input Area - Fixed at bottom */}
          <div className="p-4 lg:p-6 bg-black border-t border-gray-800 flex-shrink-0">
            {/* Input */}
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
    </div>
  );
}

