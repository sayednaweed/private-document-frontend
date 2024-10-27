import { useEffect, useState } from "react";
import AnimatedNumber from "./AnimatedNumber";
import Card from "./Card";
import { cn } from "@/lib/utils";
import Shimmer from "../shimmer/Shimmer";
import ShimmerItem from "../shimmer/ShimmerItem";

export interface DashboardCardProps {
  title: string;
  description: string;
  className?: string;
  value: number;
  symbol?: string;
  icon: any;
}

export default function DashboardCard(props: DashboardCardProps) {
  const { value, title, symbol, icon, className, description } = props;
  const [loading, setLoading] = useState(true);
  const sleep = async (seconds: number) =>
    new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  const loadData = async () => {
    // Do data loading operation
    await sleep(3);
    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, []);
  return loading ? (
    <Shimmer className="flex-1 space-y-2 p-4 h-full overflow-hidden">
      <ShimmerItem className="font-bold ml-1 mt-1 pl-1 w-1/2 rounded-[5px]" />
      <ShimmerItem className="ml-1 mt-1 pl-1 w-1/3 rounded-[5px]" />
      <ShimmerItem className=" pl-1 mt-8 mb-1 w-full h-[64px] animate-none rounded-[5px]" />
    </Shimmer>
  ) : (
    <Card className={cn("", className)}>
      <h1 className=" font-semibold">{title}</h1>
      <AnimatedNumber
        className="font-bold px-2"
        min={0}
        symbol={symbol}
        max={value}
      />
      <h1 className="text-[13px] text-primary/85 pt-8">{description}</h1>
      {icon}
    </Card>
  );
}
