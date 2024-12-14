import { motion } from "framer-motion";
import PrimaryButton from "../button/PrimaryButton";
import { useContext } from "react";
import { StepperContext } from "./StepperContext";

export interface ICompleteStepProps {
  description: string;
  successText: string;
  closeText: string;
  againText: string;
  closeModel: () => void;
}

export default function CompleteStep(props: ICompleteStepProps) {
  const { handleDirection, setUserData } = useContext(StepperContext);
  const { description, closeModel, closeText, againText, successText } = props;
  return (
    <div className="flex flex-col items-center mt-8">
      <div
        className={`rounded-full transition duration-500 ease-in-out border-2 size-[80px] flex items-center justify-center py-3 bg-green-600 text-white font-bold border-green-600`}
      >
        {/* <span className=" text-white font-bold text-[32px]">&#10003;</span> */}
        <svg width="45px" height="43px" viewBox="0 0 130 85">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              repeat: 0,
              repeatType: "loop",
              repeatDelay: 0,
            }}
            strokeWidth={20}
            strokeLinecap="round"
            className=" fill-none stroke-white z-50"
            d="M10,50 l25,40 l85,-90"
          />
        </svg>
      </div>
      <h1 className="text-green-600 rtl:text-[24px] ltr:text-lg-ltr font-semibold uppercase mt-4">
        {successText}
      </h1>
      <h1 className="rtl:text-3xl-rtl font-medium text-primary ltr:text-lg-ltr">
        {description}
      </h1>
      <PrimaryButton
        className="rounded-md mt-14 shadow-md rtl:text-2xl-rtl bg-red-500 hover:bg-red-500"
        onClick={closeModel}
      >
        {closeText}
      </PrimaryButton>
      <PrimaryButton
        className="rounded-md mt-4 shadow-md rtl:text-2xl-rtl"
        onClick={() => {
          setUserData([]);
          handleDirection("again");
        }}
      >
        {againText}
      </PrimaryButton>
    </div>
  );
}
