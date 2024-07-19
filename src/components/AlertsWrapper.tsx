import { ReactNode } from "react";

const AlertsWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed top-0 right-0 p-4 z-[400] pointer-events-none max-w-sm min-w-fit w-full">
      {children}
    </div>
  );
};

export default AlertsWrapper;
