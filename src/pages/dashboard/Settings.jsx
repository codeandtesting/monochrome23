import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Save, Shield, Key, Mail, User, Bell, Trash2, Check, Eye, EyeOff,
  Settings as SettingsIcon, UserCircle, CreditCard, BarChart3, Crown, Calendar,
  Zap, X
} from 'lucide-react';

export default function Settings() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('general');

  // Check if we should open a specific tab from navigation state
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);
  const [name, setName] = useState('FAAZY F BABY');
  const [email, setEmail] = useState('faazylav@gmail.com');
  const [workFunction, setWorkFunction] = useState('developer');
  const [preferences, setPreferences] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [saved, setSaved] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('max'); // 'free', 'pro', 'max'

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Perfect for testing',
      features: [
        '1 website',
        'Basic AI chatbot',
        'Community support',
        'Monochrome branding',
        '1 GB storage'
      ],
      icon: Zap,
      color: 'from-gray-500 to-gray-600'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 19,
      description: 'For growing businesses',
      features: [
        '5 websites',
        'Advanced AI chatbot',
        'Email support',
        'Remove branding',
        'Basic analytics',
        '5 GB storage'
      ],
      icon: Zap,
      color: 'from-blue-500 to-purple-500',
      popular: true
    },
    {
      id: 'max',
      name: 'Max Plan',
      price: 29,
      description: 'Unlimited sites and features',
      features: [
        'Unlimited websites',
        'AI chatbot on all sites',
        'Advanced analytics',
        'Priority support',
        'Custom domains',
        '10 GB storage'
      ],
      icon: Crown,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'account', label: 'Account', icon: UserCircle },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'usage', label: 'Usage', icon: BarChart3 },
  ];

  const handleSaveGeneral = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleEnable2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    alert(twoFactorEnabled ? '2FA disabled' : '2FA enabled successfully!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion initiated. You will receive a confirmation email.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-7xl h-full">
      {/* Left Sidebar Navigation */}
      <div className="w-full md:w-48 flex-shrink-0">
        <div className="sticky top-6 flex md:flex-col gap-2 md:space-y-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-auto md:w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0
                ${activeTab === tab.id
                  ? 'bg-gray-800/50 text-white'
                  : 'text-gray-400 hover:bg-gray-800/30 hover:text-white'
                }
              `}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold mb-1">Settings</h1>
          <p className="text-sm text-gray-500">Manage your account preferences and settings</p>
        </div>

        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* Full Name */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <div className="max-w-xl">
                <label className="block text-sm font-medium mb-2">Full name</label>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">FF</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* What should Claude call you */}
              <div className="max-w-xl mt-6">
                <label className="block text-sm font-medium mb-2">What should Claude call you?</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>

              {/* Work function */}
              <div className="max-w-xl mt-6">
                <label className="block text-sm font-medium mb-2">What best describes your work?</label>
                <select
                  value={workFunction}
                  onChange={(e) => setWorkFunction(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                >
                  <option value="">Select your work function</option>
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="manager">Manager</option>
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="marketer">Marketer</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Personal preferences */}
              <div className="max-w-xl mt-6">
                <label className="block text-sm font-medium mb-2">
                  What personal preferences should Claude consider in responses?
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Your preferences will apply to all conversations, within Anthropic's guidelines. Learn about preferences
                </p>
                <textarea
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="e.g. when learning new concepts, I find analogies particularly helpful"
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            {/* Account Information */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="font-medium text-base mb-4">Account Information</h3>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">Your email for login and notifications</p>
                </div>

                <button
                  onClick={handleSaveGeneral}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-all font-medium flex items-center gap-2"
                >
                  {saved ? (
                    <>
                      <Check size={16} />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Security */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="font-medium text-base mb-4">Security</h3>

              {/* Change Password */}
              <div className="mb-6 max-w-xl">
                <h4 className="font-medium text-sm mb-3 text-gray-400">Change Password</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all pr-10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleChangePassword}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-all font-medium flex items-center gap-2"
                  >
                    <Key size={16} />
                    Update Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="border-t border-gray-800/50 pt-6 max-w-xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">Two-Factor Authentication (2FA)</h4>
                    <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleEnable2FA}
                    className={`px-4 py-2 text-sm rounded-lg transition-all font-medium ml-4 ${
                      twoFactorEnabled
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 text-gray-300'
                    }`}
                  >
                    {twoFactorEnabled ? 'Enabled ✓' : 'Enable 2FA'}
                  </button>
                </div>
                {twoFactorEnabled && (
                  <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-xs text-green-400 leading-relaxed">
                      ✓ Two-factor authentication is active. You'll need your authenticator app to log in.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
              <h3 className="font-medium text-base text-red-400 mb-4">Danger Zone</h3>
              <div className="max-w-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-red-400 mb-1">Delete Account</p>
                    <p className="text-xs text-gray-500">Permanently delete your account and all associated data</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-all font-medium ml-4"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            {/* Compare Plans */}
            <div>
              <h3 className="font-medium text-lg mb-4">Choose Your Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => {
                  const PlanIcon = plan.icon;
                  const isCurrentPlan = currentPlan === plan.id;

                  return (
                    <div
                      key={plan.id}
                      className={`
                        relative bg-gray-900/50 border rounded-lg p-6 transition-all
                        ${isCurrentPlan
                          ? 'border-blue-500 ring-2 ring-blue-500/20'
                          : 'border-gray-800 hover:border-gray-700'
                        }
                      `}
                    >
                      {/* Popular Badge */}
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-full">
                            Popular
                          </span>
                        </div>
                      )}

                      {/* Current Plan Badge */}
                      {isCurrentPlan && (
                        <div className="absolute top-4 right-4">
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded border border-green-500/30">
                            Current
                          </span>
                        </div>
                      )}

                      {/* Icon */}
                      <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-lg flex items-center justify-center mb-4`}>
                        <PlanIcon className="text-white" size={24} />
                      </div>

                      {/* Plan Name & Price */}
                      <h4 className="font-semibold text-xl mb-1">{plan.name}</h4>
                      <p className="text-sm text-gray-400 mb-4">{plan.description}</p>

                      <div className="mb-6">
                        <span className="text-3xl font-bold">${plan.price}</span>
                        <span className="text-sm text-gray-500">/month</span>
                      </div>

                      {/* Features */}
                      <div className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Check size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      {isCurrentPlan ? (
                        <button
                          type="button"
                          disabled
                          className="w-full py-2 bg-gray-800 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
                        >
                          Current Plan
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCurrentPlan(plan.id)}
                          className={`
                            w-full py-2 rounded-lg text-sm font-medium transition-all
                            ${plan.id === 'max'
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }
                          `}
                        >
                          {plan.price === 0 ? 'Downgrade to Free' :
                           currentPlan === 'free' ? 'Upgrade to ' + plan.name :
                           plan.price < plans.find(p => p.id === currentPlan)?.price ? 'Downgrade' : 'Upgrade'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Billing Information */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="font-medium text-base mb-4">Billing Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Next billing date</span>
                  <span className="font-medium">November 29, 2025</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Payment method</span>
                  <span className="font-medium">•••• •••• •••• 4242</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Billing email</span>
                  <span className="font-medium">{email}</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-all font-medium"
              >
                Update Payment Method
              </button>
            </div>

            {/* Billing History */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="font-medium text-base mb-4">Billing History</h3>
              <div className="space-y-2">
                {[
                  { date: 'Oct 29, 2025', amount: '$29.00', status: 'Paid' },
                  { date: 'Sep 29, 2025', amount: '$29.00', status: 'Paid' },
                  { date: 'Aug 29, 2025', amount: '$29.00', status: 'Paid' },
                ].map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-800/50">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{invoice.date}</p>
                        <p className="text-xs text-gray-500">Max Plan</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{invoice.amount}</span>
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Usage Tab */}
        {activeTab === 'usage' && (
          <div className="space-y-6">
            {/* Current Usage */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="font-medium text-base mb-4">Current Usage</h3>

              {/* Websites */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Active Websites</span>
                  <span className="text-sm font-medium">3 / ∞</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Unlimited websites on Max Plan</p>
              </div>

              {/* Chat Messages */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">AI Chat Messages</span>
                  <span className="text-sm font-medium">1,247 / ∞</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Unlimited AI messages on Max Plan</p>
              </div>

              {/* Storage */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Storage Used</span>
                  <span className="text-sm font-medium">456 MB / 10 GB</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '4.56%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">10 GB storage included</p>
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="font-medium text-base mb-4">This Month's Activity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Page Views</span>
                  </div>
                  <p className="text-2xl font-bold">24,531</p>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Unique Visitors</span>
                  </div>
                  <p className="text-2xl font-bold">8,124</p>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">AI Conversations</span>
                  </div>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Leads Collected</span>
                  </div>
                  <p className="text-2xl font-bold">342</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
