'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginForm from '@/components/admin/LoginForm';
import ProductForm from '@/components/admin/ProductForm';
import ProductList from '@/components/admin/ProductList';
import SettingsForm from '@/components/admin/SettingsForm';

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

type ActiveTab = 'products' | 'settings';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('products');

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/check');
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated, fetchProducts]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen" suppressHydrationWarning>
        <Header />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <div className="inline-block w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen" suppressHydrationWarning>
        <Header />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Authenticated - show admin panel
  return (
    <div className="min-h-screen" suppressHydrationWarning>
      {/* <Header /> */}

      <main className="pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif tracking-[0.15em]">
                ADMIN PANEL
              </h1>
              <div className="w-16 h-px bg-[var(--gold)] mt-3" />
            </div>
            <div className="flex items-center gap-4">
              {activeTab === 'products' && !showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-5 py-2.5 bg-[var(--gold)] text-white font-medium tracking-wider hover:bg-[var(--gold-dark)] transition-colors"
                >
                  + ADD PRODUCT
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium tracking-wider hover:bg-gray-100 transition-colors"
              >
                LOGOUT
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => { setActiveTab('products'); setShowForm(false); setEditingProduct(null); }}
              className={`pb-4 px-2 text-sm tracking-wider transition-colors ${
                activeTab === 'products'
                  ? 'border-b-2 border-[var(--gold)] text-[var(--gold)]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              PRODUCTS
            </button>
            <button
              onClick={() => { setActiveTab('settings'); setShowForm(false); setEditingProduct(null); }}
              className={`pb-4 px-2 text-sm tracking-wider transition-colors ${
                activeTab === 'settings'
                  ? 'border-b-2 border-[var(--gold)] text-[var(--gold)]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              SITE SETTINGS
            </button>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'products' && (
            <>
              {showForm ? (
                <ProductForm
                  product={editingProduct || undefined}
                  onSuccess={handleFormSuccess}
                  onCancel={handleFormCancel}
                />
              ) : (
                <div className="bg-white rounded-sm shadow-lg border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-serif tracking-[0.1em]">
                      PRODUCTS ({products.length})
                    </h2>
                  </div>
                  <ProductList
                    products={products}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                  />
                </div>
              )}
            </>
          )}

          {activeTab === 'settings' && (
            <SettingsForm
              onSuccess={() => setActiveTab('products')}
              onCancel={() => setActiveTab('products')}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
