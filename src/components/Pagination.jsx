import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.css";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Build page numbers array with ellipsis for clean display
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  const handlePageClick = (page) => {
    if (typeof page === "number" && page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      // Smooth scroll to top of wallpaper grid
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  };

  return (
    <nav className="pagination-container" aria-label="Pagination Navigation">
      {/* Previous Button */}
      <button
        className="pagination-btn nav-btn"
        disabled={currentPage <= 1}
        onClick={() => handlePageClick(currentPage - 1)}
        aria-label="Previous Page"
      >
        <ChevronLeft size={18} />
        <span>Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="pagination-numbers">
        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`pagination-number ${page === currentPage ? "active" : ""}`}
              onClick={() => handlePageClick(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        className="pagination-btn nav-btn"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageClick(currentPage + 1)}
        aria-label="Next Page"
      >
        <span>Next</span>
        <ChevronRight size={18} />
      </button>
    </nav>
  );
};

export default Pagination;
