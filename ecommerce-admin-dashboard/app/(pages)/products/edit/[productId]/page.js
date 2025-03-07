import { getProductDetails } from "@/lib/productAction";
import ProductForm from "../../../../../components/products/ProductForm";

export default async function EditProduct({params}) {
  const resolvedParams = await params;
  const { productId } = resolvedParams;
  
  const {data} = await getProductDetails(productId);
  
  return (
        <ProductForm
          product={data}
          isEditPage={true}
          productId={productId}
        />
  );
}