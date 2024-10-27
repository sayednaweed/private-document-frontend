import { X } from "lucide-react";
export interface Item {
  name: string;
  translate: string;
  onClick: (itemName: string) => void;
}
export interface FilterItemProps {
  headerName: string;
  items: Item[];
  selected: string;
}
export const FilterItem = (props: FilterItemProps) => {
  const { items, headerName, selected } = props;

  const headerStyle =
    "uppercase text-start font-semibold border-b border-primary/20 pb-2 rtl:text-2xl-rtl ltr:text-lg-ltr text-primary";
  const itemStyle =
    "rtl:text-lg-rtl ltr:text-md-ltr cursor-pointer px-2 py-1 capitalize rounded-full hover:bg-primary/5 transition flex items-center text-start";
  const mapItems = items.map((item: Item, index: number) => {
    const active = item.name == selected;
    return (
      <h1
        key={index}
        onClick={() => item.onClick(item.name)}
        className={`${itemStyle} ${
          active ? "font-semibold text-primary/80" : "text-primary/50"
        }`}
      >
        {active && (
          <X className="inline-block size-[18px] stroke-[1.2px] transition" />
        )}
        {item.translate}
      </h1>
    );
  });
  return (
    <section className="min-w-[120px] space-y-2">
      <h1 className={headerStyle}>{headerName}</h1>
      {mapItems}
    </section>
  );
};
