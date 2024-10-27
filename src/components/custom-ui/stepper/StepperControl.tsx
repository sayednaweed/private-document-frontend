import { memo } from "react";

export interface IStepperControlProps {
  backText: string;
  nextText: string;
  confirmText: string;
  steps: {
    description: string;
    icon: any;
  }[];
  currentStep: number;
  handleClick: (direction: string) => void;
}
function StepperControl(props: IStepperControlProps) {
  const { steps, currentStep, handleClick, backText, nextText, confirmText } =
    props;
  return (
    <div className="container flex justify-around mb-4 text-[13px]">
      {/* Back Button */}
      <button
        onClick={() => {
          if (currentStep != 1) handleClick("back");
        }}
        className={`${
          currentStep == 1 && "opacity-50 cursor-not-allowed"
        } bg-primary rounded-md hover:shadow transition text-[14px] font-semibold w-fit text-primary-foreground/80 shadow-md shadow-primary/50 px-4 py-2 hover:bg-primary hover:text-primary-foreground`}
      >
        {backText}
      </button>
      {/* Next Button */}
      <button
        onClick={() => handleClick("next")}
        className="bg-green-500 hover:shadow transition text-[14px] font-semibold w-fit text-primary-foreground/80 shadow-md rounded-md shadow-primary/50 dark:shadow-green-400/50 px-4 py-2 hover:bg-green-500 hover:text-primary-foreground"
      >
        {currentStep == steps.length - 1 ? confirmText : nextText}
      </button>
    </div>
  );
}
export default memo(StepperControl);
