import { useSession, signOut } from "next-auth/react";

export default function SignOutButton() {
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    try {
      // 1. Call external API logout
      const apiResponse = await fetch(`https://8080-mazedul956-ecommercesol-vh0txgc5lvq.ws-us118.gitpod.io/api/userLogout`, {
        method: 'POST'
      });
      const res = await apiResponse.json()

      if (!res.success) {
        throw new Error('logout failed');
      }

      // 2. Clear NextAuth session
      await signOut({
        redirect: true,
        callbackUrl: "/login"
      });

    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <form action={handleLogout}>
      <button
        type="submit"
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Sign Out
      </button>
    </form>
  );
}
