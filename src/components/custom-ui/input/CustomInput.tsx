import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";
export type NastranInputSize = "sm" | "md" | "lg" | undefined;

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startContent?: any;
  startContentDark?: boolean;
  requiredHint?: string;
  lable?: string;
  endContent?: any;
  errorMessage?: string;
  parentClassName?: string;
  size_: NastranInputSize;
}
const CustomInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref: any) => {
    const {
      className,
      type,
      requiredHint,
      startContent,
      startContentDark,
      endContent,
      parentClassName,
      size_,
      errorMessage,
      required,
      lable,
      ...rest
    } = props;
    const error = errorMessage != undefined;
    return (
      <div className={`${parentClassName}`}>
        <div
          className={`rtl:text-lg-rtl ltr:text-lg-ltr relative select-none h-fit ${
            required || lable ? "mt-[20px]" : "mt-2"
          } ${parentClassName}`}
        >
          {startContent && (
            <span
              className={`absolute flex items-center ${
                startContentDark
                  ? "h-full bg-primary w-[40px] pt-[2px] rtl:rounded-tr-md rtl:rounded-br-md ltr:rounded-tl-md ltr:rounded-bl-md"
                  : "top-[16px] ltr:left-[12px] rtl:right-[12px]"
              }`}
            >
              {startContent}
            </span>
          )}
          {endContent && (
            <span
              className={`absolute flex items-center ltr:right-[5px] rtl:left-[5px] top-[16px]`}
            >
              {endContent}
            </span>
          )}
          {required && (
            <span className="text-red-600 rtl:text-[13px] ltr:text-[11px] ltr:right-[10px] rtl:left-[10px] -top-[17px] absolute font-semibold">
              {requiredHint}
            </span>
          )}
          {lable && (
            <label
              htmlFor={lable}
              className="rtl:text-lg-rtl ltr:text-xl-ltr rtl:right-[4px] ltr:left-[4px] ltr:-top-[22px] rtl:-top-[24px] absolute font-semibold"
            >
              {lable}
            </label>
          )}

          <Input
            ref={ref}
            style={{
              height: "50px",
            }}
            className={cn(
              `focus-visible:ring-0 focus-visible:border-primary/30 focus-visible:ring-offset-0 ${
                startContent
                  ? "rtl:pr-[42px] ltr:ps-[42px]"
                  : "rtl:pr-[12px] ltr:ps-[12px]"
              } ${className} ${error && "border-red-400 border"}`,
              className
            )}
            type={type}
            {...rest}
          />
        </div>
        {errorMessage && (
          <h1 className="rtl:text-sm-rtl ltr:text-sm-ltr capitalize text-start text-red-400">
            {errorMessage}
          </h1>
        )}
      </div>
    );
  }
);

export default CustomInput;
