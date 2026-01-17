'use client';

import { useState, useRef, useEffect } from 'react';

interface SettingsFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SettingsForm({ onSuccess, onCancel }: SettingsFormProps) {
  const [bannerTitle, setBannerTitle] = useState('LUXE');
  const [bannerSubtitle, setBannerSubtitle] = useState('Exquisite Handcrafted Jewelry');
  const [shopNameUrdu, setShopNameUrdu] = useState('');
  const [hasBannerImage, setHasBannerImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeBanner, setRemoveBanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingSettings, setFetchingSettings] = useState(true);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setBannerTitle(data.bannerTitle || 'LUXE');
        setBannerSubtitle(data.bannerSubtitle || 'Exquisite Handcrafted Jewelry');
        setShopNameUrdu(data.shopNameUrdu || '');
        setHasBannerImage(data.hasBannerImage);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setFetchingSettings(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRemoveBanner(false);
    }
  };

  const handleRemoveBanner = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setRemoveBanner(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('bannerTitle', bannerTitle);
      formData.append('bannerSubtitle', bannerSubtitle);
      formData.append('shopNameUrdu', shopNameUrdu);
      
      if (selectedFile) {
        formData.append('bannerImage', selectedFile);
      }
      
      if (removeBanner) {
        formData.append('removeBanner', 'true');
      }

      const response = await fetch('/api/settings', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save settings');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingSettings) {
    return (
      <div className="bg-white p-6 rounded-sm shadow-lg border border-gray-200">
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-sm shadow-lg border border-gray-200">
      <h3 className="text-xl font-serif tracking-[0.1em] mb-6">
        SITE SETTINGS
      </h3>
      <div className="w-12 h-px bg-[var(--gold)] mb-6" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Title
          </label>
          <input
            type="text"
            value={bannerTitle}
            onChange={(e) => setBannerTitle(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-[var(--gold)]"
            placeholder="e.g., LUXE"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Subtitle
          </label>
          <input
            type="text"
            value={bannerSubtitle}
            onChange={(e) => setBannerSubtitle(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-[var(--gold)]"
            placeholder="e.g., Exquisite Handcrafted Jewelry"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shop Name (Urdu) - نام دکان
          </label>
          <input
            type="text"
            value={shopNameUrdu}
            onChange={(e) => setShopNameUrdu(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-[var(--gold)] text-right"
            placeholder="مثلاً: زیورات کی دکان"
            dir="rtl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Background Image
          </label>
          
          {/* Current/Preview Image */}
          {(previewUrl || (hasBannerImage && !removeBanner)) && (
            <div className="relative mb-4">
              <div className="relative h-48 w-full overflow-hidden rounded-sm border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl || `/api/settings/banner?t=${Date.now()}`}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="text-white text-lg font-serif tracking-widest">
                    {bannerTitle}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveBanner}
                className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-dashed border-gray-400 rounded-sm text-sm text-gray-600 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
          >
            {hasBannerImage || selectedFile ? '+ Change Image' : '+ Upload Image'}
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            Recommended size: 1920x1080 pixels. If no image is set, a default image will be used.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-[var(--gold)] text-white font-medium tracking-wider hover:bg-[var(--gold-dark)] transition-colors disabled:opacity-50"
          >
            {loading ? 'SAVING...' : 'SAVE SETTINGS'}
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
