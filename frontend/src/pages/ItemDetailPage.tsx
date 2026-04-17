import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  user_id: string;
  created_at: string;
  updated_at: string;
}

const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.get(`${API_BASE_URL}/items/${id}`);
        setItem(response.data);
      } catch {
        setError('Item not found.');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchItem();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h1>
        <p className="text-gray-600 mb-6">{error || 'The requested item could not be found.'}</p>
        <Link to="/items" className="text-primary-600 hover:underline">
          Back to Items
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/items" className="text-primary-600 hover:underline text-sm mb-4 inline-block">
        &larr; Back to Items
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mt-2">{item.title}</h1>
      {item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag.id}
              className="bg-primary-100 text-primary-700 text-sm px-3 py-1 rounded"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
      <p className="mt-6 text-gray-700 whitespace-pre-wrap">{item.description}</p>
      <div className="mt-8 text-sm text-gray-500">
        Created: {new Date(item.created_at).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ItemDetailPage;