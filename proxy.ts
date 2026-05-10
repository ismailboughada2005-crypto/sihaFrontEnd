import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of routes that require specific roles
const ROLE_BASED_ROUTES = {
  admin: ['/patients', '/doctors', '/staff-management', '/admins', '/analytics'],
  staff: ['/patients', '/payments', '/appointments'],
  doctor: ['/doctor-appointments', '/settings']
};

// Routes that any authenticated user can access
const AUTHENTICATED_ROUTES = ['/settings', '/profile'];

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const role = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  // 1. If trying to access dashboard/protected routes without a token, redirect to login
  // Note: Since this is a single-page app style with a main entry point, 
  // we check if the user is attempting to access protected paths.
  const isLoginPage = pathname === '/login';
  
  if (!token && !isLoginPage && pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. If authenticated, prevent access to routes not allowed for the role
  if (token && role) {
    // Redirect away from login if already authenticated
    if (isLoginPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Role-based protection for /patients
    if (pathname.startsWith('/patients')) {
      if (role !== 'admin' && role !== 'staff') {
        // Redirect doctors or unauthorized roles to dashboard
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Protection for other administrative routes
    if (pathname.startsWith('/doctors') || pathname.startsWith('/staff-management') || pathname.startsWith('/admins')) {
      if (role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
    
    // Doctor specific routes
    if (pathname.startsWith('/doctor-appointments')) {
      if (role !== 'doctor') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/patients/:path*',
    '/doctors/:path*',
    '/staff-management/:path*',
    '/admins/:path*',
    '/doctor-appointments/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/payments/:path*'
  ],
};
