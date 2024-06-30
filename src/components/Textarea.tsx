import { ReactNode, useState } from "react";
import { classNames } from "../../utils";

const Textarea = ({
  children,
  value = "",
  setter,
  floatLabel = true,
  label = "",
  placeholder = "",
  className = "",
  required = true,
}: TextareInt) => {
  const [focus, setFocus] = useState(false);
  return (
    <div className="relative h-full">
      <textarea
        onChange={(e) => setter && setter(e.target.value)}
        value={value}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={placeholder}
        className={classNames(
          className,
          "bg-white resize-none border pt-2 outline-none border-gray-300 text-gray-900 text-base rounded-lg focus:ring-gray-900 focus:border-gray-900 block w-full px-3 h-full placeholder:text-base"
        )}
      ></textarea>
      {children ? (
        children
      ) : (
        <label
          className={classNames(
            !floatLabel || focus || value
              ? "-top-[25%] left-0 text-base text-neutral-800"
              : "top-[50%] text-neutral-500 text-xs left-3",
            "absolute -translate-y-1/2 transition-all ease-out duration-150 pointer-events-none"
          )}
        >
          {label}
          {required ? <span className="text-red-600 pl-1">*</span> : ""}
        </label>
      )}
    </div>
  );
};

export default Textarea;

export interface TextareInt {
  children?: ReactNode;
  value?: string;
  setter?: (e: string) => void;
  floatLabel?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}
