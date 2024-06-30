import { BellIcon } from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { usePageContext } from "../../hooks/usePageContext";

const TopBar = ({ hideSidebar }: any) => {
  const { config }: any = usePageContext();
  return (
    <nav className="py-6 flex justify-between bg-[#010409] text-neutral-200 font-inter-medium mb-7 px-10 max-sm:px-4 max-sm:py-4 border-b border-[#30363d]">
      <div className="flex gap-5">
        <button
          className="hover:text-neutral-400 transition-colors duration-200"
          onClick={hideSidebar}
        >
          <Bars3Icon className="w-7 max-sm:w-6" />
        </button>
        <h1 className="text-2xl max-sm:text-xl">
          {config.location_label ?? ""}
        </h1>
      </div>
      <button className="hover:text-neutral-400 transition-colors duration-200">
        <BellIcon className="w-7 max-sm:w-6" />
      </button>
    </nav>
  );
};

export default TopBar;
