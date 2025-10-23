import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, PenTool } from 'lucide-react';

export default function ChooseMethod() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-2xl font-bold">M</span>
        </div>
        <span className="text-2xl font-bold">Monochrome</span>
      </div>

      {/* Title */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          How would you like to create your site?
        </h1>
        <p className="text-lg text-gray-300">
          Choose your preferred method to build your website
        </p>
      </div>

      {/* Method Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* AI Wizard */}
        <button
          onClick={() => navigate('/onboarding/ai-wizard/step1')}
          className="group relative bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-2 border-purple-500/50 rounded-2xl p-8 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-left"
        >
          <div className="mb-6 w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Wand2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">AI Wizard</h2>
          <p className="text-gray-300 mb-4">
            Let AI create your site in seconds. Just answer a few questions and we'll build everything for you.
          </p>
          <div className="flex items-center gap-2 text-purple-400 font-semibold">
            <span>Start AI Wizard</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
          <div className="absolute top-4 right-4 px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
            RECOMMENDED
          </div>
        </button>

        {/* Manual */}
        <button
          onClick={() => navigate('/onboarding/manual/step1')}
          className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-2 border-gray-700 rounded-2xl p-8 hover:border-gray-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-left"
        >
          <div className="mb-6 w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
            <PenTool className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Manual Setup</h2>
          <p className="text-gray-300 mb-4">
            Prefer full control? Set up your site manually with step-by-step guidance.
          </p>
          <div className="flex items-center gap-2 text-gray-300 font-semibold">
            <span>Manual Setup</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/onboarding')}
        className="mt-8 text-gray-500 hover:text-gray-300 transition-colors text-sm"
      >
        ← Back
      </button>
    </div>
  );
}

