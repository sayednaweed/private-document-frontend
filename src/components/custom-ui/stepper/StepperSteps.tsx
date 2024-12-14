import { memo, useEffect, useRef, useState } from "react";

export interface IStepperProps {
  steps: {
    description: string;
    icon: any;
  }[];
  currentStep: number;
  progressText: {
    complete: string;
    inProgress: string;
    pending: string;
    step: string;
  };
  isCardActive?: boolean;
}
function StepperSteps(props: IStepperProps) {
  const [newStep, setNewStep] = useState<any>([]);
  const stepRef = useRef<any>();
  const { steps, currentStep, progressText, isCardActive } = props;
  const updateStep = (stepNumber: number, steps: any) => {
    const newSteps = [...steps];
    let count = 0;
    while (count < newSteps.length) {
      // current step
      if (count == stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: true,
          selected: true,
          completed: false,
        };
        count++;
      }
      // step completed
      else if (count < stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: false,
          selected: true,
          completed: true,
        };
        count++;
      } else {
        // Step pending
        newSteps[count] = {
          ...newSteps[count],
          highlighted: false,
          selected: false,
          completed: false,
        };
        count++;
      }
    }
    return newSteps;
  };
  useEffect(() => {
    const stepsState = steps.map((step: any, index: number) =>
      Object.assign(
        {},
        {
          description: step.description,
          icon: step.icon,
          completed: false,
          highlighted: index == 0 ? true : false,
          selected: index == 0 ? true : false,
        }
      )
    );

    stepRef.current = stepsState;
    const current = updateStep(currentStep - 1, stepRef.current);
    setNewStep(current);
  }, [steps, currentStep]);

  const displaySteps = newStep.map((step: any, index: number) => {
    const markFinalStep = steps.length == currentStep && step.selected;

    return (
      <div
        key={index}
        className={` ${
          index != newStep.length - 1
            ? "w-full flex items-center"
            : "flex items-center"
        }`}
      >
        <div className="relative flex flex-col items-start gap-y-1 text-teal-600">
          {/* Display number */}
          <div
            className={`rounded-full transition duration-500 ease-in-out border-2 h-8 w-8 flex items-center justify-center ${
              markFinalStep
                ? "bg-green-600 text-white font-bold border"
                : step.highlighted
                ? "bg-purple-600 ring-1 ring-purple-600 text-white font-bold border"
                : step.selected && "bg-green-600 text-white font-bold border"
            }`}
          >
            {markFinalStep || step.completed ? (
              <span className=" text-white font-bold text-[16px] rtl:pt-1">
                &#10003;
              </span>
            ) : (
              step.icon
            )}
          </div>
          {/* Display description */}
          <div
            className={`${
              step.completed || step.highlighted
                ? "text-primary"
                : "text-gray-400"
            } ${
              step.highlighted && "!visible"
            } invisible sm:visible absolute top-[6px] mt-11 text-start line-clamp-1 w-32 rtl:text-xl-rtl ltr:text-lg-ltr font-semibold capitalize`}
          >
            {step.description}
          </div>
          <h1 className="rtl:text-sm-rtl ltr:text-[10px] absolute rtl:top-8 ltr:top-9 text-primary/80 font-bold">
            {`${progressText.step} ${index + 1}`}
          </h1>
          <div
            className={`${
              markFinalStep || step.completed
                ? "border-green-600"
                : step.highlighted
                ? "text-purple-600"
                : " text-gray-400"
            } ${
              step.highlighted && "!visible"
            } invisible sm:visible absolute ltr:top-[26px] rtl:top-[29px] mt-11 text-start line-clamp-1 w-32 rtl:text-lg-rtl ltr:text-md-ltr capitalize`}
          >
            {markFinalStep || step.completed
              ? progressText.complete
              : step.highlighted
              ? progressText.inProgress
              : progressText.pending}
          </div>
        </div>
        {/* Display line */}
        <div
          className={`${
            step.highlighted
              ? "border-purple-600"
              : step.completed
              ? "border-green-600"
              : " border-t-gray-300"
          } flex-auto sm:mx-2 md:mx-6 border-t-2 transition duration-500 ease-in-out`}
        />
      </div>
    );
  });

  return (
    <div
      className={`${
        isCardActive
          ? "bg-card mb-[3px] h-[116px] border border-primary/10 dark:border-primary/20 rounded-md"
          : "mx-4"
      } p-4 flex justify-between items-start`}
    >
      {displaySteps}
    </div>
  );
}

export default memo(StepperSteps);
