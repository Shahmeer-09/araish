'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  
  // Generate page numbers with ellipsis
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
  }

  return (
    <div className="flex items-center justify-center gap-3 mt-16">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="group relative px-5 py-2.5 border border-[var(--gold)]/30 text-sm tracking-[0.15em] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--gold)] hover:bg-[var(--gold)]/5 transition-all duration-300 overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-2">
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          PREV
        </span>
      </button>
      
      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-[var(--gold)] tracking-widest">•••</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`relative w-11 h-11 text-sm font-medium transition-all duration-300 overflow-hidden ${
                currentPage === page
                  ? 'text-white'
                  : 'text-gray-600 hover:text-[var(--gold)]'
              }`}
            >
              {/* Active background with gradient */}
              {currentPage === page && (
                <span className="absolute inset-0 bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] animate-scale-in" />
              )}
              {/* Border for inactive */}
              {currentPage !== page && (
                <span className="absolute inset-0 border border-gray-200 hover:border-[var(--gold)]/50 transition-colors duration-300" />
              )}
              <span className="relative z-10">{page}</span>
            </button>
          )
        ))}
      </div>
      
      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="group relative px-5 py-2.5 border border-[var(--gold)]/30 text-sm tracking-[0.15em] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--gold)] hover:bg-[var(--gold)]/5 transition-all duration-300 overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-2">
          NEXT
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </button>
    </div>
  );
}
