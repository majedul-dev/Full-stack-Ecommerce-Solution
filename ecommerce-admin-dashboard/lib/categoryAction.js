"use server";

export const createCategory = async (formData, accessToken) => {
    try {
        const response = await fetch(`https://8080-mazedul956-ecommercesol-vh0txgc5lvq.ws-us118.gitpod.io/api/category`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error("Failed to create category");
        }
    
        return response.json();
    } catch (error) {
        console.log(error);
        return { error: "Failed to create Category" };
    }
}

export const updateCategory = async (id, formData, accessToken) => {
    console.log(id)
    try {
        const response = await fetch(`https://8080-mazedul956-ecommercesol-vh0txgc5lvq.ws-us118.gitpod.io/api/category/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error("Failed to update category");
        }
    
        return response.json();
    } catch (error) {
        console.log(error);
        return { error: "Failed to update Category" };
    }
}

export const deleteCategory = async (catId, accessToken) => {
    try {
        const response = await fetch(`https://8080-mazedul956-ecommercesol-vh0txgc5lvq.ws-us118.gitpod.io/api/category/${catId}`, {
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