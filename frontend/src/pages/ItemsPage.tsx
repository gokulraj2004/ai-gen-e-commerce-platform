import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

interface Tag {
  id: string;
  name: string;
}

interface Item {
  id: string;
  title: string;
  description: string;
  tags: Tag[];
  created_at: string;
}

interface PaginatedItems {
  items: Item[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

const ItemsPage: React.FC = () => {
  const [data, setData] = useState<PaginatedItems | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({ page: String(page), page_size: '20' });
        if (search) params.set('search', search);
        const response = await axios.get(`${API_BASE_URL}/items?${params.toString()}`);
        setData(response.data);
      } catch {
        setError('Failed to load items.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [page, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Items</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((item) => (
              <Link
                key={item.id}
                to={`/items/${item.id}`}
                className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                {item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
          {data.total_pages > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {data.page} of {data.total_pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                disabled={page >= data.total_pages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-center py-12">No items found.</p>
      )}
    </div>
  );
};

export default ItemsPage;