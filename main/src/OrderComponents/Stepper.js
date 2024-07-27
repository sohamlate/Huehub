import React from 'react';

const Stepper = ({ steps, currentStep }) => {
  const calculateProgressWidth = () => {
    return (currentStep / (steps.length - 1)) * 100;
  };

  return (
    <div className="relative mb-8">
      <div className="flex justify-between items-center mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 text-center">
            <div
              className={`flex items-center justify-center rounded-full w-8 h-8 border  ${
                index <= currentStep ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-400 bg-white text-gray-400'
              }`}
            >
              {index + 1}
            </div>
            <div className={`mt-2  ${index <= currentStep ? 'font-semibold text-blue-600' : 'text-gray-400'}`}>
              {step}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute left-0 top-4 w-full h-1 z-0 bg-gray-200">
        <div
          className="h-1 bg-blue-600"
          style={{ width: `${calculateProgressWidth()}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Stepper;
