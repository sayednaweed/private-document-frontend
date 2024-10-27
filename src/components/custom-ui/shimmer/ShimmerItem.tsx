import { cn } from "@/lib/utils";

export interface ShimmerItemProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export default function ShimmerItem(props: ShimmerItemProps) {
  const { className, children } = props;
  return (
    <div
      className={cn(
        "bg-slate-200 dark:bg-secondary/70 h-[24px] rounded-[5px] animate-pulse",
        className
      )}
    >
      {children}
    </div>
  );
}
