import { cn } from "@/lib/utils";
import { Edit, Eye, Trash2 } from "lucide-react";
import React, { useState } from "react";
import NastranSpinner from "../spinner/NastranSpinner";
import { TableRow } from "@/components/ui/table";

interface TableRowIconProps extends React.HTMLAttributes<HTMLTableRowElement> {
  read: boolean;
  remove: boolean;
  edit: boolean;
  onRemove: (item: any) => Promise<void>;
  onEdit: (item: any) => Promise<void>;
  onRead: (item: any) => Promise<void>;
  item: any;
}
const TableRowIcon = React.forwardRef<HTMLTableRowElement, TableRowIconProps>(
  (
    { className, read, edit, remove, onRemove, onEdit, onRead, item, ...props },
    ref
  ) => {
    const { children } = props;
    const [showAction, setShowAction] = useState(false);
    const [loading, setLoading] = useState(false);
    return (
      <TableRow
        className={cn(`${showAction && "!bg-primary/10"} relative`, className)}
        {...props}
        ref={ref}
        onMouseEnter={() => setShowAction(true)}
        onMouseLeave={() => setShowAction(false)}
      >
        {children}
        <td>
          {showAction && (
            <div className="w-[110px] bg-primary py-1 rounded-full flex absolute top-1/2 transform -translate-y-1/2 ltr:right-2 rtl:left-2 justify-center gap-x-2">
              {read && !edit && (
                <div
                  onClick={async () => {
                    if (loading) return;
                    setLoading(true);
                    await onRead(item);
                    setLoading(false);
                  }}
                  className="cursor-pointer hover:[&>*]:text-primary-foreground/70"
                >
                  <Eye className="text-primary-foreground size-[18px] transition" />
                </div>
              )}
              {edit && (
                <div
                  onClick={async () => {
                    if (loading) return;
                    setLoading(true);
                    await onEdit(item);
                    setLoading(false);
                  }}
                  className="cursor-pointer hover:[&>*]:text-green-500/70"
                >
                  <Edit className="text-green-500 size-[18px] transition" />
                </div>
              )}

              {remove && (
                <div
                  onClick={async () => {
                    if (loading) return;
                    setLoading(true);
                    await onRemove(item);
                    setLoading(false);
                  }}
                  className="cursor-pointer hover:[&>*]:text-red-400/70"
                >
                  <Trash2 className="text-red-400 size-[18px] transition" />
                </div>
              )}
            </div>
          )}
        </td>
        {loading && (
          <td className="w-full h-full bg-primary/60 pt-3 absolute left-0">
            <NastranSpinner
              labelclassname="ltr:text-sm-ltr rtl:text-xl-ltr text-primary-foreground"
              className="size-[18px]"
            />
          </td>
        )}
      </TableRow>
    );
  }
);

export default TableRowIcon;
