import TableRow from "./TableRow";
import { ColumnTable } from "../interfaces/tables";
import noDataImg from "../assets/no-data.svg";

const Table = ({
  columns = [],
  data = [],
  loading = true,
  options = () => [],
}: TableInterface) => {
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
      <div className="overflow-x-auto rounded-sm overflow-y-hidden">
        <table className="w-full">
          <thead className="text-sm bg-[#333a45] relative max-xl:text-xs">
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
                <th className="px-4 py-2 text-center text-neutral-200 font-inter-medium right-0 sticky bg-[#333a45]">
                  Actions
                </th>
              ) : (
                ""
              )}
            </tr>
          </thead>
          <tbody className="bg-[#21262d]">
            {data.length > 0 ? (
              data.map((row, index) => (
                <TableRow
                  key={row.id}
                  options={options(row)}
                  rowData={getRowData(row, index)}
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
                        <svg
                          aria-hidden="true"
                          className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="text-base font-inter-bold tracking-wider uppercase pl-4">
                          Loading...
                        </span>
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
}
