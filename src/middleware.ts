import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const adminCookie = request.cookies.get('skillready_admin_session');
  const isAdmin = adminCookie?.value === 'admin_authenticated_session';

  // Protect Admin-Only API routes
  if (request.nextUrl.pathname.startsWith('/api/admin') || request.nextUrl.pathname.startsWith('/api/export-pdf')) {
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*', '/api/export-pdf'],
};
