import { Label } from "@/components/ui/label";

export interface FakeComboboxProps {
  title: string;
  selected: string;
  icon: any;
}

export default function FakeCombobox(props: FakeComboboxProps) {
  const { title, selected, icon } = props;
  return (
    <div className="select-none cursor-not-allowed">
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
