import { ReactNode } from "react";
import { classNames } from "../../utils/classNames";
import React from "react";

const Button = ({
  children,
  label = "",
  className = "",
  type = "primary",
  action,
  submit = false,
  disabled = false,
}: ButtonProps) => {
  const types = {
    primary: {
      btn: "",
    },
    secondary: {
      btn: "",
    },
  };

  return (
    <button
      className={classNames(
        types[type].btn,
        className,
        "border-[#30363d] border bg-[#21262d] hover:bg-[#262c34] disabled:!pointer-events-none py-[5px] disabled:!border-0 disabled:!bg-neutral-500 disabled:!text-neutral-400 text-[#e8e8e8] text-sm px-4 rounded-md transition duration-300 relative flex items-center justify-center gap-2 h-full"
      )}
      type={submit ? "submit" : "button"}
      onClick={() => action && action()}
      disabled={disabled}
    >
      {children ? children : <>{label}</>}
    </button>
  );
};

export default Button;

export interface ButtonProps {
  label?: string;
  className?: string;
  children?: ReactNode;
  type?: ButtonType;
  action?: () => void;
  submit?: boolean;
  disabled?: boolean;
}

type ButtonType = "primary" | "secondary";
