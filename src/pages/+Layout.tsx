import { ReactNode } from "react";
import AlertsProvider from "../../hooks/AlertsProvider";
import { AuthProvider } from "../../hooks/AuthProvider";
import { usePageContext } from "../../hooks/usePageContext";
import DropdownProvider from "../../hooks/DropdownProvider";

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
