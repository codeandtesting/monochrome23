import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check } from 'lucide-react';
import { chatWithDeepSeek } from '../../api/deepseek';
import ProgressSteps from '../../components/ProgressSteps';

export default function AIWizardStep2() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedContent, setGeneratedContent] = useState(null);

  const steps = [
    { label: 'Analyzing your business...', duration: 2000 },
    { label: 'Creating company description...', duration: 3000 },
    { label: 'Generating services list...', duration: 3000 },
    { label: 'Crafting unique selling points...', duration: 2000 },
    { label: 'Finalizing your website...', duration: 2000 },
  ];

  useEffect(() => {
    const wizardData = localStorage.getItem('aiWizardData');
    if (!wizardData) {
      navigate('/onboarding/ai-wizard/step1');
      return;
    }

    generateContent(JSON.parse(wizardData));
  }, []);

  const generateContent = async (formData) => {
    // Симуляция прогресса
    let totalTime = 0;
    for (let i = 0; i < steps.length; i++) {
      setTimeout(() => {
        setCurrentStep(i);
        setProgress(((i + 1) / steps.length) * 100);
      }, totalTime);
      totalTime += steps[i].duration;
    }

    // Генерация контента через AI
    try {
      const prompt = `You are a professional website content generator. Based on the following business information, create a complete website content in JSON format.

Business Information:
- Company Name: ${formData.companyName}
- Services: ${formData.businessDescription}
- Location: ${formData.location === 'local' ? formData.specificLocation : formData.location === 'regional' ? 'Regional coverage' : 'Global services'}

Generate a JSON object with the following structure:
{
  "hero": {
    "companyName": "company name",
    "tagline": "catchy tagline (max 10 words)",
    "description": "professional description (2-3 sentences)"
  },
  "services": [
    {"title": "service 1", "description": "brief description", "category": "category name"},
    {"title": "service 2", "description": "brief description", "category": "category name"},
    ... (create 5-8 services based on the business description)
  ],
  "stats": [
    {"icon": "⚡", "value": "relevant number", "label": "achievement"},
    {"icon": "🛡️", "value": "relevant number", "label": "achievement"},
    {"icon": "⭐", "value": "relevant number", "label": "achievement"}
  ]
}

Make the content professional, engaging, and tailored to the business. Use appropriate emojis for stats. Return ONLY the JSON object, no additional text.`;

      const response = await chatWithDeepSeek([
        { role: 'user', content: prompt }
      ]);

      // Парсим JSON из ответа
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const content = JSON.parse(jsonMatch[0]);
        
        setTimeout(() => {
          localStorage.setItem('generatedContent', JSON.stringify(content));
          setGeneratedContent(content);
          
          // Переход на step 3 через 1 секунду
          setTimeout(() => {
            navigate('/onboarding/ai-wizard/step3');
          }, 1000);
        }, totalTime);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      // В случае ошибки используем базовый контент
      setTimeout(() => {
        const fallbackContent = {
          hero: {
            companyName: formData.companyName,
            tagline: 'Professional Services You Can Trust',
            description: `${formData.companyName} specializes in ${formData.businessDescription}. We deliver quality results with attention to detail.`
          },
          services: [
            { title: 'Primary Service', description: 'High-quality primary service', category: 'Main' },
            { title: 'Secondary Service', description: 'Reliable secondary service', category: 'Main' }
          ],
          stats: [
            { icon: '⚡', value: '10+', label: 'Years Experience' },
            { icon: '🛡️', value: '100+', label: 'Projects Done' },
            { icon: '⭐', value: '50+', label: 'Happy Clients' }
          ]
        };
        
        localStorage.setItem('generatedContent', JSON.stringify(fallbackContent));
        navigate('/onboarding/ai-wizard/step3');
      }, totalTime);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Steps */}
        <ProgressSteps
          currentStep={2}
          totalSteps={4}
          steps={['Basic Info', 'Services', 'Details', 'Preview']}
        />

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4 animate-pulse">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Creating Your Website...</h1>
          <p className="text-gray-400">
            AI is generating professional content for your business
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                index < currentStep
                  ? 'border-green-500 bg-green-500 bg-opacity-10'
                  : index === currentStep
                  ? 'border-blue-500 bg-blue-500 bg-opacity-10 animate-pulse'
                  : 'border-gray-800 bg-gray-900 opacity-50'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                index < currentStep
                  ? 'bg-green-500'
                  : index === currentStep
                  ? 'bg-blue-500'
                  : 'bg-gray-800'
              }`}>
                {index < currentStep ? (
                  <Check size={18} className="text-white" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <p className={`font-medium ${
                index <= currentStep ? 'text-white' : 'text-gray-500'
              }`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>

        {/* Loading Animation */}
        <div className="mt-12 text-center">
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            This may take a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
