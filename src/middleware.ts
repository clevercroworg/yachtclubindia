import { NextResponse, type NextRequest } from 'next/server'
import { decrypt } from './lib/auth'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 2. Protect /admin routes
    if (pathname.startsWith('/admin')) {
        const session = request.cookies.get('admin_session')?.value
        const payload = session ? await decrypt(session) : null
        const user = payload ? payload.userId : null

        // Skip protection for the login/auth pages themselves
        if (
            pathname === '/admin/login' ||
            pathname === '/admin/forgot-password' ||
            pathname === '/admin/update-password'
        ) {
            // But if they ARE logged in, redirect them away from the login page to the dashboard.
            if (user && pathname !== '/admin/update-password') {
                return NextResponse.redirect(new URL('/admin', request.url))
            }
            return NextResponse.next()
        }

        // If no user is logged in, redirect to the login page
        if (!user) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api (API routes, except auth callbacks)
         */
        '/((?!_next/static|_next/image|favicon.ico|api/(?!auth/callback)).*)',
    ],
}
