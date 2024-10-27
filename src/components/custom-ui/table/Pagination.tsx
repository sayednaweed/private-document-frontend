import { ChevronLeft, ChevronRight } from "lucide-react";
import PrimaryButton from "../button/PrimaryButton";
import { useState } from "react";

interface PaginationProps {
  lastPage: number;
  onPageChange: (page: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({ lastPage, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      setCurrentPage(currentPage + 1);
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  // Function to generate pagination numbers with ellipsis for large datasets
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const siblingCount = 1; // Number of pages to show around current page

    if (lastPage <= 7) {
      // If less than 7 pages, show all pages
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      // Always show first, last, and nearby pages
      pages.push(1);
      if (currentPage > siblingCount + 2) pages.push("...");
      for (
        let i = Math.max(2, currentPage - siblingCount);
        i <= Math.min(lastPage - 1, currentPage + siblingCount);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < lastPage - siblingCount - 1) pages.push("...");
      pages.push(lastPage);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex justify-center select-none h-[28px] text-sm gap-x-1 text-primary-foreground">
      {/* Previous Button */}
      <PrimaryButton
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={`p-[6px] h-fit rtl:ml-3 ltr:mr-3 self-center rounded-lg`}
      >
        <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
      </PrimaryButton>
      {/* Page Numbers */}
      {pageNumbers.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => handlePageClick(page)}
            className={`min-w-8 px-[2px] rounded-sm hover:bg-primary/80 hover:text-white font-medium border border-primary/15 transition-colors ${
              currentPage === page
                ? "bg-primary/80 text-white"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-4 py-2">
            ...
          </span>
        )
      )}

      {/* Next Button */}
      <PrimaryButton
        onClick={handleNextPage}
        disabled={currentPage === lastPage}
        className={`p-[6px] h-fit shadow-md shadow-primary/55 rtl:mr-3 ltr:ml-3 self-center rounded-lg`}
      >
        <ChevronRight className="h-5 w-5 rtl:rotate-180" />
      </PrimaryButton>
    </div>
  );
};

export default Pagination;
