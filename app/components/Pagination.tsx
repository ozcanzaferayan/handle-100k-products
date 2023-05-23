import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handleClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderButtons = () => {
    const buttons = [];

    // Calculate the range of buttons to display
    let start = Math.max(1, currentPage - 4);
    let end = Math.min(totalPages, currentPage + 5);

    if (end - start < 9) {
      if (start === 1) {
        end = Math.min(totalPages, start + 9);
      } else {
        start = Math.max(1, end - 9);
      }
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handleClick(i)}
          className={i === currentPage ? "btn active" : "btn"}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  return <div className="pagination">{renderButtons()}</div>;
};

export default Pagination;
