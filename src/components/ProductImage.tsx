'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function ProductImage({ src, alt, fill, width, height, className, sizes, priority }: ProductImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900',
          fill && 'absolute inset-0',
          className
        )}
      >
        <div className="text-center p-2">
          <Package className="h-8 w-8 mx-auto text-slate-400 mb-1" />
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setError(true)}
    />
  );
}
