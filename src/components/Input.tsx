/* eslint-disable react/prop-types */
import { FieldHookConfig, useField } from "formik";
import { useState } from "react";
import { classNames } from "../../utils/classNames";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Input: React.FC<InputProps & FieldHookConfig<string>> = ({
  label = "",
  as = "input",
  children,
  className = "",
  floatLabel = false,
  placeholder = "",
  required = true,
  by = "",
  type = "text",
  containerClassName = "",
  ...props
}) => {
  const [isFocus, setFocus] = useState(false);
  const [field, { value, touched, error }, { setTouched }] = useField(props);
  const [inputType, setInputType] = useState(type);
  const Component = as;

  return (
    <div
      className={classNames(
        "relative flex items-center",
        containerClassName,
        label && !floatLabel ? "my-7" : ""
      )}
    >
      <label
        htmlFor={props.id || props.name}
        className={classNames(
          touched && error ? "text-red-500" : "",
          !floatLabel || isFocus || value
            ? "-top-[14px] left-0 text-neutral-400"
            : "top-[50%] text-neutral-300 left-3 pointer-events-none",
          "absolute z-20 -translate-y-1/2 transition-all text-sm ease-out duration-150"
        )}
      >
        {label}
        {required && !floatLabel && label ? <span> *</span> : ""}
      </label>
      <Component
        {...field}
        {...props}
        placeholder={placeholder && !floatLabel ? placeholder : ""}
        onBlur={() => setFocus(false)}
        onFocus={() => {
          setFocus(true);
          setTouched(true);
        }}
        type={inputType}
        className={classNames(
          className,
          touched && error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-500 focus:border-gray-400",
          "bg-[#0d1117] py-[5px] rounded-md border text-sm resize-none outline-none text-gray-300 focus:ring-gray-900 block w-full px-3 h-full placeholder:text-sm"
        )}
      >
        {as === "select" ? children : null}
      </Component>
      {by === "password" ? (
        <div
          className="absolute right-3 flex items-center justify-center"
          onClick={() => {
            setInputType(inputType === "password" ? "text" : "password");
          }}
        >
          {inputType === "password" ? (
            <button type="button">
              <EyeIcon width={20} />
            </button>
          ) : (
            <button type="button">
              <EyeSlashIcon width={20} />
            </button>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Input;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  as?: "input" | "select" | "textarea";
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  placeholder?: string;
  floatLabel?: boolean;
  required?: boolean;
  by?: string;
  type?: string;
}
