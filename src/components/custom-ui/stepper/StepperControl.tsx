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
  isCardActive?: boolean;
  handleClick: (direction: string) => void;
}
function StepperControl(props: IStepperControlProps) {
  const {
    steps,
    currentStep,
    handleClick,
    backText,
    nextText,
    confirmText,
    isCardActive,
  } = props;
  return (
    <div
      className={`${
        isCardActive &&
        "mt-[3px] rounded-md bg-card py-4 border border-primary/10 dark:border-primary/20"
      } container flex justify-around mb-4 text-[13px]`}
    >
      {/* Back Button */}
      <button
        onClick={() => {
          if (currentStep != 1) handleClick("back");
        }}
        className={`${
          currentStep == 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:shadow shadow-md shadow-primary/50 hover:text-primary-foreground"
        } bg-primary rounded-md transition text-[14px] font-semibold w-fit text-primary-foreground/80 px-4 py-2 hover:bg-primary`}
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
