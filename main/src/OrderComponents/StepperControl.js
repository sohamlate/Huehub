import React from 'react';

const StepperControl = ({ handleNext, handleBack, currentStep, steps }) => {
  return (
    <div className="flex justify-between ">
      <button onClick={handleBack} disabled={currentStep === 0} className="bg-gray-300 text-gray-700 py-2 px-4 rounded disabled:opacity-50">
        Back
      </button>
      <button onClick={handleNext} disabled={currentStep === steps.length - 1} className="bg-blue-600 text-white py-2 px-4 rounded">
        {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
      </button>
    </div>
  );
};

export default StepperControl;
