import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export interface AnimatedNumberProps
  extends React.HTMLAttributes<HTMLDivElement> {
  min: number;
  max: number | null; // Allow max to be null initially
  symbol?: string;
}
const AnimatedNumber = (props: AnimatedNumberProps) => {
  const { min, max, symbol, className } = props;
  const [number, setNumber] = useState(0);
  useEffect(() => {
    // Only start animation if max is not null
    if (max !== null) {
      let current = min;
      const totalSteps = max - min;
      const intervalDuration = 3000 / totalSteps; // Total animation time of 3000ms

      const step = () => {
        if (current <= max) {
          setNumber(current++);
        } else {
          clearInterval(timerId);
        }
      };

      const timerId = setInterval(step, intervalDuration);
      return () => clearInterval(timerId);
    }
  }, [min, max]);

  return (
    <div className={cn("font-bold", className)}>
      {number}
      {symbol}
    </div>
  );
};
export default AnimatedNumber;
