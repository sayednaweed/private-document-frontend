import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Paintbrush } from "lucide-react";
import { useMemo } from "react";
import { gradients, solids } from "./colors";

export default function ColorPicker({
  background,
  setBackground,
  solidTitle,
  gradientTitle,
  className,
}: {
  background: string;
  setBackground: (background: string) => void;
  solidTitle: string;
  gradientTitle: string;
  className?: string;
}) {
  const defaultTab = useMemo(() => {
    if (background.includes("gradient")) return "gradient";
    return "solid";
  }, [background]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !background && "text-muted-foreground",
            className
          )}
        >
          <div
            dir="ltr"
            style={{
              fontFamily: "Segoe UI",
            }}
            className="w-full flex items-center gap-2"
          >
            {background ? (
              <div
                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                style={{ background }}
              />
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="truncate flex-1">
              {background ? background : "Pick a color"}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger
              className="flex-1 ltr:text-xl-ltr rtl:text-2xl-rtl rtl:p-1"
              value="solid"
            >
              {solidTitle}
            </TabsTrigger>
            <TabsTrigger
              className="flex-1 ltr:text-xl-ltr rtl:text-2xl-rtl rtl:p-1"
              value="gradient"
            >
              {gradientTitle}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="solid"
            className="flex flex-wrap gap-1 mt-0 max-h-[120px] overflow-y-auto"
          >
            {solids.map((s) => (
              <div
                key={s}
                style={{ background: s }}
                className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                onClick={() => setBackground(s)}
              />
            ))}
          </TabsContent>

          <TabsContent value="gradient" className="mt-0">
            <div className="flex flex-wrap gap-1 mb-2 max-h-[120px] overflow-y-auto">
              {gradients.map((s) => (
                <div
                  key={s}
                  style={{ background: s }}
                  className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                  onClick={() => setBackground(s)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Input
          id="custom"
          value={background}
          className="col-span-2 h-8 mt-4"
          onChange={(e) => setBackground(e.currentTarget.value)}
        />
      </PopoverContent>
    </Popover>
  );
}
