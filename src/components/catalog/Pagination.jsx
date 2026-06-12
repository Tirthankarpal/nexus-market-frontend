
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-1.5 pt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
          page === 0
            ? 'border-zinc-800/40 text-zinc-600 bg-transparent cursor-not-allowed'
            : 'border-zinc-800 text-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer active:scale-95'
        }`}
      >
        Previous
      </button>
      
      {Array.from({ length: totalPages }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onPageChange(idx)}
          className={`h-8 w-8 text-xs font-bold rounded-md border transition-all ${
            page === idx
              ? 'border-zinc-100 bg-zinc-100 text-zinc-950 shadow-none'
              : 'border-zinc-800 text-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer'
          }`}
        >
          {idx + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
        className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
          page === totalPages - 1
            ? 'border-zinc-800/40 text-zinc-600 bg-transparent cursor-not-allowed'
            : 'border-zinc-800 text-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer active:scale-95'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
