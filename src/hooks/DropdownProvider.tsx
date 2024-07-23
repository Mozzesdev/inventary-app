import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { classNames } from "../../utils/classNames";

interface DropdownContextType {
  open: boolean;
  openDropdown: (
    target: HTMLElement,
    options: Options[],
    config?: Config
  ) => void;
  closeDropdown: () => void;
  setOptions: React.Dispatch<React.SetStateAction<Options[]>>;
}

interface Options {
  label: string;
  action: () => any;
  icon?: any;
  disabled?: boolean;
}

interface Config {
  align: "default" | "left";
}

export const useDropdown = () => useContext(DropdownContext);

export const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined
);

const DropdownProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [config, setConfig] = useState<Config>({ align: "default" });
  const [options, setOptions] = useState<Options[]>([]);
  const drop = useRef<HTMLDivElement>(null);
  const dropdownToggle = useRef<HTMLElement | null>(null);

  const openDropdown = (
    target: HTMLElement,
    options: Options[] = [],
    config: Config = {
      align: "default",
    }
  ) => {
    setConfig(config);
    dropdownToggle.current = target;
    if (open) return closeDropdown();
    
    setOptions(options);
    
    Promise.resolve().then(() => positionDropdown(config));
    
    setOpen(true);
  };

  const closeDropdown = () => {
    setOptions([])
    setOpen(false);
  };

  const positionDropdown = useCallback(
    (parentConfig?: Config) => {
      if (!drop.current || !dropdownToggle.current) return;
      const currentConfig = parentConfig ?? config;

      const eleRect = dropdownToggle.current.getBoundingClientRect();
      const width =
        currentConfig.align === "default" ? 0 : -drop.current.offsetWidth + 10;

      const x = eleRect.left + width;
      const y = eleRect.bottom;

      (drop.current as HTMLElement).style.left = `${x}px`;
      (drop.current as HTMLElement).style.top = `${y}px`;
    },
    [config]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drop.current &&
        !drop.current.contains(event.target as Node) &&
        dropdownToggle.current &&
        !dropdownToggle.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    const handleResize = () => {
      if (open) positionDropdown();
    };

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [open, positionDropdown]);

  return (
    <DropdownContext.Provider
      value={{ open, openDropdown, closeDropdown, setOptions }}
    >
      <div
        className={`absolute z-[500] ${open ? "block" : "hidden"}`}
        ref={drop}
        style={{
          minWidth:
            dropdownToggle?.current && config.align === "default"
              ? `${dropdownToggle.current.offsetWidth}px`
              : `auto`,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={classNames(
            "mt-1 rounded-md bg-[#1d2127] shadow-lg focus:outline-none border-[#30363d] border",
            open && options?.length ? "block" : "hidden"
          )}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="text-left" role="none">
            {options?.map((option) => (
              <button
                key={option.label}
                className="block w-full px-4 py-1.5 text-xs text-neutral-300 cursor-pointer hover:text-gray-400 hover:bg-[#2e353f] disabled:pointer-events-none disabled:!bg-[#2b313a] disabled:!text-gray-400"
                role="menuitem"
                disabled={option.disabled}
                onClick={() => {
                  if (option.disabled) return;
                  option.action();
                  closeDropdown();
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {children}
    </DropdownContext.Provider>
  );
};

export default DropdownProvider;
