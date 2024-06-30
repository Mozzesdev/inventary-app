import { useEffect } from "react";
import { classNames } from "../../utils/classNames";

interface AlertProps {
  message: string;
  severity: "info" | "success" | "warning" | "error";
  timeout: number;
  handleDismiss: () => void;
}

const Alert = ({
  message = "",
  severity = "info",
  timeout = 0,
  handleDismiss = () => {},
}: AlertProps) => {
  const alertStyleType = {
    info: "border-blue-500 text-blue-700",
    success: "border-green-500 text-green-700",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    message?.length && (
      <div
        className={classNames(
          alertStyleType[severity],
          "border rounded-lg px-4 py-3 mb-4 shadow-md pointer-events-auto bg-[#161b22]"
        )}
        role="alert"
      >
        <div className="flex">
          <div>
            <p className="font-bold capitalize">{severity}</p>
            <p className="text-sm">{message}</p>
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
