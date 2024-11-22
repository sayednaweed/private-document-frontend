import { Input } from "@/components/ui/input";
import { cn, isString } from "@/lib/utils";
import { Check, X } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
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
      defaultValue,
      onChange,
      ...rest
    } = props;
    const error = errorMessage != undefined;
    const [password, setPassword] = useState(defaultValue);
    const { t } = useTranslation();

    const checkStrength = (pass: string) => {
      const requirements = [
        { regex: /.{8,}/, text: "At least 8 characters" },
        { regex: /[0-9]/, text: "At least 1 number" },
        { regex: /[a-z]/, text: "At least 1 lowercase letter" },
        { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
      ];

      return requirements.map((req) => ({
        met: req.regex.test(pass),
        text: req.text,
      }));
    };

    const strength = checkStrength(isString(password) ? password : "");

    const strengthScore = useMemo(() => {
      return strength.filter((req) => req.met).length;
    }, [strength]);

    const getStrengthColor = (score: number) => {
      if (score === 0) return "bg-border";
      if (score <= 1) return "bg-red-500";
      if (score <= 2) return "bg-orange-500";
      if (score === 3) return "bg-amber-500";
      return "bg-emerald-500";
    };

    const getStrengthText = (score: number) => {
      if (score === 0) return t("Enter a password");
      if (score <= 2) return t("Weak password");
      if (score === 3) return t("Medium password");
      return t("Strong password");
    };
    console.log(password);
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
            onChange={(e: any) => {
              const { value } = e.target;
              setPassword(value);
              if (onChange) onChange(e);
            }}
            defaultValue={defaultValue}
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
            aria-invalid={strengthScore < 4}
            aria-describedby="password-strength"
            {...rest}
          />
        </div>
        {errorMessage && (
          <h1 className="rtl:text-sm-rtl ltr:text-sm-ltr capitalize text-start text-red-400">
            {errorMessage}
          </h1>
        )}
        {/* Password strength indicator */}
        <div
          className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-valuenow={strengthScore}
          aria-valuemin={0}
          aria-valuemax={4}
          aria-label="Password strength"
        >
          <div
            className={`h-full ${getStrengthColor(
              strengthScore
            )} transition-all duration-500 ease-out`}
            style={{ width: `${(strengthScore / 4) * 100}%` }}
          ></div>
        </div>

        {/* Password strength description */}
        <p
          id="password-strength"
          className="mb-2 text-sm font-medium text-foreground"
        >
          {getStrengthText(strengthScore)}. Must contain:
        </p>

        {/* Password requirements list */}
        <ul className="space-y-1.5" aria-label="Password requirements">
          {strength.map((req, index) => (
            <li key={index} className="flex items-center gap-2">
              {req.met ? (
                <Check
                  size={16}
                  className="text-emerald-500"
                  aria-hidden="true"
                />
              ) : (
                <X
                  size={16}
                  className="text-muted-foreground/80"
                  aria-hidden="true"
                />
              )}
              <span
                className={`text-xs ${
                  req.met ? "text-emerald-600" : "text-muted-foreground"
                }`}
              >
                {req.text}
                <span className="sr-only">
                  {req.met ? " - Requirement met" : " - Requirement not met"}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

export default PasswordInput;
