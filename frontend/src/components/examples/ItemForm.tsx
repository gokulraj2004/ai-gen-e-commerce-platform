import React, { useState } from 'react';
import { validateRequired } from '../../utils/validators';
import type { Tag } from '../../types';

interface ItemFormProps {
  onSubmit: (data: { title: string; description: string; tag_ids: string[] }) => Promise<void>;
  initialData?: {
    title?: string;
    description?: string;
    tag_ids?: string[];
  };
  availableTags?: Tag[];
  isLoading?: boolean;
  submitLabel?: string;
}

const ItemForm: React.FC<ItemFormProps> = ({
  onSubmit,
  initialData,
  availableTags = [],
  isLoading = false,
  submitLabel = 'Save',
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialData?.tag_ids || []);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string | null> = {
      title: validateRequired(title, 'Title'),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e !== null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      title,
      description,
      tag_ids: selectedTagIds,
    });
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg" noValidate>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          disabled={isLoading}
          required
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          disabled={isLoading}
        />
      </div>

      {availableTags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTagIds.includes(tag.id)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                disabled={isLoading}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default ItemForm;