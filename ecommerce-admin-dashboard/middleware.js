import { NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

const publicRoutes = ['/', '/login'];

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // Redirect logged-in users from public routes to dashboard
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect logged-out users from protected routes to login
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};