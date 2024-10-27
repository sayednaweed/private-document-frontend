import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface ICustomTableHeadProps {
  icon?: any;
  name: string;
  className?: string;
  onClick?: (name: string) => void;
}

export default function CustomTableHead(props: ICustomTableHeadProps) {
  const { icon, className, onClick, name } = props;
  const [rotate, setRotate] = useState(false);
  return (
    <TableHead
      className={cn("hover:cursor-pointer", className)}
      onClick={() => {
        setRotate(!rotate);
        if (onClick) onClick(name);
      }}
    >
      <h1 className="font-bold capitalize select-none flex items-center">
        <span
          className={`transition-transform duration-200 ${
            rotate ? "rotate-180" : "rotate-0"
          }`}
        >
          {icon && icon}
        </span>
        {name}
      </h1>
    </TableHead>
  );
}
