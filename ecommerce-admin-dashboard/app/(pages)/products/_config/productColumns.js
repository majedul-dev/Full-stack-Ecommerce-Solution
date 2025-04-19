import Link from "next/link";

export const statusColors = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    archived: 'bg-red-100 text-red-800',
};
  
export const productColumns = [
    {
      key: 'product',
      header: 'Product',
      sortable: false,
    renderCell: (product) => (
        <Link href={`/products/${product._id}`}>
          <div className="flex items-center">
            <img
              src={product.productImage[0]}
              alt={product.name}
              className="h-12 w-12 object-cover rounded-md mr-4 border border-gray-200"
            />
            <div>
              <div className="font-medium">{product.productName}</div>
              <div className="text-sm text-gray-500">
                Added: {new Date(product.createdAt).toISOString().split('T')[0]}
              </div>
            </div>
          </div>
        </Link>
      )
    },
    { key: 'sku', header: 'SKU', sortable: true },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      renderCell: (product) => `$${product.price}`
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      renderCell: (product) => {
        const stockStatus = (stock) => {
          if (stock > 10) return 'In Stock';
          if (stock > 0) return 'Low Stock';
          return 'Out of Stock';
        };
        const stockColor = (stock) => {
          if (stock > 10) return 'text-green-600';
          if (stock > 0) return 'text-yellow-600';
          return 'text-red-600';
        };
        return (
          <>
            <span className={`text-sm ${stockColor(product.stock)}`}>
              {stockStatus(product.stock)}
            </span>
            <div className="text-xs text-gray-500">
              {product.stock} units
            </div>
          </>
        );
      }
    },
    { key: 'category', header: 'Category' },
    {
      key: 'status',
      header: 'Status',
      renderCell: (product) => (
        <span className={`px-2 py-1 rounded-full text-xs ${statusColors[product.status]}`}>
          {product.status}
        </span>
      )
    },
  ];