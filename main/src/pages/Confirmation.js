import React from "react";
import { useState } from "react";
import Stepper from "../OrderComponents/Stepper";
import StepperControl from "../OrderComponents/StepperControl";
import ShippingInfo from "../OrderComponents/Shippinginfo";
import PaymentInfo from "../OrderComponents/PaymentInfo";
import Finish from "../OrderComponents/Finish";
import { ImCross } from "react-icons/im";
const Confirmation = ({ user, cartItem, setBuyPage }) => {
  const steps = ["Shipping Info", "Payment Info", "Finish"];
  const [currentStep, setCurrentStep] = useState(0);
  const [formData,setFormData] = useState({});
  console.log(formData);
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  return (
    <div className="relative ">
      <div
        onClick={() => setBuyPage(false)}
        className="absolute -right-2 -top-2 bg-red-600 text-white p-2 rounded-full hover:scale-110 transition-all duration-150 z-40"
      >
        <ImCross />
      </div>
      <div className="bg-white overflow-y-scroll no-scrollbar p-3  rounded-md min-w-[280px] w-[40vw] h-[55vh] relative">
        <Stepper steps={steps} currentStep={currentStep} />
        {currentStep === 0 && <ShippingInfo user={user} formData={formData} setFormData={setFormData}/>}
        {currentStep === 1 && <PaymentInfo cartItem={cartItem} />}
        {currentStep === 2 && <Finish cartItem={cartItem} user={user} formData={formData}/>}
        <StepperControl
          className=" absolute bottom-0"
          handleNext={handleNext}
          handleBack={handleBack}
          currentStep={currentStep}
          steps={steps}
        />
      </div>
    </div>
  );
};

export default Confirmation;
