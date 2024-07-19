import React, { ReactNode } from "react";
import { classNames } from "../../utils/classNames";

const Dialog = ({
  children,
  show,
  className = "",
  hide,
}: {
  children: ReactNode;
  show: boolean;
  hide: () => void;
  onShow?: () => void;
  className?: string;
}) => {
  const cancelPropagation = (e: React.MouseEvent<HTMLElement>) =>
    e.stopPropagation();

  const closeDialog = () => {
    hide();
  };

  return (
    <div
      className={classNames(
        show ? "opacity-100" : "opacity-0 pointer-events-none",
        "fixed bg-[#0000006d] max-md:bg-[#0d1117] inset-0 p-6 z-[300] transition-all duration-200 grid place-items-center overflow-auto"
      )}
      onMouseDown={closeDialog}
    >
      <div
        className={classNames(
          "bg-[#161b22] rounded-lg relative border border-[#30363d] max-w-[800px] w-full",
          className
        )}
        onMouseDown={cancelPropagation}
      >
        {children}
      </div>
    </div>
  );
};

export default Dialog;
