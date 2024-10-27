import { Check, ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  placeholder: string;
  emptyPlaceholder: string;
  selectedValue: string;
  onChange: (value: string) => void;
}

const NetworkSelect: React.FC<SelectProps> = ({
  selectedValue,
  placeholder,
  emptyPlaceholder,
  onChange,
}) => {
  const options: Option[] = [
    // { value: "apple", label: "Apple" },
    // { value: "banana", label: "Banana" },
    // { value: "cherry", label: "Cherry" },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(selectedValue);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
    setSelect(value);
    setSearch("");
  };

  const filteredOptions = options.filter((option: Option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleClickOutside = (e: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border rounded-md flex items-center justify-between bg-card text-card-foreground"
      >
        {options.find((option) => option.value == select)?.label || placeholder}
        <ChevronDown
          className={`size-3 ml-2 transition-transform ${
            isOpen && "transform rotate-180"
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-card border border-primary/15 rounded-md shadow-lg">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border-b border-primary/15 rounded-t-md focus:outline-none"
          />
          <ul className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-2 text-[14px] text-center text-primary/80">
                {emptyPlaceholder}
              </li>
            ) : (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-primary/10 ${
                    select === option.value && "bg-primary/10"
                  }`}
                >
                  {option.label}
                  {select === option.value && (
                    <Check
                      className={`size-[12px] mt-1 font-bold transition-transform `}
                    />
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NetworkSelect;
