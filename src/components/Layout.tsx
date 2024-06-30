import Sidebar from "./Sidebar";

const Layout = ({ children }: any) => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex">
      <Sidebar />
      <main className="mx-auto max-w-[1504px] h-full px-10 max-sm:px-4 pb-10 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
