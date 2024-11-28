import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check } from "lucide-react";
import { ReportType } from "./dummy-data";

export interface DropMenuProps {
  list: ReportType[];
  label: string;
}
const DropMenu = ({ list, label, ...props }: DropMenuProps) => {
  // Use one state to handle selections for both dropdowns
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  // Check if all items are selected
  const isAllSelected = selectedOptions.length === list.length;

  // Toggle function for individual items
  const toggleSelect = (id: number) => {
    setSelectedOptions((prev) => {
      const isSelected = prev.includes(id);
      return isSelected
        ? prev.filter((optionId) => optionId !== id) // Remove if already selected
        : [...prev, id]; // Add if not selected
    });
  };

  // Toggle function to select or deselect all items
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedOptions([]); // Deselect all
    } else {
      setSelectedOptions(list.map((item) => item.id)); // Select all
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-32 h-10" variant="outline">
          {selectedOptions.length === 0
            ? label
            : `Selected (${selectedOptions.length})`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-4 w-56">
        {list.map((item: ReportType) => (
          <div
            key={item.id}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => toggleSelect(item.id)}
          >
            <input
              type="checkbox"
              checked={selectedOptions.includes(item.id)}
              onChange={() => toggleSelect(item.id)}
              className="mr-4 "
            />
            <span>{item.name}</span>
            {selectedOptions.includes(item.id) && (
              <Check className="ml-auto " size={16} />
            )}
          </div>
        ))}
        <div
          className="flex items-center space-x-2 cursor-pointer mb-2"
          onClick={toggleSelectAll}
        >
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={toggleSelectAll}
            className="mr-4 "
          />
          <span>Select All</span>
          {isAllSelected && <Check className="ml-auto " size={16} />}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DropMenu;
