'use client';

import { useState, useRef } from 'react';

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    material: string;
    inStock: boolean;
    featured: boolean;
    images: { id: string; mimeType: string }[];
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const CATEGORIES = ['rings', 'necklaces', 'earrings', 'bracelets', 'sets'];

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || 'rings',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    material: product?.material || '',
    inStock: product?.inStock ?? true,
    featured: product?.featured ?? false,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!product;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleDeleteExistingImage = (imageId: string) => {
    setImagesToDelete(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('category', formData.category);
      form.append('description', formData.description);
      form.append('price', formData.price);
      form.append('material', formData.material);
      form.append('inStock', formData.inStock.toString());
      form.append('featured', formData.featured.toString());

      selectedFiles.forEach(file => {
        form.append('images', file);
      });

      imagesToDelete.forEach(id => {
        form.append('deleteImages', id);
      });

      const url = isEditing ? `/api/products/${product.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: form,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save product');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-sm shadow-lg border border-gray-200">
      <h3 className="text-xl font-serif tracking-[0.1em] mb-6">
        {isEditing ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
      </h3>
      <div className="w-12 h-px bg-[var(--gold)] mb-6" />

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-[var(--gold)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-[var(--gold)] bg-white"
              required
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-[var(--gold)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material *
            </label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder="e.g., 18K Gold, Diamond"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-[var(--gold)] resize-none"
            required
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
              className="w-4 h-4 text-[var(--gold)] border-gray-300 rounded focus:ring-[var(--gold)]"
            />
            <span className="text-sm text-gray-700">In Stock</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 text-[var(--gold)] border-gray-300 rounded focus:ring-[var(--gold)]"
            />
            <span className="text-sm text-gray-700">Featured</span>
          </label>
        </div>

        {/* Existing Images */}
        {isEditing && product.images.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Existing Images
            </label>
            <div className="flex flex-wrap gap-3">
              {product.images.map(img => (
                <div 
                  key={img.id} 
                  className={`relative group ${imagesToDelete.includes(img.id) ? 'opacity-40' : ''}`}
                >
                  <img
                    src={`/api/images/${img.id}`}
                    alt="Product"
                    className="w-24 h-24 object-cover rounded-sm border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => toggleDeleteExistingImage(img.id)}
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                      imagesToDelete.includes(img.id) 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {imagesToDelete.includes(img.id) ? '↺' : '×'}
                  </button>
                </div>
              ))}
            </div>
            {imagesToDelete.length > 0 && (
              <p className="text-xs text-red-600 mt-2">
                {imagesToDelete.length} image(s) will be deleted on save
              </p>
            )}
          </div>
        )}

        {/* New Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isEditing ? 'Add New Images' : 'Product Images'}
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-dashed border-gray-400 rounded-sm text-sm text-gray-600 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
          >
            + Add Images
          </button>

          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-sm border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeSelectedFile(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-[var(--gold)] text-white font-medium tracking-wider hover:bg-[var(--gold-dark)] transition-colors disabled:opacity-50"
          >
            {loading ? 'SAVING...' : isEditing ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium tracking-wider hover:bg-gray-50 transition-colors"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}
