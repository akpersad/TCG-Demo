type Props = {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  totalCount,
  pageSize,
  currentPage,
  onPageChange,
}: Props) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage > 4 && currentPage < totalPages - 3) {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      } else {
        pages.push(
          1,
          '...',
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      }
    }
    return pages;
  };

  return (
    <div className='flex justify-center items-center space-x-2 mt-4'>
      <button
        className='px-4 py-2 bg-black rounded hover:bg-gray-300 hover:text-black'
        disabled={currentPage === 1 || totalPages === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      {renderPageNumbers().map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={index}
            className={`px-4 py-2 rounded ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'bg-black rounded hover:bg-gray-300 hover:text-black'
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ) : (
          <span key={index} className='px-4 py-2'>
            {page}
          </span>
        )
      )}
      <button
        className='px-4 py-2 bg-black rounded hover:bg-gray-300 hover:text-black'
        disabled={currentPage === totalPages || totalPages === 1}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
