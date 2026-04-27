/**
 * EXAMPLE PAGE — Items list page with pagination controls.
 * DELETE this file and create your own domain pages.
 */
import React, { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';

const ItemsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);

  const { data, isLoading, isError, error } = useItems({ page, per_page: perPage });

  const handlePrevious = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    if (data && page < data.total_pages) {
      setPage((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-sm text-red-700" role="alert">
        {error instanceof Error ? error.message : 'Failed to load items.'}
      </div>
    );
  }

  const items = data?.items ?? [];
  const totalPages = data?.total_pages ?? 0;
  const total = data?.total ?? 0;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Items</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">No items found.</p>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-500">
            Showing page {page} of {totalPages} ({total} total items)
          </p>

          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h2>
                {item.description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {item.description}
                  </p>
                )}
                {item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-block rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrevious}
                disabled={page <= 1}
                aria-label="Previous page"
              >
                ← Previous
              </Button>
              <span className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleNext}
                disabled={page >= totalPages}
                aria-label="Next page"
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ItemsPage;