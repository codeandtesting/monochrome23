import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export default function Subscription() {
  const [currentPlan, setCurrentPlan] = useState('basic');
  const [showComparison, setShowComparison] = useState(false);
  const [customCredits, setCustomCredits] = useState(400);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      credits: '100 credits',
      creditsPeriod: 'per user/month granted upfront',
      features: [
        'AI Assistant (Beta)',
        'AI Research',
        '2 Sequences',
        'Prospecting, Gmail & Salesforce Extensions',
        'Deliverability Suite & Email Warmup',
        'Basic Filters'
      ],
      buttonText: 'Select Plan',
      buttonStyle: 'bg-yellow-400 text-black hover:bg-yellow-500'
    },
    {
      id: 'basic',
      name: 'Basic',
      price: '$59',
      credits: '2,500 credits',
      creditsPeriod: 'per user/month granted upfront',
      billing: 'Per user, per month\nBilled monthly',
      current: true,
      features: [
        'AI Assistant (Beta)',
        'AI Research & AI Lead Scoring',
        'Unlimited Sequences & A/Z Testing',
        'Prospecting, Gmail & Salesforce Extensions',
        'Deliverability Suite & Email Warmup',
        'Advanced Filters',
        'CRM Integrations',
        'Waterfall Enrichment',
        '6 Meetings Emails',
        '6 Intent Topics & Intent Filters',
        'CSV, CRM & API Data Enrichment',
        'Domain & Mailbox Purchasing'
      ],
      buttonText: 'Current Plan',
      buttonStyle: 'bg-gray-700 text-white cursor-not-allowed',
      buttonIcon: '✓'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$99',
      credits: '4,000 credits',
      creditsPeriod: 'per user/month granted upfront',
      billing: 'Per user, per month\nBilled monthly',
      popular: true,
      features: [
        'AI Assistant (Beta)',
        'AI Research & AI Lead Scoring',
        'Unlimited Sequences & A/Z Testing',
        'Prospecting, Gmail & Salesforce Extensions',
        'Deliverability Suite & Email Warmup',
        'Advanced Filters',
        'CRM Integrations',
        'Waterfall Enrichment',
        'Unlimited Meeting Events',
        '6 Intent Topics & Intent Filters',
        'CSV, CRM & API Data Enrichment',
        'Domain & Mailbox Purchasing',
        'Projects (Beta)',
        'Unlimited Gmail & Microsoft Mailboxes',
        'Automated Workflows',
        'US Dialer',
        'Parallel & Power Dialer',
        'Call Recordings & AI Insights (4,000 mins)',
        'Analytics & Pre-built Reports'
      ],
      buttonText: 'Select Plan',
      buttonStyle: 'bg-yellow-400 text-black hover:bg-yellow-500'
    },
    {
      id: 'organization',
      name: 'Organization',
      price: '$149',
      credits: '6,000 credits',
      creditsPeriod: 'per user/month granted upfront',
      billing: 'Per user, per month (min 3 users)\nAnnual Billing Only',
      features: [
        'AI Assistant (Beta)',
        'AI Research & AI Lead Scoring',
        'Unlimited Sequences & A/Z Testing',
        'Prospecting, Gmail & Salesforce Extensions',
        'Deliverability Suite & Email Warmup',
        'Advanced Filters',
        'CRM Integrations',
        'Waterfall Enrichment',
        'Unlimited Meeting Events',
        '12 Intent Topics & Intent Filters',
        'CSV, CRM & API Data Enrichment',
        'Domain & Mailbox Purchasing',
        'Projects (Beta)',
        'Unlimited Gmail & Microsoft Mailboxes',
        'Automated Workflows',
        'US Dialer & International Dialer',
        'Parallel & Power Dialer',
        'Call Recordings & AI Insights (8,000 mins)',
        'Analytics & Pre-built Reports',
        'Customizable Reports & Dashboards',
        'Advanced Security Configurations',
        'Single Sign-on (SSO)',
        'Use your own LLM API key'
      ],
      buttonText: 'Select Plan',
      buttonStyle: 'bg-yellow-400 text-black hover:bg-yellow-500',
      showTalkToSales: true
    }
  ];

  const creditOptions = [
    { credits: 0, price: 0 },
    { credits: 400, price: 10 },
    { credits: 1600, price: 16 },
    { credits: 2500, price: 25 },
    { credits: 5000, price: 50 },
    { credits: 10000, price: 100 },
    { credits: 20000, price: 200 },
    { credits: 50000, price: 500 },
    { credits: 100000, price: 1000 },
    { credits: 250000, price: 2500 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Тарифные планы</h1>
        <p className="text-gray-400">Выберите подходящий план для вашего бизнеса</p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-gray-900 border rounded-xl overflow-hidden flex flex-col ${
              plan.popular
                ? 'border-yellow-500'
                : plan.current
                ? 'border-gray-600'
                : 'border-gray-800'
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute top-3 right-3 z-10">
                <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded">
                  MOST POPULAR
                </span>
              </div>
            )}

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
              {/* Plan Name */}
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                </div>
                {plan.billing && (
                  <p className="text-xs text-gray-400 whitespace-pre-line">{plan.billing}</p>
                )}
              </div>

              {/* Credits */}
              <div className="mb-6 pb-6 border-b border-gray-800">
                <div className="flex items-center gap-2 text-sm mb-1">
                  <span className="text-white">📊</span>
                  <span className="font-semibold">{plan.credits}</span>
                </div>
                <p className="text-xs text-gray-400">{plan.creditsPeriod}</p>
                {plan.id !== 'free' && (
                  <button className="mt-3 text-sm text-white hover:text-gray-300 underline">
                    Learn more
                  </button>
                )}
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 mb-6 flex-1 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="text-green-400 flex-shrink-0 mt-0.5" size={16} />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Buttons */}
              <div className="space-y-2 mt-auto">
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${plan.buttonStyle}`}
                  disabled={plan.current}
                >
                  {plan.buttonIcon && <span className="mr-2">{plan.buttonIcon}</span>}
                  {plan.buttonText}
                </button>

                {plan.id !== 'free' && !plan.showTalkToSales && (
                  <button className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors">
                    Add more credits
                  </button>
                )}

                {plan.showTalkToSales && (
                  <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                    Talk to sales
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Comparison Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium inline-flex items-center gap-2"
        >
          <ChevronDown 
            size={18} 
            className={`transition-transform ${showComparison ? 'rotate-180' : ''}`}
          />
          Show plan comparison
        </button>
      </div>

      {/* Detailed Comparison Table */}
      {showComparison && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Детальное сравнение планов</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">Free</th>
                  <th className="text-center py-3 px-4">Basic</th>
                  <th className="text-center py-3 px-4">Professional</th>
                  <th className="text-center py-3 px-4">Organization</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4">AI Assistant</td>
                  <td className="text-center py-3 px-4">
                    <Check className="text-green-400 mx-auto" size={16} />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="text-green-400 mx-auto" size={16} />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="text-green-400 mx-auto" size={16} />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="text-green-400 mx-auto" size={16} />
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4">AI Research</td>
                  <td className="text-center py-3 px-4">
                    <Check className="text-green-400 mx-auto" size={16} />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="text-green-400 mx-auto" size={16} />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="text-green-400 mx-auto" size={16} />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="text-green-400 mx-auto" size={16} />
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4">Sequences</td>
                  <td className="text-center py-3 px-4 text-gray-400">2</td>
                  <td className="text-center py-3 px-4 text-gray-400">Unlimited</td>
                  <td className="text-center py-3 px-4 text-gray-400">Unlimited</td>
                  <td className="text-center py-3 px-4 text-gray-400">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4">Credits/month</td>
                  <td className="text-center py-3 px-4 text-gray-400">100</td>
                  <td className="text-center py-3 px-4 text-gray-400">2,500</td>
                  <td className="text-center py-3 px-4 text-gray-400">4,000</td>
                  <td className="text-center py-3 px-4 text-gray-400">6,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customize Credits Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="bg-gray-800 px-6 py-4 flex items-center gap-3 border-b border-gray-700">
          <span className="px-3 py-1 bg-gray-700 text-white text-xs font-bold rounded">
            Step 2
          </span>
          <h3 className="text-lg font-bold">Customize Credits</h3>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-xl font-bold mb-2">Credits</h4>
            <p className="text-gray-400 text-sm">
              Credits are shared across users. Select how many credits you would like for your team below.
            </p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="text-lg">
              <span className="font-bold">{currentPlan === 'basic' ? '2.5K' : '0'}</span>
              <span className="text-gray-400"> (Current plan)</span>
              <span className="text-gray-400"> + </span>
              <span className="font-bold">{customCredits}</span>
              <span className="text-gray-400"> credits/mo</span>
            </div>
            <div className="text-2xl font-bold">
              ${creditOptions.find(opt => opt.credits === customCredits)?.price || 0}/mo
            </div>
          </div>

          {/* Credit Slider */}
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max={creditOptions.length - 1}
              value={creditOptions.findIndex(opt => opt.credits === customCredits)}
              onChange={(e) => setCustomCredits(creditOptions[parseInt(e.target.value)].credits)}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />

            {/* Credit Options */}
            <div className="flex justify-between text-xs text-gray-500">
              {creditOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setCustomCredits(option.credits)}
                  className={`hover:text-white transition-colors ${
                    customCredits === option.credits ? 'text-blue-400 font-bold' : ''
                  }`}
                >
                  {option.credits === 0 ? '0' : 
                   option.credits >= 1000 ? `${option.credits / 1000}K` : option.credits}/mo
                </button>
              ))}
              <button className="hover:text-white transition-colors">
                Custom
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Note */}
      <p className="text-center text-xs text-gray-500">
        Prices exclude any applicable taxes.
      </p>
    </div>
  );
}
