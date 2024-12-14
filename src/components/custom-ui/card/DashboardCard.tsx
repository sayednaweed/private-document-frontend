import AnimatedNumber from "./AnimatedNumber";
import Card from "./Card";
import { cn } from "@/lib/utils";

export interface DashboardCardProps {
  title: string;
  description: string;
  className?: string;
  value: number;
  symbol?: string;
  icon: any;
  loading: boolean;
}

export default function DashboardCard(props: DashboardCardProps) {
  const { value, title, symbol, icon, className, description } = props;
  return (
    <Card className={cn("", className)}>
      <h1 className="font-semibold">{title}</h1>
      <AnimatedNumber
        className="font-bold px-2 text-orange-500"
        min={0}
        symbol={symbol}
        max={value}
      />
      <h1 className="text-[13px] text-primary/85 pt-8">{description}</h1>
      {icon}
    </Card>
  );
}
