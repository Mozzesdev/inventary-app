import { classNames } from "../../utils/classNames";
import { useDropdown } from "../hooks/DropdownProvider";
import React from "react";

const TableRow = ({ rowData, row, options = [], onClick }: any) => {
  const dropdownContext = useDropdown();

  return (
    <tr
      className={classNames(
        "border-b border-neutral-700 border-solid last-of-type:border-b-0 text-sm max-xl:text-xs",
        onClick ? "cursor-pointer" : ""
      )}
      onClick={() => onClick && onClick(row)}
      title={onClick ? 'Click to manage the maintenance' : ''}
    >
      {rowData.map((data: any, index: number) => (
        <td key={index} className="px-4 py-3 whitespace-nowrap text-center">
          {data || "..."}
        </td>
      ))}
      {options.length ? (
        <td className="right-[-1px] sticky bg-[#21262d]">
          <div className="w-full px-4 flex justify-center">
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center border-[#30363d] border gap-x-1.5 rounded-md bg-[#1d2127] hover:bg-[#262c34] px-2 py-1 text-xs"
                  id="menu-button"
                  aria-expanded="true"
                  aria-haspopup="true"
                  onClick={(e) => {
                    dropdownContext?.openDropdown(
                      e.target as HTMLElement,
                      options
                    );
                  }}
                >
                  Options
                  <svg
                    className="-mr-1 h-5 w-5 text-gray-400 pointer-events-none"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </td>
      ) : (
        ""
      )}
    </tr>
  );
};

export default TableRow;
