import { ReactNode, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

const Layout = ({ children }: { children: ReactNode }) => {
  const [sidebar, setSidebar] = useState(true);
  return (
    <>
      <Sidebar show={sidebar} hide={() => setSidebar(false)} />
      <main className="pb-10 w-full mx-auto bg-[#0d1117] overflow-x-hidden">
        <TopBar hideSidebar={() => setSidebar(!sidebar)} />
        {children}
      </main>
    </>
  );
};

export default Layout;
