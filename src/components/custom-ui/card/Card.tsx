import { cn } from "@/lib/utils";

export interface ICardProps {
  className?: string;
  children?: any;
}

export default function Card(props: ICardProps) {
  const { className, children } = props;
  return (
    <div
      className={cn(
        "[backdrop-filter:blur(10px)] border bg-white/80 dark:!bg-black/30 py-6 px-6 rounded-xl",
        className
      )}
    >
      {children}
    </div>
  );
}
