import { cn } from "@/lib/utils";
import * as React from "react";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref: any) => {
    const { className, children, disabled } = props;
    return (
      <button
        {...props}
        ref={ref}
        className={cn(
          `w-fit flex items-center select-none gap-x-1 border rounded-md px-[6px] py-[1px] cursor-pointer ${
            disabled && "cursor-not-allowed"
          }`,
          className
        )}
      >
        {children}
      </button>
    );
  }
);
export default IconButton;
