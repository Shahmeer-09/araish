'use client';

import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  material: string;
  inStock: boolean;
  featured: boolean;
  images: { id: string; mimeType: string }[];
}

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export default function ProductList({ products, onEdit, onDelete, loading }: ProductListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await onDelete(id);
    setDeleting(null);
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-sm">
        <p className="text-gray-600">No products found. Add your first product!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left p-4 text-sm font-medium text-gray-600 tracking-wider">IMAGE</th>
            <th className="text-left p-4 text-sm font-medium text-gray-600 tracking-wider">NAME</th>
            <th className="text-left p-4 text-sm font-medium text-gray-600 tracking-wider">CATEGORY</th>
            <th className="text-left p-4 text-sm font-medium text-gray-600 tracking-wider">PRICE</th>
            <th className="text-left p-4 text-sm font-medium text-gray-600 tracking-wider">STATUS</th>
            <th className="text-right p-4 text-sm font-medium text-gray-600 tracking-wider">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-4">
                {product.images.length > 0 ? (
                  <img
                    src={`/api/images/${product.images[0].id}`}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-sm"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-sm flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </td>
              <td className="p-4">
                <div className="font-medium text-gray-900">{product.name}</div>
                <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
              </td>
              <td className="p-4">
                <span className="capitalize text-gray-700">{product.category}</span>
              </td>
              <td className="p-4">
                <span className="text-gray-900">${product.price.toLocaleString()}</span>
              </td>
              <td className="p-4">
                <div className="flex flex-col gap-1">
                  <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                    product.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {product.featured && (
                    <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-[var(--gold)] bg-opacity-20 text-[var(--gold-dark)]">
                      Featured
                    </span>
                  )}
                </div>
              </td>
              <td className="p-4 text-right">
                {deleteConfirm === product.id ? (
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-sm text-gray-600">Delete?</span>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deleting === product.id}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      {deleting === product.id ? '...' : 'Yes'}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="px-3 py-1.5 border border-[var(--gold)] text-[var(--gold)] text-sm rounded hover:bg-[var(--gold)] hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product.id)}
                      className="px-3 py-1.5 border border-red-400 text-red-500 text-sm rounded hover:bg-red-500 hover:text-white transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
