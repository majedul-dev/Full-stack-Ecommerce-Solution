"use client"

import { useState } from 'react';

const ProductImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
        <img 
          src={selectedImage} 
          alt="Main product" 
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`aspect-square rounded-lg overflow-hidden border-2 ${
              selectedImage === img ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            <img 
              src={img} 
              alt={`Thumbnail ${index + 1}`} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;