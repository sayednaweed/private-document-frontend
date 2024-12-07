import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import NastranSpinner from "../spinner/NastranSpinner";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import axiosClient from "@/lib/axois-client";

export interface FetchApi {
  url: string;
  id: string;
}

export interface ComboboxItem {
  id: string;
  name: string;
  selected: boolean;
}

export type ComboboxMode = "single" | "multiple";

export interface IAPIComboboxProps {
  onSelect: (items: ComboboxItem[] | ComboboxItem) => void;
  selectedItem?: string;
  apiUrl?: string;
  apiSelected?: FetchApi;
  placeHolder: string;
  readonly?: boolean;
  errorMessage?: string;
  mode: ComboboxMode;
  className?: string;
  params?: any;
  required?: boolean;
  requiredHint?: string;
  lable?: string;
  errorText: string;
  placeholderText: string;
}

export default function APICombobox(props: IAPIComboboxProps) {
  const {
    onSelect,
    apiUrl,
    placeHolder,
    errorMessage,
    mode,
    selectedItem,
    readonly,
    className,
    required,
    params,
    requiredHint,
    errorText,
    lable,
    placeholderText,
  } = props;
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Array<ComboboxItem>>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(selectedItem);

  const updateSelect = () => {
    if (selectedItem) {
      setItems((prevItems) =>
        prevItems.map((item) => {
          // Ensure comparison works correctly (trim whitespace, case-insensitive)
          return selectedItem.trim().toLowerCase() ===
            item.name.trim().toLowerCase()
            ? { ...item, selected: true }
            : { ...item, selected: false }; // Clear other selections
        })
      );
    }
  };
  const initialize = async () => {
    try {
      if (!readonly && apiUrl) {
        const response = await axiosClient.get(apiUrl, {
          params: params,
        });
        if (response.status == 200) {
          setItems(response.data);
          updateSelect(); // Update selection once items are fetched
        }
      }
    } catch (error: any) {
      console.log(error);
      toast({
        toastType: "ERROR",
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    initialize();
  }, []);
  useEffect(() => {
    if (selectedItem) {
      setSelected(selectedItem);
      updateSelect(); // Call updateSelect to update the item list based on the selectedItem
    }
  }, [selectedItem]);

  const error = errorMessage != undefined;

  const onSelectChange = (currentValue: any) => {
    if (mode == "multiple") {
      // setSelected({...selected,currentValue});
    } else {
      setSelected(currentValue);
    }
    const filteredItems = items.map((comboboxItem: ComboboxItem) => {
      const matched =
        comboboxItem.name.trim().toLowerCase() ==
        currentValue.trim().toLowerCase();

      if (mode === "single") {
        return matched
          ? { ...comboboxItem, selected: true }
          : { ...comboboxItem, selected: false };
      }
      return comboboxItem.name.trim().toLowerCase() ==
        currentValue.trim().toLowerCase() &&
        (comboboxItem.selected == undefined || comboboxItem.selected == false)
        ? { ...comboboxItem, selected: true }
        : comboboxItem.name.toLowerCase() == currentValue.toLowerCase() &&
          comboboxItem.selected == true
        ? { ...comboboxItem, selected: false }
        : comboboxItem;
    });
    setItems(filteredItems);
    const selectedItems = filteredItems.filter(
      (item: ComboboxItem) => item.selected === true
    );
    onSelect(mode === "single" ? selectedItems[0] : selectedItems);
    setOpen(false);
  };
  return (
    <div className={`self-start relative`}>
      <Popover
        open={open}
        onOpenChange={(selection: any) => {
          if (!readonly) setOpen(selection);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              `w-fit min-w-[260px] min-h-[43px] rtl:text-lg-rtl ltr:text-lg-ltr relative justify-between ${
                error && "border-red-400 border"
              } ${required || lable ? "mt-[20px]" : "mt-2"} ${
                readonly && "cursor-not-allowed"
              }`,
              className
            )}
          >
            {!selected ? placeHolder : selected}
            <ChevronsUpDown className="h-4 w-4 ltr:ml-4 rtl:mr-4 shrink-0 opacity-50" />
            {required && (
              <span className="text-red-600 ltr:right-[10px] rtl:left-[10px] -top-[17px] absolute font-semibold rtl:text-[13px] ltr:text-[11px]">
                {requiredHint}
              </span>
            )}
            {lable && (
              <span className="rtl:text-lg-rtl ltr:text-lg-ltr ltr:left-[4px] rtl:right-[4px] ltr:-top-[20px] rtl:-top-[23px] absolute font-semibold">
                {lable}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 z-50 rtl:text-xl-rtl ltr:text-lg-ltr">
          <Command>
            <CommandInput
              placeholder={placeholderText}
              className="h-9 mx-1 flex rtl:text-md-rtl ltr:text-lg-ltr"
            />
            <CommandEmpty>
              {loading ? (
                <NastranSpinner
                  labelclassname="text-[13px]"
                  className="size-[24px]"
                  label="Fetching"
                />
              ) : (
                errorText
              )}
            </CommandEmpty>
            <CommandList>
              <CommandGroup>
                {Array.isArray(items) &&
                  items.map((item: ComboboxItem) => (
                    <CommandItem
                      key={item.name}
                      value={item.name}
                      onSelect={onSelectChange}
                    >
                      {item.name}
                      {item.selected && (
                        <Check className={"ltr:ml-auto rtl:mr-auto h-4 w-4"} />
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {
        <h1 className="rtl:text-sm-rtl ltr:text-sm-ltr text-start text-red-400">
          {errorMessage}
        </h1>
      }
    </div>
  );
}
