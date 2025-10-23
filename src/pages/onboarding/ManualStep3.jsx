import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Globe, Facebook, Instagram, Twitter, MessageCircle, Youtube } from 'lucide-react';

export default function ManualStep3() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState({
    phone: '',
    email: '',
    address: '',
    website: ''
  });
  
  const [social, setSocial] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    discord: '',
    youtube: ''
  });

  useEffect(() => {
    const savedContacts = localStorage.getItem('manual_step3_contacts');
    const savedSocial = localStorage.getItem('manual_step3_social');
    
    if (savedContacts) setContacts(JSON.parse(savedContacts));
    if (savedSocial) setSocial(JSON.parse(savedSocial));
  }, []);

  const handleContinue = () => {
    // At least one contact method is required
    if (!contacts.phone && !contacts.email && !contacts.address) {
      alert('Please provide at least one contact method (phone, email, or address)');
      return;
    }

    localStorage.setItem('manual_step3_contacts', JSON.stringify(contacts));
    localStorage.setItem('manual_step3_social', JSON.stringify(social));
    navigate('/onboarding/manual/step4');
  };

  const socialPlatforms = [
    { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/yourpage' },
    { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/yourpage' },
    { key: 'twitter', label: 'X (Twitter)', icon: Twitter, placeholder: 'https://twitter.com/yourpage' },
    { key: 'discord', label: 'Discord', icon: MessageCircle, placeholder: 'https://discord.gg/yourserver' },
    { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@yourchannel' }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Phone size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-2">How can clients reach you?</h2>
          <p className="text-gray-400">Step 3 of 4 • Contact Information</p>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-6">
          <h3 className="text-xl font-semibold mb-4">Contact Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Phone size={16} />
                Phone Number
              </label>
              <input
                type="tel"
                value={contacts.phone}
                onChange={(e) => setContacts({ ...contacts, phone: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 234 567 890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                value={contacts.email}
                onChange={(e) => setContacts({ ...contacts, email: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="contact@yourcompany.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin size={16} />
              Physical Address
            </label>
            <input
              type="text"
              value={contacts.address}
              onChange={(e) => setContacts({ ...contacts, address: e.target.value })}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 Main St, City, Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Globe size={16} />
              Website (Optional)
            </label>
            <input
              type="url"
              value={contacts.website}
              onChange={(e) => setContacts({ ...contacts, website: e.target.value })}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-1">Social Media</h3>
            <p className="text-sm text-gray-400">Optional - Connect your social profiles</p>
          </div>

          <div className="space-y-4">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <div key={platform.key}>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Icon size={16} />
                    {platform.label}
                  </label>
                  <input
                    type="url"
                    value={social[platform.key]}
                    onChange={(e) => setSocial({ ...social, [platform.key]: e.target.value })}
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={platform.placeholder}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            onClick={() => navigate('/onboarding/manual/step2')}
            className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!contacts.phone && !contacts.email && !contacts.address}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

