import { cn } from "@/lib/utils";
import { AutoSizer, List } from "react-virtualized";

export interface virtualizedTableProps {
  rowHeight: number;
  renderRow: any;
  Header: any;
  rowCount: number;
  overscanRowCount: number;
  className?: string;
  listClassName?: string;
  loading?: boolean;
}

export default function VirtualizedTable(props: virtualizedTableProps) {
  const {
    rowCount,
    rowHeight,
    renderRow,
    Header,
    overscanRowCount,
    className,
    listClassName,
    loading,
  } = props;
  return (
    <AutoSizer
      className={cn(
        "min-h-[300px] !overflow-y-visible !overflow-x-auto !w-full",
        className
      )}
    >
      {({ height, width }) => {
        const resize = width <= 700 ? 700 : width;
        return (
          <div style={{ width: resize - 10 }} className="relative">
            {<Header />}
            {loading ? (
              <div className="absolute !min-w-[700px] md:w-[100%] left-0">
                <div
                  role="status"
                  className={cn(
                    "p-4 space-y-4 rounded animate-pulse md:p-2 px-4 md:px-4 mx-auto",
                    className
                  )}
                >
                  <div className="flex p-2 items-center justify-between shadow">
                    <div className="w-24 h-2 bg-primary/40 rounded-full dark:bg-primary/30" />
                    <div className="w-32 h-2 bg-primary/30 rounded-full dark:bg-primary/20" />
                    <div className="w-16 h-2 bg-primary/40 rounded-full dark:bg-primary/30" />
                    <div className="w-14 h-2 bg-primary/30 rounded-full dark:bg-primary/20" />
                    <div className="w-12 h-2 bg-primary/40 rounded-full dark:bg-primary/30" />
                    <div className="w-20 h-2 bg-primary/30 rounded-full dark:bg-primary/20" />
                    <div className="w-20 h-2 bg-primary/40 rounded-full dark:bg-primary/30" />
                  </div>
                  <div className="flex p-2 items-center justify-between shadow">
                    <div className="w-24 h-2 bg-primary/40 rounded-full dark:bg-primary/30" />
                    <div className="w-32 h-2 bg-primary/30 rounded-full dark:bg-primary/20" />
                    <div className="w-16 h-2 bg-primary/40 rounded-full dark:bg-primary/30" />
                    <div className="w-14 h-2 bg-primary/30 rounded-full dark:bg-primary/20" />
                    <div className="w-12 h-2 bg-primary/40 rounded-full dark:bg-primary/30" />
                    <div className="w-20 h-2 bg-primary/30 rounded-full dark:bg-primary/20" />
                    <div className="w-20 h-2 bg-primary/40 rounded-full dark:bg-primary/30" />
                  </div>
                  <div className="flex p-2 items-center justify-between shadow">
                    <div className="w-24 h-2 bg-primary/40 rounded-full dark:bg-primary/30" />
                    <div className="w-32 h-2 bg-primary/30 rounded-full dark:bg-primary/20" />
                    <div className="w-16 h-2 bg-primary/40 rounded-full dark:bg-primary/30" />
                    <div className="w-14 h-2 bg-primary/30 rounded-full dark:bg-primary/20" />
                    <div className="w-12 h-2 bg-primary/40 rounded-full dark:bg-primary/30" />
                    <div className="w-20 h-2 bg-primary/30 rounded-full dark:bg-primary/20" />
                    <div className="w-20 h-2 bg-primary/40 rounded-full dark:bg-primary/30" />
                  </div>
                  <div className="flex p-2 items-center justify-between shadow">
                    <div className="w-24 h-2 bg-primary/40 rounded-full dark:bg-primary/30" />
                    <div className="w-32 h-2 bg-primary/30 rounded-full dark:bg-primary/20" />
                    <div className="w-16 h-2 bg-primary/40 rounded-full dark:bg-primary/30" />
                    <div className="w-14 h-2 bg-primary/30 rounded-full dark:bg-primary/20" />
                    <div className="w-12 h-2 bg-primary/40 rounded-full dark:bg-primary/30" />
                    <div className="w-20 h-2 bg-primary/30 rounded-full dark:bg-primary/20" />
                    <div className="w-20 h-2 bg-primary/40 rounded-full dark:bg-primary/30" />
                  </div>
                </div>
              </div>
            ) : (
              <List
                width={resize - 10}
                height={height}
                rowHeight={rowHeight}
                rowRenderer={renderRow}
                rowCount={rowCount}
                overscanRowCount={overscanRowCount}
                className={cn("text-[14px]", listClassName)}
              />
            )}
          </div>
        );
      }}
    </AutoSizer>
  );
}
