import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET(request: Request) {
    // SECURITY: In production, delete this file or protect it!
    try {
        const url = new URL(request.url)
        const secret = url.searchParams.get('secret')

        if (secret !== 'yachtadmin123') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const email = 'admin@yachtclubindia.com'
        const password = 'yachtadmin123'
        
        const existingUser = await prisma.user.findUnique({ where: { email } })
        
        if (existingUser) {
            return NextResponse.json({ message: 'Admin user already exists.' });
        }

        const hashedPassword = await hashPassword(password)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        })

        return NextResponse.json({
            message: 'Admin user created successfully!',
            email: user.email
        });

    } catch (err: any) {
        console.error('Setup Error:', err);
        return NextResponse.json({ error: 'Failed to create user', details: err.message }, { status: 500 });
    }
}
