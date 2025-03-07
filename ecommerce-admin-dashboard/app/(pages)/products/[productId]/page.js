import React from "react";
import { getProductDetails } from "@/lib/productAction";
import ProductImageGallery from "./ProductImageGallery";
import ProductReviews from "./ProductReviews";

const ProductPage = async ({ params }) => {
  const { productId } = params;
  const productData = await getProductDetails(productId);

  if (!productData || !productData.data) return <div>Product not found</div>;

  const product = productData.data; // Extract product info

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Product Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{product.productName}</h1>
        <span className={`px-4 py-2 rounded-full ${product.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {product.isPublished ? 'Published' : 'Unpublished'}
        </span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <ProductImageGallery images={product.productImage} />

        {/* Product Info */}
        <div className="space-y-6">
          {/* Pricing Section */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-blue-600">
                ${product.sellingPrice}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-xl line-through text-gray-500">
                    ${product.price}
                  </span>
                  <span className="text-xl font-semibold text-green-600">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Admin Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Stock</h3>
              <p className={`text-2xl ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                {product.stock} units
              </p>
            </div>
            <div className="p-4 bg-white border rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">SKU</h3>
              <p className="text-2xl font-mono">{product.sku}</p>
            </div>
          </div>

          {/* Admin Controls */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Edit Product
              </button>
              <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete Product
              </button>
            </div>

            {/* <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={product.isFeatured}
                  className="w-5 h-5 text-blue-600"
                  onChange={(e) => {
                    // Add your update logic here, typically:
                    // 1. API call to update featured status
                    // 2. Update local state/context
                    console.log('Featured status changed:', e.target.checked);
                  }}
                />
                <span className="font-medium">Featured Product</span>
              </label>
            </div> */}
          </div>

          {/* Product Metadata */}
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="font-medium">Brand:</span>
              <span>{product.brandName}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium">Category:</span>
              <span>{product.category}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium">Created:</span>
              <span>{new Date(product.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium">Last Updated:</span>
              <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-8 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-4">Product Description</h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
          {product.description}
        </p>
      </div>

      {/* Add Reviews Section */}
      <ProductReviews 
        averageRating={product.ratings}
        totalReviews={product.numberOfReviews}
        // Pass real reviews data when available
        // reviews={product.reviews}
      />
    </div>
  );
};

export default ProductPage;
