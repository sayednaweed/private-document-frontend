import Card from "@/components/custom-ui/card/Card";

export interface HeaderCardProps {
  title: string;
  total: string;
  description1: string;
  description2: string;
  icon: any;
}

export default function HeaderCard(props: HeaderCardProps) {
  const { title, total, description1, description2, icon } = props;
  return (
    <Card className="flex items-center justify-between max-w-[280px] w-[280px] p-4 rounded-md">
      {/* Content */}
      <div className="space-y-2">
        <h1 className="font-semibold rtl:text-2xl-rtl ltr:text-xl-ltr">
          {title}
        </h1>
        <h1 className="font-semibold rtl:text-xl-rtl ltr:text-xl-ltr">
          {total}
        </h1>
        <p className="text-primary/80 text-sm rtl:text-xl-rtl ltr:text-xl-ltr">
          {description1}
          <span className="text-orange-500 px-1">{total}</span>
          {description2}
        </p>
      </div>
      {/* Icon */}
      {icon}
    </Card>
  );
}
