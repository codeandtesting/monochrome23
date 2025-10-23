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
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-gray-400">Manage your account and security settings</p>
      </div>

      {/* Account Information */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="text-blue-400" size={20} />
          <h3 className="font-semibold text-lg">Account Information</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Your email for login and notifications</p>
          </div>

          <button
            onClick={handleSaveAccount}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            {saved ? (
              <>
                <Check size={18} />
                Saved!
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="text-green-400" size={20} />
          <h3 className="font-semibold text-lg">Security</h3>
        </div>

        {/* Change Password */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Change Password</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  placeholder="Enter current password"
                />
                <button
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
            </div>

            <button
              onClick={handleChangePassword}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <Key size={18} />
              Update Password
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium mb-1">Two-Factor Authentication (2FA)</h4>
              <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
            </div>
            <button
              onClick={handleEnable2FA}
              className={`px-6 py-2.5 rounded-lg transition-colors font-medium ${
                twoFactorEnabled
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              {twoFactorEnabled ? 'Enabled ✓' : 'Enable 2FA'}
            </button>
          </div>
          {twoFactorEnabled && (
            <div className="mt-4 bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg p-4">
              <p className="text-sm text-green-400">
                ✓ Two-factor authentication is active. You'll need your authenticator app to log in.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="text-purple-400" size={20} />
          <h3 className="font-semibold text-lg">Notifications</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-400">Receive updates and news via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Lead Alerts</p>
              <p className="text-sm text-gray-400">Get notified when you receive new leads</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={leadNotifications}
                onChange={(e) => setLeadNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="text-red-400" size={20} />
          <h3 className="font-semibold text-lg text-red-400">Danger Zone</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-400">Delete Account</p>
              <p className="text-sm text-gray-400">Permanently delete your account and all associated data</p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
