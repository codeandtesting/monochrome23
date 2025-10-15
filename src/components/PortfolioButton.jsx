import React from 'react';
import { Image } from 'lucide-react';

export default function PortfolioButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg text-sm font-medium"
    >
      <Image size={16} />
      View Portfolio
    </button>
  );
}


