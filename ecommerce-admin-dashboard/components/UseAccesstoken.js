"use client";

import { useSession } from "next-auth/react";

const useAccessToken = () => {
  const { data: session, status } = useSession();
  if (status === "loading") return null;
  return session?.accessToken || session?.user?.accessToken || "";
};

export default useAccessToken;
