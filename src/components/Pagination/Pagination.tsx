// src/components/Pagination/Pagination.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router';

interface PaginationProps {
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages }) => {
  const navigate = useNavigate();
  const { page } = useParams<{ page: string }>();
  const currentPage = page ? parseInt(page, 10) : 1;

  // Handle pagination.
  const handlePageChange = (newPage: number) => {
    // Navigate to the new page (closing any details pane).
    navigate(`/search/${newPage}`);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  return (
    <div className="pagination">
      {pages.map((page) => (
        <button
          key={page}
          disabled={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
