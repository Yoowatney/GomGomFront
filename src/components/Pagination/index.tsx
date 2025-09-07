import type { IPaginationProps } from '@/types/Common/pagination';

import Style from './style.module.scss';

const Pagination = (props: IPaginationProps) => {
  const { currentPage, totalPages, generatePageNumbers, handlePageClick } =
    props;

  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <div className={Style.PageButtons}>
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={isPrevDisabled}
        className={isPrevDisabled ? Style.Disabled : ''}
      >
        {'<'}
      </button>

      {generatePageNumbers().map((pageNumber: number) => (
        <button
          key={pageNumber}
          onClick={() => handlePageClick(pageNumber)}
          className={pageNumber === currentPage ? Style.CurrentPage : ''}
        >
          {pageNumber}
        </button>
      ))}

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={isNextDisabled}
        className={isNextDisabled ? Style.Disabled : ''}
      >
        {'>'}
      </button>
    </div>
  );
};

export default Pagination;
