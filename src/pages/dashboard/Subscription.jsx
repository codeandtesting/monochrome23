import React, { useState } from 'react';
import { Check, Zap, Crown, Building2, Sparkles } from 'lucide-react';

export default function Subscription() {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [currentPlan, setCurrentPlan] = useState('free');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: <Sparkles className="w-8 h-8" />,
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for trying out Monochrome',
      features: [
        '1 website',
        '100 AI conversations/month',
        '50 leads/month',
        'Basic templates',
        '2 color schemes',
        'Community support',
        'Monochrome branding'
      ],
      limitations: [
        'Limited customization',
        'No custom domain'
      ],
      color: 'gray',
      buttonText: 'Current Plan'
    },
    {
      id: 'basic',
      name: 'Basic',
      icon: <Zap className="w-8 h-8" />,
      price: { monthly: 29, yearly: 290 },
      description: 'For solo entrepreneurs and freelancers',
      features: [
        '3 websites',
        '1,000 AI conversations/month',
        '500 leads/month',
        'All templates',
        '6 color schemes',
        'Priority email support',
        'Remove Monochrome branding',
        'Custom domain support',
        'Lead export (CSV)',
        'Basic analytics'
      ],
      popular: false,
      color: 'blue',
      buttonText: 'Upgrade to Basic'
    },
    {
      id: 'professional',
      name: 'Professional',
      icon: <Crown className="w-8 h-8" />,
      price: { monthly: 99, yearly: 990 },
      description: 'For growing businesses and agencies',
      features: [
        '10 websites',
        'Unlimited AI conversations',
        'Unlimited leads',
        'All templates + premium',
        'All color schemes',
        'Priority support (24/7)',
        'White label (remove branding)',
        'Multiple custom domains',
        'Lead export (CSV, Excel, API)',
        'Advanced analytics & reports',
        'A/B testing',
        'Custom AI training',
        'Team collaboration (3 users)',
        'API access'
      ],
      popular: true,
      color: 'purple',
      buttonText: 'Upgrade to Pro'
    },
    {
      id: 'organization',
      name: 'Organization',
      icon: <Building2 className="w-8 h-8" />,
      price: { monthly: 299, yearly: 2990 },
      description: 'For large teams and enterprises',
      features: [
        'Unlimited websites',
        'Unlimited AI conversations',
        'Unlimited leads',
        'All features from Professional',
        'Dedicated account manager',
        'Custom AI model training',
        'Advanced security (SSO, 2FA)',
        'Team collaboration (unlimited users)',
        'Priority development requests',
        'SLA guarantee',
        'Custom integrations',
        'Onboarding assistance',
        'Quarterly business reviews'
      ],
      popular: false,
      color: 'gold',
      buttonText: 'Contact Sales'
    }
  ];

  const handleSelectPlan = (planId) => {
    if (planId === 'free') {
      alert('You are already on the Free plan');
      return;
    }
    if (planId === 'organization') {
      alert('Please contact our sales team at sales@monochrome.com for enterprise pricing');
      return;
    }
    alert(`✅ Upgrading to ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan!\n\nYou will be redirected to payment...`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-400 text-lg mb-8">
          Select the perfect plan for your business needs
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-lg p-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded transition-all ${
              billingCycle === 'monthly'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded transition-all ${
              billingCycle === 'yearly'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Yearly
            <span className="ml-2 text-xs text-green-400">Save 17%</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
          const isCurrentPlan = plan.id === currentPlan;

          return (
            <div
              key={plan.id}
              className={`relative bg-gray-900 border-2 rounded-xl p-6 transition-all hover:shadow-2xl ${
                plan.popular
                  ? 'border-purple-500 shadow-purple-500/20'
                  : 'border-gray-800 hover:border-gray-700'
              } ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold text-white">
                  MOST POPULAR
                </div>
              )}

              {/* Icon */}
              <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${
                plan.color === 'gray' ? 'from-gray-600 to-gray-700' :
                plan.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                plan.color === 'purple' ? 'from-purple-500 to-pink-500' :
                'from-yellow-500 to-orange-500'
              } flex items-center justify-center mb-4 text-white`}>
                {plan.icon}
              </div>

              {/* Plan Info */}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">${price}</span>
                  {plan.id !== 'free' && (
                    <span className="text-gray-400">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  )}
                </div>
                {billingCycle === 'yearly' && plan.id !== 'free' && (
                  <p className="text-xs text-green-400 mt-1">
                    ${(plan.price.monthly * 12 - plan.price.yearly).toFixed(0)} saved/year
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
                {plan.limitations?.map((limitation, index) => (
                  <li key={`limit-${index}`} className="flex items-start gap-2 text-sm">
                    <span className="text-gray-600 flex-shrink-0 mt-0.5">×</span>
                    <span className="text-gray-500 line-through">{limitation}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={isCurrentPlan}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  isCurrentPlan
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                    : plan.color === 'gold'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isCurrentPlan ? 'Current Plan' : plan.buttonText}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ / Additional Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Can I upgrade or downgrade anytime?</h3>
            <p className="text-gray-400 text-sm">Yes! You can change your plan at any time. Upgrades take effect immediately, downgrades at the end of your billing period.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-400 text-sm">We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Is there a free trial?</h3>
            <p className="text-gray-400 text-sm">The Free plan is available forever. Paid plans include a 14-day money-back guarantee.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What happens if I exceed my limits?</h3>
            <p className="text-gray-400 text-sm">We'll notify you when you're close to your limits. You can purchase additional credits or upgrade your plan.</p>
          </div>
        </div>
      </div>

      {/* Enterprise CTA */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Need a custom solution?</h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          We offer custom enterprise plans with tailored features, dedicated support, and volume discounts for large organizations.
        </p>
        <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all">
          Contact Sales Team
        </button>
      </div>
    </div>
  );
}
