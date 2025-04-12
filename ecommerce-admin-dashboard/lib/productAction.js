import axios from "axios";

export const getAllProducts = async (searchParamsPromise) => {
  try {
    const searchParams = await searchParamsPromise;
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(searchParams).map(([key, value]) => [key, String(value)])
      )
    ).toString();

    const res = await axios.get(`${process.env.BACKEND_URL}/api/product/get-product?${query}`);

    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(error.message);
  }
};

export async function getProductDetails(productId) {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/product/product-details/${productId}`,
      {
        cache: "no-store", // Ensures fresh data
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null; // Return null instead of crashing
  }
}

export const createNewProduct =  async (productData, accessToken) => {
  try {
    const response = await axios.post(`${process.env.BACKEND_URL}/api/product/upload-product`, productData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
    })

    return response.data
  } catch (error) {
    console.log(error)
    if (error.response) {
      console.error("Server responded with:", error.response.data);
      console.error("Status code:", error.response.status);
    } else if (error.request) {
      console.error("No response received from server:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}

export const updateProduct =  async (productData, productId, accessToken) => {
  try {
    const response = await axios.patch(`${process.env.BACKEND_URL}/api/product/update-product/${productId}`, productData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
    })

    return response.data
  } catch (error) {
    if (error.response) {
      console.error("Server responded with:", error.response.data);
      console.error("Status code:", error.response.status);
    } else if (error.request) {
      console.error("No response received from server:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
  }
}