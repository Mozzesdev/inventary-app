import { ReactNode } from "react";
import { AuthProvider } from "../hooks/AuthProvider";
import AlertsProvider from "../hooks/AlertsProvider";
import DropdownProvider from "../hooks/DropdownProvider";
import { usePageContext } from "vike-react/usePageContext";
import "./index.css";

const Layout = ({ children }: { children: ReactNode }) => {
  const context = usePageContext();
  return (
    <AuthProvider id={context?.user?.id ?? ""}>
      <AlertsProvider>
        <DropdownProvider>{children}</DropdownProvider>
      </AlertsProvider>
    </AuthProvider>
  );
};

export default Layout;
