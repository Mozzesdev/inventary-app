import React, { useEffect } from "react";
import { classNames } from "../../utils/classNames";

export interface AlertProps {
  message: string;
  severity: "info" | "success" | "warning" | "error";
  timeout: number;
  inner?: boolean;
  handleDismiss: () => void;
}

const Alert = ({
  message = "",
  severity = "info",
  timeout = 0,
  inner = false,
  handleDismiss = () => {},
}: AlertProps) => {
  const alertStyleType = {
    info: "border-blue-500 text-blue-700",
    success: "border-[#3fb950] text-[#3fb950]",
    warning: "border-yellow-500 text-yellow-700",
    error: "border-red-500 text-red-500",
  };

  useEffect(() => {
    if (timeout > 0 && handleDismiss) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, timeout * 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    message?.length && (
      <div
        className={classNames(
          alertStyleType[severity],
          "border rounded-lg max-w-[400px] px-4 py-3 mb-4 shadow-md pointer-events-auto bg-[#161b22]"
        )}
        role="alert"
      >
        <div className="flex">
          <div>
            <p className="font-bold capitalize">{severity}:</p>
            {inner ? (
              <div dangerouslySetInnerHTML={{ __html: message }} />
            ) : (
              <p className="text-sm text-wrap">{message}</p>
            )}
          </div>
          <div className="ml-auto">
            {handleDismiss && (
              <button
                className="text-sm font-bold"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleDismiss();
                }}
              >
                <svg
                  className="fill-current h-6 w-6 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.83 5L10 8.17 13.17 5 15 6.83 11.83 10 15 13.17 13.17 15 10 11.83 6.83 15 5 13.17 8.17 10 5 6.83 6.83 5z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Alert;
