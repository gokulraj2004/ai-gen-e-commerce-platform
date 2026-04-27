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

  const totalPages = data?.total_pages ?? 0;

  const handlePrevious = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
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
      <div className="rounded-md bg-red-50 p-4 text-red-700">
        <p>Failed to load items: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Items</h1>

      {data && data.items.length === 0 ? (
        <p className="text-gray-500">No items found.</p>
      ) : (
        <>
          <div className="space-y-4">
            {data?.items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                {item.description && (
                  <p className="mt-1 text-sm text-gray-600">{item.description}</p>
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
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-500">
                Page {data?.page ?? page} of {totalPages} ({data?.total ?? 0} total items)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={page <= 1}
                >
                  ← Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleNext}
                  disabled={page >= totalPages}
                >
                  Next →
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ItemsPage;