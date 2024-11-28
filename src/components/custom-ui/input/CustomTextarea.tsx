import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React from "react";

export interface CustomTextareaProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  requiredHint?: string;
  lable?: string;
  parantClassName?: string;
  errorMessage?: string;
}
const CustomTextarea = React.forwardRef<
  HTMLTextAreaElement,
  CustomTextareaProps
>((props, ref: any) => {
  const {
    className,
    type,
    requiredHint,
    errorMessage,
    required,
    lable,
    parantClassName,
    ...rest
  } = props;
  return (
    <div>
      <div
        className={cn(
          `relative ${required || lable ? "mt-[20px]" : "mt-2"}`,
          parantClassName
        )}
      >
        {required && (
          <span className="text-red-600 rtl:text-[13px] ltr:text-[11px] ltr:right-[10px] rtl:left-[10px] -top-[17px] absolute font-semibold">
            {requiredHint}
          </span>
        )}
        {lable && (
          <span className="rtl:text-lg-rtl ltr:text-xl-ltr rtl:right-[4px] ltr:left-[4px] ltr:-top-[22px] rtl:-top-[24px] absolute font-semibold">
            {lable}
          </span>
        )}

        <Textarea
          ref={ref}
          className={cn(
            `focus-visible:ring-0 rtl:text-lg-rtl ltr:text-lg-ltr ${
              errorMessage && "border-red-400 border"
            }`,
            className
          )}
          {...rest}
          id={lable}
        />
      </div>
      {errorMessage && (
        <h1 className="rtl:text-sm-rtl ltr:text-sm-ltr capitalize text-start text-red-400">
          {errorMessage}
        </h1>
      )}
    </div>
  );
});

export default CustomTextarea;
