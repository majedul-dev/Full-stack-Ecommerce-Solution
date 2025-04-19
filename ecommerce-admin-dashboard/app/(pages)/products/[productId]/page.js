import { getProductDetails } from "@/lib/productAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import ProductImageGallery from "./ProductImageGallery";
import ProductReviews from "./ProductReviews";

const ProductPage = async ({ params }) => {
  const { productId } = params;
  const productData = await getProductDetails(productId);

  if (!productData || !productData.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <Button asChild className="mt-4">
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const product = productData.data;

  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {product.productName}
        </h1>
        <Badge variant={product.isPublished ? "default" : "secondary"} className="ml-auto">
          {product.isPublished ? (
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> Published
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <EyeOff className="h-4 w-4" /> Unpublished
            </div>
          )}
        </Badge>
      </div>

      {/* Main content tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Left Column - Image Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductImageGallery images={product.productImage} />
              </CardContent>
            </Card>

            {/* Right Column - Product Details */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    Pricing
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/products/edit/${product._id}`}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-bold">
                      ${product.sellingPrice.toFixed(2)}
                    </span>
                    {product.discount > 0 && (
                      <>
                        <span className="text-xl line-through text-muted-foreground">
                          ${product.price.toFixed(2)}
                        </span>
                        <Badge variant="destructive" className="text-sm">
                          {product.discount}% OFF
                        </Badge>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Profit: ${(product.price - product.sellingPrice).toFixed(2)}</span>
                    <span>Margin: {((1 - (product.sellingPrice / product.price)) * 100).toFixed(2)}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Brand</p>
                      <p className="font-medium">{product.brandName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">{product.category}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">SKU</p>
                      <p className="font-mono font-medium">{product.sku}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Stock</p>
                      <p className={`font-medium ${product.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                        {product.stock} units
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {product.description}
                  </p>
                </CardContent>
              </Card>

              {/* Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Published</Label>
                      <p className="text-sm text-muted-foreground">
                        {product.isPublished ? 
                          "Product is visible to customers" : 
                          "Product is hidden from customers"}
                      </p>
                    </div>
                    <Switch
                      checked={product.isPublished}
                      disabled // Would connect to API in real implementation
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Featured</Label>
                      <p className="text-sm text-muted-foreground">
                        {product.isFeatured ? 
                          "Product appears in featured sections" : 
                          "Regular product listing"}
                      </p>
                    </div>
                    <Switch
                      checked={product.isFeatured}
                      disabled // Would connect to API in real implementation
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Section */}
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                >
                  <span>Aditional Information</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-1">
                      <Label>Created</Label>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(product.createdAt)} by {product.updatedBy}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label>Last Updated</Label>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(product.updatedAt)} by {product.updatedBy}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label>Product ID</Label>
                      <p className="text-sm font-mono text-muted-foreground">
                        {product._id}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link href={`/products/edit/${product._id}`}>
                    <Edit className="h-4 w-4 mr-2" /> Edit Product
                  </Link>
                </Button>
                <Button variant="destructive" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label>Current Stock</Label>
                    <p className="text-2xl font-medium">
                      {product.stock} units
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label>Stock Status</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                      {product.stock < 10 && product.stock > 0 && (
                        <Badge variant="warning">Low Stock</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Inventory History</Label>
                  <div className="border rounded-lg p-4 text-sm text-muted-foreground">
                    No inventory changes recorded yet
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media">
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Media Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductImageGallery images={product.productImage} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <div className="mt-6">
            <ProductReviews 
              averageRating={product.ratings}
              totalReviews={product.numberOfReviews}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductPage;