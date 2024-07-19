import { classNames } from "../../utils/classNames";
import { useField } from "formik";
import React from "react";

const Select = ({
  options = [],
  onChange,
  label = "",
  required = false,
  ...props
}: SelectProps) => {
  const [field, { value: selectValue, touched }, { setTouched }] = useField(
    props as any
  );

  return (
    <div className="relative" onClick={() => setTouched(true)}>
      <label
        htmlFor={field.name}
        className="absolute z-20 -translate-y-1/2 -top-[14px] left-0 text-neutral-400 transition-all text-sm ease-out duration-150"
      >
        {label} {label && required ? "*" : ""}
      </label>
      <select
        id={field.name}
        name={field.name}
        value={selectValue}
        onChange={onChange}
        className={classNames(
          !selectValue && required && touched
            ? "border-red-500 focus:border-red-500"
            : "border-gray-500 focus:border-gray-400",
          "rounded-[7px] w-full h-full border bg-[#0d1117] px-3 py-[5px] text-sm outline-none"
        )}
        {...props}
      >
        <option value="">
          Select an option
        </option>
        {options.map(({ label, value }) => {
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Select;

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Options[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => any;
  label: string;
  required?: boolean;
}

export interface Options {
  label: string;
  value: string;
}
