import React, { useState } from 'react';
import { generateImageSrcSet } from '../utils/responsiveUtils';

/**
 * ResponsiveImage Component
 * Provides responsive image handling with srcset and proper sizing
 * 
 * @param {string} src - Base image source URL
 * @param {string} alt - Image alt text
 * @param {string} sizes - Image sizes for responsive layout
 * @param {string} className - Additional CSS classes
 * @param {string} width - Image width (CSS)
 * @param {string} height - Image height (CSS)
 * @param {boolean} responsive - Enable responsive sizing
 * @param {string} objectFit - CSS object-fit value
 * @param {ReactNode} fallback - Fallback while loading
 */
const ResponsiveImage = ({
  src,
  alt,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  className = '',
  width,
  height,
  responsive = true,
  objectFit = 'cover',
  fallback = null,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);


  const srcSet = responsive ? generateImageSrcSet(src, ['640', '1024', '1440']) : undefined;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && fallback && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          {fallback}
        </div>
      )}
      <img
        src={src}
        alt={alt}
        srcSet={srcSet}
        sizes={sizes}
        style={{
          width: width || '100%',
          height: height || 'auto',
          objectFit,
        }}
        onLoad={() => setIsLoading(false)}
        className={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
      />
    </div>
  );
};

export default ResponsiveImage;
