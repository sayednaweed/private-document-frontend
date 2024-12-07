import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FakeComboboxProps {
  title: string;
  selected: string;
  icon: any;
  className?: string;
}

export default function FakeCombobox(props: FakeComboboxProps) {
  const { title, selected, icon, className } = props;
  return (
    <div className={cn("select-none cursor-not-allowed", className)}>
      <Label className="font-semibold rtl:text-xl-rtl ltr:text-xl-ltr">
        {title}
      </Label>
      <h1 className="px-4 py-[10px] font-medium border rounded-md relative rtl:text-xl-rtl ltr:text-xl-ltr">
        {selected}
        {icon}
      </h1>
    </div>
  );
}
