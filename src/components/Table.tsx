import TableRow from "./TableRow";
import { ColumnTable } from "../interfaces/tables";
import noDataImg from "../assets/no-data.svg";
import React from "react";
import Spinner from "./Spinner";

const Table = ({
  columns = [],
  data = [],
  loading = true,
  options = () => [],
  onRowClick,
}: TableInterface) => {
  console.log(loading);
  const getRowData = (row: any, index: number) => {
    const finalColumns = columns.filter((col) => col.show);

    const rowData = finalColumns.map((col) => {
      if (col.index) {
        return index + 1;
      }
      if (col.isDate) {
        const date = new Date(row[col.value[0]]);

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Meses comienzan en 0
        const day = date.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
      }

      if (col.isBoolean) {
        return row[col.value[0]]
          ? col.placeholder?.true
          : col.placeholder?.false;
      }

      if (Array.isArray(col.value)) {
        let value = row;
        for (const key of col.value) {
          value = value[key];
          if (value === undefined || value === null) {
            return "";
          }
        }
        return value;
      } else {
        const value = row[col.value];
        return value !== undefined && value !== null ? value : "";
      }
    });

    return rowData;
  };

  return (
    <>
      <div className="overflow-x-auto overflow-y-hidden">
        <table className="w-full">
          <thead className="text-sm bg-[#333a45] rounded-md relative max-xl:text-xs border border-[#333a45]">
            <tr>
              {columns.map(
                (col) =>
                  col.show && (
                    <th
                      key={col.name}
                      className="px-4 py-2 text-center text-neutral-200 font-inter text-nowrap"
                    >
                      {col.name}
                    </th>
                  )
              )}
              {options(null)?.length ? (
                <th className="px-4 py-2 text-center text-neutral-200 font-inter-medium right-[-1px] sticky bg-[#333a45]">
                  Actions
                </th>
              ) : (
                ""
              )}
            </tr>
          </thead>
          <tbody className="bg-[#21262d] border border-neutral-700">
            {data.length > 0 ? (
              data.map((row, index) => (
                <TableRow
                  key={row.id}
                  row={row}
                  options={options(row)}
                  rowData={getRowData(row, index)}
                  onClick={onRowClick}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-4 text-neutral-400 table-row-empty"
                >
                  <div className="min-h-[300px] grid place-items-center">
                    {loading ? (
                      <div role="status">
                        <Spinner />
                      </div>
                    ) : (
                      <div>
                        <img src={noDataImg} alt="" className="max-w-32" />
                        <span>No data available</span>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;

export interface TableInterface {
  columns?: ColumnTable[];
  children?: React.ReactNode;
  data?: any[];
  loading?: boolean;
  options?: (row: any) => any[];
  onRowClick?: (row: any) => void;
}
