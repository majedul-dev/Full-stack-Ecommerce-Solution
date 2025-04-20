import axios from 'axios';
import { getToken } from "@/lib/auth";

async function getAllOrders(searchParamsPromise) {
  const token = await getToken();
  try {
    const searchParams = await searchParamsPromise;
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(searchParams).map(([key, value]) => [key, String(value)])
      )
    ).toString();

    const res = await axios.get(`${process.env.BACKEND_URL}/api/order/allordersbyadmin?${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error(error.message);
  }
}

export default async function ({ searchParams }) {
  const { data: orders, pagination } = await getAllOrders(searchParams);
  console.log('Orders', orders)
  return (
    <div>page</div>
  )
}