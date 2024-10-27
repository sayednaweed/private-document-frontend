import { cn } from "@/lib/utils";

export type ModelSize = "sm" | "md" | "lg" | "full";

export interface INastranCardProps {
  size: ModelSize;
  children?: any;
  className?: string;
}

export default function NastranCard(props: INastranCardProps) {
  const { children, size, className } = props;
  return (
    <div
      className={cn(
        `relative [backdrop-filter:blur(5px)] bg-secondary-background text-center w-[90%] flex flex-col rounded-[10px] ${
          size === "sm"
            ? "sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] 2xl:w-[20%]"
            : size === "md"
            ? "sm:w-[60%] xl:w-[50%] 2xl:w-[40%]"
            : size === "lg"
            ? "sm:w-[80%] xl:w-[85%] 2xl:w-[90%]"
            : "sm:w-[99%]"
        }`,
        className
      )}
    >
      {/* Header, Body & Footer */}
      {children}
    </div>
  );
}
