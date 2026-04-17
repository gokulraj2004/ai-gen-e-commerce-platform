import React from 'react';
import { Link } from 'react-router-dom';
import type { Item } from '../../types';
import { formatRelativeTime } from '../../utils/formatDate';

interface ItemCardProps {
  item: Item;
  onDelete?: (itemId: string) => void;
  showActions?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onDelete, showActions = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <Link to={`/items/${item.id}`}>
        <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
          {item.title}
        </h3>
      </Link>

      {item.description && (
        <p className="mt-2 text-gray-600 text-sm line-clamp-3">{item.description}</p>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>{formatRelativeTime(item.created_at)}</span>

        {showActions && onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(item.id);
            }}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemCard;