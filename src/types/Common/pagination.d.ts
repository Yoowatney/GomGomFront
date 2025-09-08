interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  generatePageNumbers: () => number[];
  handlePageClick: (pageNumber: number) => void;
}

export { IPaginationProps };