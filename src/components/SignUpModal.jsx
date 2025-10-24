import React, { useState } from 'react';
import { X, Mail, Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SignUpPage({ onComplete }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignUp = () => {
    // Hardcode: просто показываем успех
    alert('✅ Google sign-in successful! Welcome to Monochrome!');
    onComplete();
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (email !== confirmEmail) {
      setError('Email addresses do not match');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // Hardcode: симулируем отправку
    setTimeout(() => {
      alert(`✅ Registration successful!\n\nYour password has been sent to ${email}\n\nCheck your inbox and spam folder.`);
      setIsSubmitting(false);
      onComplete();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create Your Account</h1>
            <p className="text-sm text-gray-400">Step 4 of 4 • Registration</p>
          </div>
          <div className="w-8"></div> {/* Spacer for balance */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold">M</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Almost There!</h2>
            <p className="text-gray-400">
              Create your account to save your site and access the dashboard
            </p>
          </div>

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignUp}
            className="w-full mb-6 px-6 py-4 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-3 group"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.53-0.63 2.9-1.11 4.15H12c-3.09 0-5.93-1.97-7.41-4.75H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c0-.74.13-1.45.37-2.12H2.18v2.84C3.99 16.04 5.84 17.02 7.97 17.02c.48 0 .94-.08 1.38-.22v-2.84H6.33c-.58.96-1.36 1.7-2.3 2.12z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.15 3.15C7.16 7.04 8.6 5.38 12 5.38z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black text-gray-400">or</span>
            </div>
          </div>

          {/* Email Sign Up Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Confirm Email</label>
              <input
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-4 text-sm text-gray-300">
              <p className="flex items-start gap-3">
                <Mail size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <span>Your password will be automatically sent to your email</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email || !confirmEmail}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Skip option */}
          <button
            onClick={onComplete}
            className="w-full mt-6 text-center text-gray-500 hover:text-gray-300 transition-colors py-3"
          >
            Skip for now →
          </button>
        </div>
      </div>
    </div>
  );
}

