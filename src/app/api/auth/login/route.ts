import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { password } = body;

        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

        if (!ADMIN_PASSWORD) {
            console.error('ADMIN_PASSWORD is not set in environment variables.');
            return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
        }

        if (password === ADMIN_PASSWORD) {
            // Set an HTTP-only cookie
            const cookieStore = await cookies();
            cookieStore.set('admin_token', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
        }

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'An error occurred during login.' }, { status: 500 });
    }
}
