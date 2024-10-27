import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import React from "react";

export interface CustomCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange: any;
  checked: boolean;
  text?: string;
  description?: string;
  requiredHint?: string;
  errorMessage?: string;
  parentClassName?: string;
}
const CustomCheckbox = React.forwardRef<HTMLInputElement, CustomCheckboxProps>(
  (props, ref: any) => {
    const {
      onCheckedChange,
      required,
      checked,
      text,
      description,
      className,
      requiredHint,
      errorMessage,
      readOnly,
      parentClassName,
    } = props;
    const error = errorMessage != undefined;
    return (
      <div>
        {required && (
          <h1 className="text-red-600 w-full px-3 text-end rtl:text-[13px] ltr:text-[11px] font-semibold">
            {requiredHint}
          </h1>
        )}
        <div
          className={`flex items-center space-x-2 ${parentClassName} ${
            error && "border-red-400 border"
          }`}
        >
          <Checkbox
            checked={checked}
            disabled={readOnly}
            className={cn("border-primary/70", className)}
            id="terms"
            ref={ref}
            onCheckedChange={(value: boolean) => {
              if (!readOnly) onCheckedChange(value);
            }}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {text && (
              <h1 className="text-start rtl:pr-1 rtl:text-lg-rtl ltr:text-lg-ltr font-semibold">
                {text}
              </h1>
            )}
            {description && (
              <h1 className="text-start rtl:pr-1 rtl:text-lg-rtl ltr:text-md-ltr pt-[2px] ltr:leading-3 rtl:leading-5 text-primary/80">
                {description}
              </h1>
            )}
          </label>
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

export default CustomCheckbox;
