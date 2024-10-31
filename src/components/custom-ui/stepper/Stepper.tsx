import { validate } from "@/validation/validation";
import { Dispatch, SetStateAction, useState } from "react";
import { StepperContext } from "./StepperContext";
import StepperSteps from "./StepperSteps";
import StepperControl from "./StepperControl";
import { ComponentStep, StepperHeightSize, StepperSize } from "./types";
import { cn } from "@/lib/utils";
import NastranSpinner from "../spinner/NastranSpinner";

export interface IStepperProps {
  loadingText: string;
  backText: string;
  nextText: string;
  confirmText: string;
  steps: {
    description: string;
    icon: any;
  }[];
  components: ComponentStep[];
  beforeStepSuccess?: (
    userData: any,
    step: number,
    setError: Dispatch<SetStateAction<Map<string, string>>>
  ) => Promise<boolean>;
  stepsCompleted: (
    userData: any[],
    setError: Dispatch<SetStateAction<Map<string, string>>>
  ) => Promise<boolean>;
  className?: string;
  size?: StepperSize;
  heightsize?: StepperHeightSize;
  progressText: {
    complete: string;
    inProgress: string;
    pending: string;
    step: string;
  };
  isCardActive?: boolean;
}

export default function Stepper(props: IStepperProps) {
  const {
    steps,
    loadingText,
    components,
    beforeStepSuccess,
    stepsCompleted,
    className,
    size,
    heightsize,
    backText,
    nextText,
    confirmText,
    progressText,
    isCardActive,
  } = props;
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<any>([]);
  const [error, setError] = useState<Map<string, string>>(new Map());
  const validationSuccess = (step: number) =>
    validate(components[step - 1].validationRules, userData, setError);

  const displayStep = (step: number) => components[step - 1].component;

  const handleDirection = async (direction: string) => {
    if (direction == "again") {
      setCurrentStep(1);
      return;
    }
    let newStep = currentStep;

    if (direction == "next") {
      if (false == (await validationSuccess(currentStep))) {
        return;
      }
      newStep++;
    } else newStep--;
    if (newStep === steps.length) {
      setUserData({ ...userData, ["complete"]: false });
      const complete = await stepsCompleted(userData, setError);
      setUserData({ ...userData, complete: true });
      if (!complete) return;
    }
    // For performance reason
    if (beforeStepSuccess) {
      // Send data to user in each step
      setUserData({ ...userData, ["complete"]: false });
      const complete = await beforeStepSuccess(userData, currentStep, setError);
      setUserData({ ...userData, complete: true });
      if (!complete) return;
    }

    newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
  };
  return (
    <div
      className={cn(
        "w-full rounded-2xl pb-2 bg-white/40 dark:!bg-black/30",
        className
      )}
    >
      {/* Stepper */}
      <div className={`${!isCardActive && "mt-4 sm:container"}`}>
        <StepperSteps
          isCardActive={isCardActive}
          progressText={progressText}
          steps={steps}
          currentStep={currentStep}
        />
        {/* Display components */}
        <div
          className={`container overflow-y-auto ${
            isCardActive
              ? "bg-card rounded-md border border-primary/10 dark:border-primary/20"
              : "mb-4 mt-12"
          } ${
            size === "wrap-height"
              ? " h-fit pt-6 pb-12"
              : size === "sm"
              ? "max-h-[40vh] min-h-[40vh]"
              : size === "md"
              ? "max-h-[50vh] min-h-[60vh]"
              : size === "lg"
              ? "max-h-[65vh] min-h-[65vh]"
              : "max-h-[60vh] min-h-[60vh]"
          }`}
          style={{
            minHeight: heightsize == "wrap-height" ? "fit-content" : undefined,
          }}
        >
          <StepperContext.Provider
            value={{
              userData,
              setUserData,
              handleDirection,
              error,
            }}
          >
            {userData?.complete == false ? (
              <NastranSpinner label={`${loadingText}...`} className="mt-20" />
            ) : (
              displayStep(currentStep)
            )}
          </StepperContext.Provider>
        </div>
      </div>
      {/* StepperControl */}
      {currentStep != steps.length && (
        <StepperControl
          isCardActive={isCardActive}
          backText={backText}
          nextText={nextText}
          confirmText={confirmText}
          handleClick={handleDirection}
          currentStep={currentStep}
          steps={steps}
        />
      )}
    </div>
  );
}
