import React from 'react';
import type { Item } from '../../types';
import ItemCard from './ItemCard';

interface ItemListProps {
  items: Item[];
  onDelete?: (itemId: string) => void;
  showActions?: boolean;
  emptyMessage?: string;
}

const ItemList: React.FC<ItemListProps> = ({
  items,
  onDelete,
  showActions = false,
  emptyMessage = 'No items found.',
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onDelete={onDelete} showActions={showActions} />
      ))}
    </div>
  );
};

export default ItemList;