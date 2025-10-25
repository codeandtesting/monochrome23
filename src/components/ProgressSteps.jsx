import React from 'react';
import { Check } from 'lucide-react';

export default function ProgressSteps({ currentStep, totalSteps, steps }) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      {/* Step Labels */}
      <div className="flex justify-between mb-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`text-xs font-normal transition-all duration-300 ${
              index + 1 <= currentStep
                ? 'text-blue-400'
                : 'text-gray-600'
            }`}
          >
            {step}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            {/* Step Circle */}
            <div className="relative flex-shrink-0">
              {index + 1 < currentStep ? (
                // Completed step
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/40">
                  <Check size={14} className="text-green-400" />
                </div>
              ) : index + 1 === currentStep ? (
                // Current step
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-blue-500/50">
                  <span className="text-blue-400 font-medium text-sm">{index + 1}</span>
                </div>
              ) : (
                // Future step
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                  <span className="text-gray-600 font-medium text-sm">{index + 1}</span>
                </div>
              )}
            </div>

            {/* Connector Line */}
            {index < totalSteps - 1 && (
              <div className="flex-1 h-0.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    index + 1 < currentStep
                      ? 'w-full bg-gradient-to-r from-green-500/60 to-emerald-500/60'
                      : 'w-0 bg-gray-700'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Description */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">
          Step <span className="text-blue-400 font-medium">{currentStep}</span> of {totalSteps}: <span className="text-gray-300">{steps[currentStep - 1]}</span>
        </p>
      </div>
    </div>
  );
}
