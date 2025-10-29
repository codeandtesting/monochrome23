import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, User as UserIcon, Trash2, Copy, CheckCircle, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getChat, deleteChat } from '../../utils/chatStorage';

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadChat();
  }, [id]);

  const loadChat = () => {
    const chatData = getChat(id);
    if (!chatData) {
      // Если чат не найден, вернуться на страницу запросов
      navigate('/dashboard/requests');
      return;
    }
    setChat(chatData);
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить этот чат?')) {
      deleteChat(id);
      navigate('/dashboard/requests');
    }
  };

  const handleCopyChat = () => {
    if (!chat) return;

    // Форматируем чат для копирования
    const chatText = chat.messages.map(msg => {
      const role = msg.role === 'user' ? 'Пользователь' : 'AI';
      return `${role}: ${msg.content}`;
    }).join('\n\n');

    navigator.clipboard.writeText(chatText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    if (!chat) return;

    const dataStr = JSON.stringify(chat, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat_${chat.id}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/requests')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold mb-1">
              {chat.userInfo.name || 'Анонимный пользователь'}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>{chat.userInfo.email || 'Email не указан'}</span>
              <span>•</span>
              <span>{chat.source === 'client' ? '🌐 Client Site (/2)' : '💬 Main Chat (/)'}</span>
              <span>•</span>
              <span>{new Date(chat.createdAt).toLocaleString('ru-RU')}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopyChat}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors flex-1 sm:flex-initial"
          >
            {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
            {copied ? 'Скопировано' : 'Копировать'}
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors flex-1 sm:flex-initial"
          >
            <Download size={18} />
            JSON
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 bg-opacity-20 text-red-400 border border-red-500 border-opacity-30 rounded-lg hover:bg-opacity-30 transition-colors w-full sm:w-auto"
          >
            <Trash2 size={18} />
            Удалить
          </button>
        </div>
      </div>

      {/* Chat Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Статус</p>
          <p className={`font-medium ${
            chat.status === 'booking' ? 'text-blue-400' :
            chat.status === 'lead' ? 'text-green-400' :
            'text-gray-300'
          }`}>
            {chat.status === 'booking' ? 'Букинг' : 
             chat.status === 'lead' ? 'Лид' : 'Разговор'}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Сообщений</p>
          <p className="font-medium">{chat.messages.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Последнее обновление</p>
          <p className="font-medium">{new Date(chat.updatedAt).toLocaleString('ru-RU')}</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">История переписки</h2>
        <div className="space-y-4">
          {chat.messages.map((message, index) => (
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
                className={`max-w-2xl px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gray-800 text-white border border-gray-600'
                    : 'bg-black text-white border border-gray-700'
                }`}
              >
                {message.role === 'user' ? (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <div className="text-sm prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center border border-gray-500">
                  <UserIcon size={18} className="text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* User Actions (if any) */}
      {chat.action && (
        <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-4">
          <p className="text-sm text-blue-400 font-medium mb-1">Действие пользователя</p>
          <p className="text-blue-300">{chat.action}</p>
        </div>
      )}
    </div>
  );
}

