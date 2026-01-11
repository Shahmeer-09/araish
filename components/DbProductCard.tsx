'use client';

import Link from 'next/link';
import { useState } from 'react';

interface DbProduct {
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

interface DbProductCardProps {
  product: DbProduct;
}

export default function DbProductCard({ product }: DbProductCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = product.images.length > 0 
    ? `/api/images/${product.images[imageIndex].id}`
    : '/placeholder.jpg';

  return (
    <Link 
      href={`/product/${product.id}`} 
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-[var(--cream)] rounded-sm royal-shadow hover-lift">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered ? 'scale-110 brightness-105' : 'scale-100'
          }`}
        />

        {/* Elegant overlay gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Shimmer effect on hover */}
        <div className={`absolute inset-0 animate-shimmer transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {product.featured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] text-white text-xs px-4 py-1.5 tracking-[0.15em] font-medium shadow-lg">
            ✦ FEATURED
          </div>
        )}

        {product.images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setImageIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === imageIndex 
                    ? 'bg-[var(--gold)] w-6 shadow-lg' 
                    : 'bg-white/60 w-1.5 hover:bg-white'
                }`}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Quick view hint */}
        <div className={`absolute bottom-4 left-4 text-white text-xs tracking-[0.2em] uppercase transition-all duration-500 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          View Details →
        </div>
      </div>

      <div className="mt-5 space-y-2 px-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium tracking-wide group-hover:text-[var(--gold)] transition-colors duration-300">
            {product.name}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 uppercase tracking-[0.15em]">
            {product.category}
          </p>
          <p className="text-sm font-medium text-[var(--gold-dark)]">
            Rs. {product.price.toLocaleString()}
          </p>
        </div>
        {/* Elegant underline animation */}
        <div className={`h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent transition-all duration-500 ${
          isHovered ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
        }`} />
      </div>
    </Link>
  );
}
