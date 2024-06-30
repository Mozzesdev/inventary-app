import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { classNames } from "../../utils/classNames";

const Pagination = ({
  pagination,
  setterPage,
  currentPage,
}: PaginationProps) => {
  const handlePageChange = (pageNumber: any) => {
    if (pageNumber !== currentPage) {
      setterPage(pageNumber);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage && currentPage > 1) {
      setterPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage && currentPage < (pagination?.allPages ?? 0)) {
      setterPage(currentPage + 1);
    }
  };

  const getPagesToShow = () => {
    const totalPages = pagination?.allPages ?? 0;
    const maxPagesToShow = 5;
    let startPage = Math.max(
      1,
      currentPage ?? 0 - Math.floor(maxPagesToShow / 2)
    );
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };
  const pages = getPagesToShow();

  return (
    <nav aria-label="Page navigation" className="flex items-center">
      <ul className="flex items-center gap-1 -space-x-px text-sm rounded-lg overflow-hidden text-neutral-300">
        <li
          className="flex items-center py-1 justify-center px-3 ms-0 leading-tight cursor-pointer hover:scale-110"
          onClick={handlePreviousPage}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="w-4 h-4" />
        </li>

        {pages.map((page) => (
          <li
            className={classNames(
              page === currentPage ? "bg-[#21262d]" : "",
              "relative w-10 py-1 px-3 max-w-[40px] cursor-pointer select-none rounded-lg text-center font-inter text-sm uppercase transition-all hover:bg-[#262c34]"
            )}
            key={page}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </li>
        ))}
        <li
          className="flex items-center justify-center py-1 px-3 leading-tight rounded-e-lg cursor-pointer hover:scale-110"
          onClick={handleNextPage}
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="w-4 h-4" />
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;

interface PaginationProps {
  pagination: Pagination | undefined;
  setterPage: (page: number) => void;
  currentPage: number;
}

export interface Pagination {
  total: number;
  perPage: number;
  allPages: number;
  page: number;
}
