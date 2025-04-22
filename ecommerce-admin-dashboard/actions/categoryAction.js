"use server";
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