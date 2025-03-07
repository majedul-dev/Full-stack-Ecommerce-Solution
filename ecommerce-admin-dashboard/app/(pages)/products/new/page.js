// app/products/new/page.js
"use client";
import ProductForm from "../../../../components/products/ProductForm";

export default function CreateProduct() {
  // const handleDeleteImage = async (publicId, deleteToken) => {
  //   try {
  //     // 3. Make the delete request
  //     const response = await fetch(
  //       `https://api.cloudinary.com/v1_1/majedul/image/destroy`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           public_id: publicId,
  //           token: deleteToken,
  //         }),
  //         credentials: "include",
  //       }
  //     );

  //     // 4. Handle the response
  //     const result = await response.json();

  //     console.log(result);

  //     if (result.result !== "ok") {
  //       throw new Error("Failed to delete image from Cloudinary");
  //     }

  //     // 5. Update local state after successful deletion
  //     setProductData((prev) => ({
  //       ...prev,
  //       productImage: prev.productImage.filter(
  //         (image) => image.public_id !== publicId
  //       ),
  //     }));
  //   } catch (error) {
  //     console.error("Delete error:", error);
  //     // Handle errors in your UI here
  //   }
  // };

  
  return (
      <ProductForm />
  );
}