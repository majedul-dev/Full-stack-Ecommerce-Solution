import axios from "axios";

export const getAllUsers = async (searchParamsPromise, accessToken) => {
  try {
    const searchParams = await searchParamsPromise;
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(searchParams).map(([key, value]) => [key, String(value)])
      )
    ).toString();

    const res = await axios.get(`${process.env.BACKEND_URL}/api/all-user?${query}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
      });

    return res;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(error.message);
  }
};