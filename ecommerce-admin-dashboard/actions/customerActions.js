import axios from "axios";
import { getToken } from "@/lib/auth";

export async function getAllUsers(searchParamsPromise) {
  const token = await getToken();
  try {
    const searchParams = await searchParamsPromise;
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(searchParams).map(([key, value]) => [key, String(value)])
      )
    ).toString();

    const res = await axios.get(`${process.env.BACKEND_URL}/api/all-user?${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(error.message);
  }
}