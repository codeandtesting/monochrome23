import React, { useState } from 'react';
import { Sparkles, X, Check, RefreshCw, Loader } from 'lucide-react';
import { chatWithDeepSeek } from '../../api/deepseek';

const getSectionPrompt = (sectionType) => {
  const prompts = {
    hero: `Ты - эксперт по маркетингу IT-компаний. Анализируй HERO секцию (главный заголовок).

ТВОЯ ЗАДАЧА:
Предложить ДВА улучшения для Hero секции одновременно:
1. Улучшение для СЛОГАНА (tagline)
2. Улучшение для ОПИСАНИЯ (description)

ЧТО НУЖНО ПРЕДЛОЖИТЬ:

**1. СЛОГАН (tagline)** - сделать более эмоциональным, ясным и запоминающимся
  Примеры типов слоганов:
  - Эмоциональный: "Создаем IT-решения, которые работают: 98% удовлетворенности клиентов"
  - С цифрами: "150+ успешных проектов • 5+ лет опыта"
  - С преимуществом: "Ваш надежный партнер в цифровой трансформации"

**2. ОПИСАНИЕ (description)** - добавить социальные доказательства и конкретику
  Примеры улучшений:
  - Добавить цифры: "98% клиентов довольны результатом"
  - Добавить опыт: "15+ лет на рынке IT-решений"
  - Добавить результаты: "Помогли 150+ компаниям автоматизировать бизнес"

ВАЖНЫЕ ПРАВИЛА:
- Предлагай ДВА улучшения в одном ответе (массив из 2 объектов)
- Первое - для слогана, второе - для описания
- Анализируй ТЕКУЩИЕ данные и предлагай конкретные улучшения

ФОРМАТ ОТВЕТА (JSON МАССИВ):`,

    services: `Ты - эксперт по маркетингу IT-компаний. Анализируй SERVICES секцию (услуги).

ТВОЯ ЗАДАЧА:
Предложить новую актуальную услугу или улучшение существующих, которое увеличит привлекательность.

ЧТО МОЖНО ПРЕДЛОЖИТЬ:
- Новую востребованную услугу (Audit, Support, Consulting)
- Дополнение к существующим услугам
- Специализированные услуги для ниши

ФОРМАТ ОТВЕТА (JSON):`,

    contacts: `Ты - эксперт по маркетингу IT-компаний. Анализируй CONTACTS секцию (контакты).

ТВОЯ ЗАДАЧА:
Предложить улучшение контактной информации для увеличения доверия.

ЧТО МОЖНО ПРЕДЛОЖИТЬ:
- Добавить дополнительные способы связи (Telegram, WhatsApp)
- Рабочие часы для повышения доверия
- Время ответа на запросы
- Дополнительные офисы/представительства

ФОРМАТ ОТВЕТА (JSON):`,

    social: `Ты - эксперт по маркетингу IT-компаний. Анализируй SOCIAL NETWORKS секцию.

ТВОЯ ЗАДАЧА:
Предложить улучшение присутствия в соц сетях для увеличения доверия.

ЧТО МОЖНО ПРЕДЛОЖИТЬ:
- Добавить популярные платформы (LinkedIn, GitHub, Medium)
- Статистику подписчиков для доверия
- Ссылки на кейсы в соц сетях

ФОРМАТ ОТВЕТА (JSON):`,

    'seo-meta': `Ты - SEO эксперт. Анализируй SEO META TAGS секцию.

ТВОЯ ЗАДАЧА:
Предложить улучшение для meta тегов, которое повысит позиции в поисковых системах и CTR.

ЧТО МОЖНО ПРЕДЛОЖИТЬ:
- Улучшить Title для большей кликабельности (добавить триггеры, цифры, эмодзи)
- Оптимизировать Description для увеличения CTR
- Добавить релевантные Keywords
- Улучшить Author/Keywords для индексации

ФОРМАТ ОТВЕТА (JSON):`,

    'seo-content': `Ты - SEO эксперт по контент-маркетингу. Анализируй SEO CONTENT секцию.

ТВОЯ ЗАДАЧА:
Предложить SEO-оптимизированный контент, который увеличит органический трафик.

ЧТО МОЖНО ПРЕДЛОЖИТЬ:
- H1/H2 заголовки с ключевыми словами
- Alt-тексты для изображений
- Структурированные данные (Schema.org)
- FAQ секцию с популярными вопросами

ФОРМАТ ОТВЕТА (JSON):`,

    stats: `Ты - эксперт по конверсионному маркетингу. Анализируй STATISTICS секцию.

ТВОЯ ЗАДАЧА:
Предложить статистику, которая увеличит доверие и конверсию.

ЧТО МОЖНО ПРЕДЛОЖИТЬ:
- Впечатляющие цифры достижений (проекты, клиенты, опыт)
- Процент удовлетворенности клиентов
- Время работы / Скорость ответа
- Экономия/результаты для клиентов

ФОРМАТ ОТВЕТА (JSON):`
  };

  return prompts[sectionType] || prompts.hero;
};

const AI_SUGGESTION_PROMPT_BASE = `
ПРАВИЛА:
1. Давай ТОЛЬКО ОДНО предложение за раз
2. Предложение должно быть конкретным и готовым к применению
3. Фокус на увеличении доверия и конверсии
4. АНАЛИЗИРУЙ ТЕКУЩИЕ ДАННЫЕ и предлагай улучшения именно для ЭТОЙ компании
5. Отвечай ТОЛЬКО в формате JSON:

{
  "type": "hero_stat" | "hero_tagline" | "service" | "contact_method" | "social_platform" | "seo_meta" | "seo_keyword" | "statistic",
  "suggestion": "Краткое описание предложения",
  "data": { ... },
  "reason": "Почему это увеличит конверсию/SEO"
}

ПРИМЕРЫ ФОРМАТА (адаптируй под текущую компанию):

Hero секция (МАССИВ ИЗ 2 ПРЕДЛОЖЕНИЙ):
[
  {
    "type": "hero_tagline",
    "suggestion": "Улучшить слоган для большей эмоциональной вовлеченности",
    "data": {
      "field": "tagline",
      "newValue": "AI-Powered Landing Pages That Convert: Create, Launch, Grow - No Code Required"
    },
    "reason": "Новый слоган фокусируется на результате (конверсии) и процессе (создать, запустить, расти), добавляя эмоциональную вовлеченность и конкретное преимущество 'No Code'"
  },
  {
    "type": "hero_stat",
    "suggestion": "Добавить конкретные цифры достижений и социальные доказательства",
    "data": {
      "field": "description",
      "newValue": "Build professional landing pages with AI assistance. No coding required. Perfect for agencies. Используют 3,500+ бизнесов, 8,200+ фрилансеров и 4,300+ агентств по всему миру"
    },
    "reason": "Конкретные цифры (3,500+ бизнесов) создают сильное социальное доказательство и демонстрируют масштаб охвата, что увеличивает доверие и конверсию на 15-20%"
  }
]

Services секция:
{
  "type": "service",
  "suggestion": "Добавить актуальную услугу для данной ниши",
  "data": {
    "title": "Название новой услуги",
    "description": "Описание услуги",
    "category": "Категория"
  },
  "reason": "Почему эта услуга важна для данного бизнеса"
}

SEO Meta секция:
{
  "type": "seo_meta",
  "suggestion": "Оптимизировать Title для увеличения CTR",
  "data": {
    "field": "title",
    "newValue": "Улучшенный Title с триггерами и цифрами"
  },
  "reason": "Увеличивает кликабельность в поисковой выдаче на 15-25%"
}

Statistics секция:
{
  "type": "statistic",
  "suggestion": "Добавить впечатляющую статистику",
  "data": {
    "value": "150+",
    "label": "Успешных проектов",
    "icon": "📊"
  },
  "reason": "Конкретные цифры создают доверие и демонстрируют опыт"
}

Contacts/Social секция:
{
  "type": "contact_method",
  "suggestion": "Добавить популярный канал связи",
  "data": {
    "field": "название поля",
    "value": "значение"
  },
  "reason": "Почему это важно для этой аудитории"
}

ТЕКУЩИЕ ДАННЫЕ КОМПАНИИ:
`;

export default function AISuggestions({ sectionType, currentData, onApplySuggestion, onClose }) {
  const [suggestion, setSuggestion] = useState(null);
  const [suggestions, setSuggestions] = useState([]); // Для hero - массив из 2 предложений
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [applied, setApplied] = useState(false);

  // Получаем название компании для отображения
  const companyName = currentData.hero?.companyName || 'компания';

  const generateSuggestion = async () => {
    setLoading(true);
    setError(null);
    setApplied(false);

    try {
      // Получаем промпт для конкретной секции
      const sectionPrompt = getSectionPrompt(sectionType);

      // Получаем название компании для контекста
      const companyName = currentData.hero?.companyName || 'компания';
      const companyDescription = currentData.hero?.description || '';

      // Для Hero секции не нужны дополнительные инструкции - AI вернет массив из 2 предложений
      let focusInstruction = '';

      // Формируем финальный промпт с данными текущей секции
      let sectionData;
      if (sectionType === 'hero') {
        sectionData = currentData.hero;
      } else if (sectionType === 'services') {
        sectionData = { heading: currentData.services?.heading };
      } else if (sectionType === 'contacts') {
        sectionData = currentData.contacts;
      } else if (sectionType === 'social') {
        sectionData = currentData.social;
      } else if (sectionType === 'seo-meta') {
        sectionData = currentData.seo || { title: '', description: '', keywords: '', author: '' };
      } else if (sectionType === 'seo-content') {
        sectionData = { seo: currentData.seo, hero: currentData.hero };
      } else if (sectionType === 'stats') {
        sectionData = currentData.stats || { enabled: false, items: [] };
      } else {
        sectionData = currentData;
      }

      const contextInfo = `
КОНТЕКСТ:
Компания: ${companyName}
Описание: ${companyDescription}
Секция: ${sectionType}
`;

      const fullPrompt = contextInfo + '\n' + sectionPrompt + '\n\n' + AI_SUGGESTION_PROMPT_BASE + '\n\n' + JSON.stringify(sectionData, null, 2);
      
      const systemPrompt = `You are a marketing expert analyzing ${companyName}. 
Your task is to provide specific, actionable suggestions based on THEIR actual data and business context.
Respond ONLY with valid JSON. Do NOT use generic examples.`;

      const response = await chatWithDeepSeek([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: fullPrompt }
      ]);

      // Парсим JSON из ответа
      // Для hero ищем массив, для остальных - объект
      if (sectionType === 'hero') {
        const arrayMatch = response.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          const suggestionsData = JSON.parse(arrayMatch[0]);
          if (Array.isArray(suggestionsData) && suggestionsData.length >= 2) {
            setSuggestions(suggestionsData);
          } else {
            throw new Error('AI должен вернуть массив из 2 предложений для Hero');
          }
        } else {
          throw new Error('AI не вернул корректный JSON массив');
        }
      } else {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const suggestionData = JSON.parse(jsonMatch[0]);
          setSuggestion(suggestionData);
        } else {
          throw new Error('AI не вернул корректный JSON');
        }
      }
    } catch (err) {
      console.error('Error generating suggestion:', err);
      setError('Ошибка при генерации предложения. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (suggestion && onApplySuggestion) {
      onApplySuggestion(suggestion);
      setApplied(true);
      
      // Через 1.5 секунды генерируем новое предложение
      setTimeout(() => {
        generateSuggestion();
      }, 1500);
    }
  };

  const handleSkip = () => {
    generateSuggestion();
  };

  // Автоматически генерируем первое предложение
  React.useEffect(() => {
    generateSuggestion();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Sparkles className="text-purple-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Suggestions</h2>
              <p className="text-sm text-gray-400">
                <span className="text-white font-medium">{companyName}</span> • Улучшаем: <span className="text-purple-400 font-medium capitalize">
                  {sectionType === 'hero' ? 'Main Hero' :
                   sectionType === 'services' ? 'Services' :
                   sectionType === 'contacts' ? 'Contacts' :
                   sectionType === 'social' ? 'Social Networks' :
                   sectionType === 'seo-meta' ? 'SEO Meta Tags' :
                   sectionType === 'seo-content' ? 'SEO Content' :
                   sectionType === 'stats' ? 'Statistics' :
                   sectionType}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="animate-spin text-purple-400 mb-4" size={40} />
              <p className="text-gray-400">AI анализирует ваши данные...</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg p-4 mb-4">
              <p className="text-red-400">{error}</p>
              <button
                onClick={generateSuggestion}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Попробовать снова
              </button>
            </div>
          )}

          {!loading && applied && (
            <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg p-4 mb-4 flex items-center gap-3">
              <Check className="text-green-400" size={24} />
              <div>
                <p className="font-semibold text-green-400">Отлично! Изменение применено!</p>
                <p className="text-sm text-gray-400">Генерирую следующее предложение...</p>
              </div>
            </div>
          )}

          {/* Для Hero - показываем 2 предложения */}
          {!loading && sectionType === 'hero' && suggestions.length > 0 && (
            <div className="space-y-3">
              {/* Слоган */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-3">
                  <div className="w-6 h-6 bg-purple-500 bg-opacity-20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="text-purple-400" size={14} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">{suggestions[0].suggestion}</h3>
                    <p className="text-xs text-gray-400">
                      💡 {suggestions[0].reason}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-500 mb-1.5">Слоган:</p>
                  <p className="text-sm font-medium text-gray-200">{suggestions[0].data.newValue}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (onApplySuggestion) {
                        onApplySuggestion(suggestions[0]);
                        setApplied(true);
                        setTimeout(() => setApplied(false), 1500);
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Check size={16} />
                    Применить
                  </button>
                  <button
                    onClick={() => generateSuggestion()}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <RefreshCw size={16} />
                    Повторить
                  </button>
                </div>
              </div>

              {/* Описание */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-3">
                  <div className="w-6 h-6 bg-purple-500 bg-opacity-20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="text-purple-400" size={14} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">{suggestions[1].suggestion}</h3>
                    <p className="text-xs text-gray-400">
                      💡 {suggestions[1].reason}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-500 mb-1.5">Описание:</p>
                  <p className="text-sm text-gray-200 leading-relaxed">{suggestions[1].data.newValue}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (onApplySuggestion) {
                        onApplySuggestion(suggestions[1]);
                        setApplied(true);
                        setTimeout(() => setApplied(false), 1500);
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Check size={16} />
                    Применить
                  </button>
                  <button
                    onClick={() => generateSuggestion()}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <RefreshCw size={16} />
                    Повторить
                  </button>
                </div>
              </div>

              {/* Single Close Button */}
              <button
                onClick={onClose}
                className="w-full px-6 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all font-medium text-sm"
              >
                Закончить
              </button>

              {/* Footer */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 flex items-start gap-2">
                <div className="text-blue-400 mt-0.5 text-sm">💬</div>
                <p className="text-xs text-blue-400">
                  AI анализирует ваши текущие данные и предлагает улучшения для увеличения конверсии в лиды.
                </p>
              </div>
            </div>
          )}

          {/* Для остальных секций - обычное отображение */}
          {!loading && sectionType !== 'hero' && suggestion && (
            <div className="space-y-4">
              {/* Suggestion Card */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-500 bg-opacity-20 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="text-purple-400" size={16} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{suggestion.suggestion}</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      💡 <span className="font-medium text-gray-300">Почему это работает:</span> {suggestion.reason}
                    </p>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase mb-2 font-medium">Предварительный просмотр:</p>
                  <div className="text-sm">
                    {/* Hero Section Previews */}
                    {(suggestion.type === 'hero_stat' || suggestion.type === 'hero_tagline') && (
                      <div className="space-y-2">
                        {suggestion.data.field === 'description' && (
                          <div className="text-gray-300">
                            <p className="text-xs text-gray-500 mb-1">Описание:</p>
                            <p className="leading-relaxed">{suggestion.data.newValue}</p>
                          </div>
                        )}
                        {suggestion.data.field === 'tagline' && (
                          <div className="text-gray-300">
                            <p className="text-xs text-gray-500 mb-1">Слоган:</p>
                            <p className="text-lg font-semibold">{suggestion.data.newValue}</p>
                          </div>
                        )}
                        {suggestion.data.field === 'companyName' && (
                          <div className="text-gray-300">
                            <p className="text-xs text-gray-500 mb-1">Название компании:</p>
                            <p className="text-xl font-bold">{suggestion.data.newValue}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Statistic Preview */}
                    {suggestion.type === 'statistic' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-3">
                          <span className="text-2xl">{suggestion.data.icon || '📊'}</span>
                          <div>
                            <p className="text-2xl font-bold text-white">{suggestion.data.value}</p>
                            <p className="text-xs text-gray-400">{suggestion.data.label}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SEO Meta Preview */}
                    {suggestion.type === 'seo_meta' && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 mb-1 capitalize">{suggestion.data.field}:</p>
                        <div className="bg-gray-800/50 border border-gray-700 rounded p-2">
                          <p className="text-white text-sm font-medium">{suggestion.data.newValue}</p>
                        </div>
                      </div>
                    )}

                    {/* Service Preview */}
                    {suggestion.type === 'service' && (
                      <div className="space-y-2">
                        <p className="font-semibold text-white">{suggestion.data.title}</p>
                        <p className="text-gray-400 text-xs">{suggestion.data.description}</p>
                        <span className="inline-block text-xs px-2 py-1 bg-gray-800 rounded">
                          {suggestion.data.category}
                        </span>
                      </div>
                    )}

                    {/* Contact Method Preview */}
                    {suggestion.type === 'contact_method' && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500">Новое поле контакта:</p>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 capitalize">{suggestion.data.field}:</span>
                          <span className="text-white font-medium">{suggestion.data.value}</span>
                        </div>
                      </div>
                    )}

                    {/* Social Platform Preview */}
                    {suggestion.type === 'social_platform' && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500">Новая социальная сеть:</p>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 capitalize">{suggestion.data.platform}:</span>
                          <a href={suggestion.data.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-xs">
                            {suggestion.data.url}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Benefit Preview */}
                    {suggestion.type === 'benefit' && (
                      <div className="space-y-2">
                        <p className="font-semibold text-white">{suggestion.data.title}</p>
                        <p className="text-gray-400 text-xs">{suggestion.data.description}</p>
                      </div>
                    )}

                    {/* Other types */}
                    {(suggestion.type === 'case_study' || suggestion.type === 'testimonial') && (
                      <div className="text-gray-300">
                        <pre className="whitespace-pre-wrap text-xs">
                          {JSON.stringify(suggestion.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleApply}
                  disabled={applied}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check size={20} />
                  {applied ? 'Применено!' : 'Да, давай! Применить'}
                </button>

                <button
                  onClick={handleSkip}
                  disabled={loading || applied}
                  className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Пропустить
                </button>

                <button
                  onClick={generateSuggestion}
                  disabled={loading || applied}
                  className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={18} />
                  Другое
                </button>
              </div>

              {/* Info */}
              <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-4">
                <p className="text-sm text-blue-400">
                  💬 AI анализирует ваши текущие данные и предлагает улучшения для увеличения конверсии в лиды. 
                  Каждое предложение основано на лучших практиках маркетинга.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

