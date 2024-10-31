import Card from "@/components/custom-ui/card/Card";
import AnimatedNumber from "./AnimatedNumber";
import Shimmer from "../shimmer/Shimmer";

export interface HeaderCardProps {
  loading?: boolean;
  title: string;
  total: number | null;
  description1: string;
  description2: string;
  icon: any;
}

export default function HeaderCard(props: HeaderCardProps) {
  const { loading, title, total, description1, description2, icon } = props;

  const skeleton = (
    <Card className="flex items-center justify-between max-w-[280px] w-[280px] p-4 rounded-md">
      <div className="flex-1 space-y-2">
        <h1 className="font-semibold rtl:text-2xl-rtl ltr:text-xl-ltr">
          {title}
        </h1>
        <Shimmer className="h-[24px] bg-primary/30 w-1/2 rounded-sm" />
        <Shimmer className="h-[24px] bg-primary/30 w-1/2 rounded-sm" />
      </div>
      {icon}
    </Card>
  );
  return loading ? (
    skeleton
  ) : (
    <Card className="flex items-center justify-between max-w-[280px] w-[280px] p-4 rounded-md">
      {/* Content */}
      <div className="space-y-2">
        <h1 className="font-semibold rtl:text-2xl-rtl ltr:text-xl-ltr">
          {title}
        </h1>
        {/* <h1 className="font-semibold rtl:text-xl-rtl ltr:text-xl-ltr">
          {total}
        </h1> */}
        <AnimatedNumber
          className="font-semibold rtl:text-xl-rtl ltr:text-xl-ltr"
          min={0}
          symbol={""}
          max={total}
        />
        <div className="text-primary/80 text-sm rtl:text-xl-rtl ltr:text-xl-ltr">
          {description1}
          <AnimatedNumber
            className="text-orange-500 inline-block px-1"
            min={0}
            symbol={""}
            max={total}
          />
          {description2}
        </div>
      </div>
      {/* Icon */}
      {icon}
    </Card>
  );
}
