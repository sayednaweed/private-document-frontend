import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export interface AnimatedNumberProps
  extends React.HTMLAttributes<HTMLDivElement> {
  min: number;
  max: number;
  symbol?: string;
}
const AnimatedNumber = (props: AnimatedNumberProps) => {
  const { min, max, symbol, className } = props;
  const [number, setNumber] = useState(0);
  const timerId: any = [];
  const counter = (minimum: number, maximum: number) => {
    for (let count = minimum; count <= maximum; count++) {
      timerId.push(
        setTimeout(() => {
          setNumber(count);
        }, (count * 80) / 1.5)
      );
    }
  };
  useEffect(() => {
    counter(min, max);
    // To cancel the timer
    return () => {
      for (let id = 0; id < timerId.length; id++) {
        clearTimeout(timerId[id]);
      }
    };
  }, []);

  return (
    <h1 className={cn("font-bold", className)}>
      {number}
      {symbol}
    </h1>
  );
};
export default AnimatedNumber;
