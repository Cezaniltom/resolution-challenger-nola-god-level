"use client";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange
}) {
  const handlePrevious = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };
  const handleNext = () => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:justify-end">
        <span className="relative z-0 inline-flex rounded-md shadow-sm">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={16} className="mr-2" />
            Anterior
          </button>
          <span className="-ml-px block border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="-ml-px relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Próxima
            <ChevronRight size={16} className="ml-2" />
          </button>
        </span>
      </div>
    </div>
  );
}