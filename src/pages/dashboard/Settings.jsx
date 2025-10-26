import React, { useState } from 'react';
import { Save, Shield, Key, Mail, User, Bell, Trash2, Check, Eye, EyeOff } from 'lucide-react';

export default function Settings() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [leadNotifications, setLeadNotifications] = useState(true);
  
  const [saved, setSaved] = useState(false);

  const handleSaveAccount = () => {
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
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1">Account Settings</h1>
        <p className="text-sm text-gray-500">Manage your account and security settings</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column */}
        <div className="space-y-5">
          {/* Account Information */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <User className="text-blue-400" size={16} />
          </div>
          <h3 className="font-medium text-base">Account Information</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1.5 text-gray-500">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-gray-500">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
            <p className="text-xs text-gray-600 mt-1">Your email for login and notifications</p>
          </div>

          <button
            onClick={handleSaveAccount}
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

          {/* Notifications */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Bell className="text-purple-400" size={16} />
          </div>
          <h3 className="font-medium text-base">Notifications</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-800/50">
            <div>
              <p className="font-medium text-sm">Email Notifications</p>
              <p className="text-xs text-gray-500">Receive updates and news via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-800/50">
            <div>
              <p className="font-medium text-sm">New Lead Alerts</p>
              <p className="text-xs text-gray-500">Get notified when you receive new leads</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={leadNotifications}
                onChange={(e) => setLeadNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Security */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Shield className="text-green-400" size={16} />
          </div>
          <h3 className="font-medium text-base">Security</h3>
        </div>

        {/* Change Password */}
        <div className="mb-5">
          <h4 className="font-medium text-sm mb-3 text-gray-400">Change Password</h4>
          <div className="space-y-2.5">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-500">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all pr-10"
                  placeholder="Enter current password"
                />
                <button
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-500">New Password</label>
              <input
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-500">Confirm New Password</label>
              <input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="Confirm new password"
              />
            </div>

            <button
              onClick={handleChangePassword}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-all font-medium flex items-center gap-2 mt-1"
            >
              <Key size={16} />
              Update Password
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="border-t border-gray-800/50 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm mb-0.5">Two-Factor Authentication (2FA)</h4>
              <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <button
              onClick={handleEnable2FA}
              className={`px-4 py-1.5 text-sm rounded-lg transition-all font-medium ${
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
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
            <Trash2 className="text-red-400" size={16} />
          </div>
          <h3 className="font-medium text-base text-red-400">Danger Zone</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-500/5 rounded-lg border border-red-500/10">
            <div>
              <p className="font-medium text-sm text-red-400">Delete Account</p>
              <p className="text-xs text-gray-500">Permanently delete your account and all associated data</p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-all font-medium"
            >
              Delete Account
            </button>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
