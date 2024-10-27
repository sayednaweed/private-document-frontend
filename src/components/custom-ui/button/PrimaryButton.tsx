import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";

export interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (props, ref: any) => {
    const { className, children } = props;
    return (
      <Button
        {...props}
        ref={ref}
        size="sm"
        className={cn(
          `bg-primary rtl:font-semibold rtl:text-xl-rtl ltr:text-lg-ltr hover:shadow transition w-fit text-primary-foreground/80 shadow-md rounded-md shadow-primary/50 px-5 duration-200 ease-linear hover:bg-primary hover:opacity-90 hover:text-primary-foreground`,
          className
        )}
      >
        {children}
      </Button>
    );
  }
);
export default PrimaryButton;
