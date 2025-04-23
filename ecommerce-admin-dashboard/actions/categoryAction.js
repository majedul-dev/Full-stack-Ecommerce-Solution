import axios from "axios";

export const deleteCategory = async (catId, accessToken) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/category/${catId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            }
        });
        if (!response.ok) {
            throw new Error("Failed to delete category");
        }
    
        return response.json();
    } catch (error) {
        console.log(error);
        return { error: "Failed to delete category" };
    }
}

export async function getCategories(searchParams) {
    try {
      const query = new URLSearchParams(
        Object.fromEntries(
          Object.entries(searchParams).map(([key, value]) => [key, String(value)])
        )
      ).toString();
  
      const res = await axios.get(`${process.env.BACKEND_URL}/api/category?${query}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error(error.message);
    }
  }