import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicRoutes = ['/', '/login'];
const authRoutes = ['/dashboard']; // Add other protected routes here

export async function middleware(request) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const { pathname } = request.nextUrl;

  // Redirect logged-in users away from public routes
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users from protected routes to login
  if (!token && !publicRoutes.includes(pathname) && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$).*)',
  ],
};