import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import Checkbox from "./Checkbox";
import { classNames } from "../../utils/classNames";

const Dropdown = ({
  label = "",
  type = "single",
  items = [],
  defaultSelected,
  onColumnChange,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<
    DropdownItem | DropdownItem[] | null
  >(defaultSelected ?? null);

  const switchDropdown = () => {
    setOpen(!open);
  };

  useEffect(() => {
    onColumnChange && onColumnChange(selectedOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions]);

  const selectOption = (value: DropdownItem) => {
    if (type !== "single") {
      const l = selectedOptions ?? [];
      const exist = (l as any).some(({ id }: any) => id === value.id);
      let result;
      if (exist) {
        result = (l as any).filter(({ id }: any) => id !== value.id);
      } else {
        result = [...(l as any), value];
      }
      if (!result.length) {
        result = null;
      }
      setSelectedOptions(result);
    } else {
      setSelectedOptions(value);
      switchDropdown();
    }
  };

  const isChecked = (value: string): boolean => {
    return (selectedOptions as DropdownItem[])?.some(({ id }) => id === value);
  };

  return (
    <button
      className={classNames(
        open
          ? "rounded-b-none duration-100 border-b-0"
          : "hover:bg-[#262c34] duration-700",
        "relative z-50 bg-[#21262d] rounded-lg border-[#30363d] border py-[5px] px-4 h-full text-[#e8e8e8] text-sm flex items-center gap-5 transition-all"
      )}
      onClick={switchDropdown}
    >
      <span
        className={classNames(
          open
            ? "max-h-44 duration-500 opacity-100"
            : "max-h-0 pointer-events-none duration-300 border-transparent opacity-0",
          "absolute bottom-0 -left-[1px] bg-[#21262d] border-b border-l border-r border-[#30363d] border-t-0 overflow-y-auto overflow-x-hidden rounded-2xl transition-[max-height_opacity] rounded-t-none w-full translate-y-full flex flex-col"
        )}
      >
        {items.map((option) => {
          return (
            <span
              key={option.id}
              className="py-2 px-6 hover:bg-[#2b2b2b] last-of-type:pb-3 text-left flex gap-2 items-center"
              onClick={(e) => {
                e.stopPropagation();
                selectOption(option);
              }}
            >
              <Checkbox
                className="!w-5 !h-5"
                isChecked={isChecked(option.value)}
              />
              {option.label}
            </span>
          );
        })}
      </span>
      {selectedOptions
        ? `Showing ${(selectedOptions as DropdownItem[])?.length} columns`
        : label}
      <ChevronDownIcon
        width={20}
        className={classNames(
          open ? "rotate-180" : "rotate-0",
          "pt-[2px] transition-all duration-300"
        )}
        color="#c12d2d"
      />
    </button>
  );
};

export default Dropdown;

export interface DropdownItem {
  value: string;
  label: string;
  id: string;
}

export interface DropdownProps {
  label?: string;
  items?: DropdownItem[];
  type?: DropdownType;
  defaultSelected?: DropdownItem[];
  onColumnChange?: (options: DropdownItem | DropdownItem[] | null) => void;
}

type DropdownType = "single" | "multiple";
