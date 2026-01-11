'use client';

import Image from 'next/image';
import Link from 'next/link';
import { JewelryProduct } from '@/types/jewelry';
import { useState } from 'react';

interface ProductCardProps {
  product: JewelryProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageIndex, setImageIndex] = useState(0);

  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-sm">
        <Image
          src={product.images[imageIndex]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {product.featured && (
          <div className="absolute top-4 left-4 bg-[var(--gold)] text-white text-xs px-3 py-1 tracking-wider">
            FEATURED
          </div>
        )}

        {product.images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-1">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setImageIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === imageIndex ? 'bg-white w-6' : 'bg-white/50'
                }`}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-light tracking-wide group-hover:text-[var(--gold)] transition-colors">
            {product.name}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            {product.category}
          </p>
          <p className="text-sm font-light">${product.price.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
}
