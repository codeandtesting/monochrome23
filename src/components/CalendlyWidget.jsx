import React from 'react';
import { InlineWidget } from 'react-calendly';

export default function CalendlyWidget() {
  return (
    <div className="my-4">
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-300">
            <span className="text-xl">📅</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Schedule a Call</h3>
            <p className="text-gray-400 text-xs">Choose a convenient time for consultation</p>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden max-h-[500px] overflow-y-auto bg-gray-900">
          <InlineWidget
            url="https://calendly.com/uberwho/30min"
            styles={{
              height: '480px',
              minWidth: '320px',
            }}
            pageSettings={{
              backgroundColor: '1f2937',
              hideEventTypeDetails: true,
              hideLandingPageDetails: true,
              primaryColor: 'ffffff',
              textColor: 'e5e7eb'
            }}
          />
        </div>
      </div>
    </div>
  );
}

