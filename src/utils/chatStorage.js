// Утилита для работы с сохранением чатов в localStorage

const CHATS_STORAGE_KEY = 'progressit_chats';

// Получить все чаты
export const getAllChats = () => {
  try {
    const chats = localStorage.getItem(CHATS_STORAGE_KEY);
    return chats ? JSON.parse(chats) : [];
  } catch (error) {
    console.error('Error reading chats:', error);
    return [];
  }
};

// Получить чаты для конкретного сайта
export const getChatsBySite = (siteId) => {
  const allChats = getAllChats();
  console.log('Filtering chats for siteId:', siteId);
  console.log('All chats:', allChats.map(c => ({ id: c.id, siteId: c.siteId, name: c.userInfo.name })));
  const filtered = allChats.filter(chat => chat.siteId === siteId);
  console.log('Filtered chats:', filtered.length);
  return filtered;
};

// Сохранить новый чат или обновить существующий
export const saveChat = (chatId, messages, userInfo = {}) => {
  try {
    const chats = getAllChats();
    const existingChatIndex = chats.findIndex(chat => chat.id === chatId);

    // Определяем статус на основе содержимого чата
    const hasEmail = messages.some(msg => 
      msg.content.includes('@') || 
      msg.content.toLowerCase().includes('email')
    );
    const hasPhoneRequest = messages.some(msg => 
      msg.content.toLowerCase().includes('звонок') ||
      msg.content.toLowerCase().includes('позвоните') ||
      msg.content.toLowerCase().includes('call')
    );
    const hasBooking = messages.some(msg => 
      msg.content.toLowerCase().includes('забукать') ||
      msg.content.toLowerCase().includes('букинг') ||
      msg.content.toLowerCase().includes('meeting')
    );

    let status = 'conversation'; // чат, лид, букинг
    let action = null;

    if (hasBooking) {
      status = 'booking';
      action = '📅 Запросил встречу';
    } else if (hasPhoneRequest) {
      status = 'lead';
      action = '📞 Запросил звонок';
    } else if (hasEmail) {
      status = 'lead';
      action = '✉️ Оставил контакт';
    }

    const chatData = {
      id: chatId,
      siteId: userInfo.siteId || null, // ID сайта, к которому относится чат
      messages: messages,
      userInfo: {
        name: userInfo.name || 'Анонимный',
        email: userInfo.email || null,
        phone: userInfo.phone || null,
      },
      status: status,
      action: action,
      createdAt: existingChatIndex >= 0 ? chats[existingChatIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: userInfo.source || 'main', // 'main' или 'client'
    };

    console.log('💬 Chat saved with siteId:', chatData.siteId, '| Chat ID:', chatId);

    if (existingChatIndex >= 0) {
      chats[existingChatIndex] = chatData;
    } else {
      chats.unshift(chatData); // Добавляем в начало (новые сверху)
    }

    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
    return chatData;
  } catch (error) {
    console.error('Error saving chat:', error);
    return null;
  }
};

// Получить конкретный чат по ID
export const getChat = (chatId) => {
  const chats = getAllChats();
  return chats.find(chat => chat.id === chatId);
};

// Удалить чат
export const deleteChat = (chatId) => {
  try {
    const chats = getAllChats();
    const filteredChats = chats.filter(chat => chat.id !== chatId);
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(filteredChats));
    return true;
  } catch (error) {
    console.error('Error deleting chat:', error);
    return false;
  }
};

// Получить статистику
export const getChatStats = () => {
  const chats = getAllChats();
  return {
    total: chats.length,
    conversations: chats.filter(c => c.status === 'conversation').length,
    leads: chats.filter(c => c.status === 'lead').length,
    bookings: chats.filter(c => c.status === 'booking').length,
  };
};

// Генерация уникального ID для чата
export const generateChatId = () => {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Извлечь превью чата (первое сообщение пользователя)
export const getChatPreview = (messages) => {
  const userMessage = messages.find(msg => msg.role === 'user');
  if (!userMessage) return 'Новый чат';
  
  const content = userMessage.content;
  return content.length > 80 ? content.substring(0, 80) + '...' : content;
};

// Форматирование времени
export const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'только что';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин назад`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} час${Math.floor(diffInSeconds / 3600) === 1 ? '' : 'а'} назад`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} дн${Math.floor(diffInSeconds / 86400) === 1 ? 'я' : 'я'} назад`;
  
  return date.toLocaleDateString('ru-RU');
};

