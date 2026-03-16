import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const secretKey = process.env.JWT_SECRET || 'fallback-super-secret-key-for-dev'
const encodedKey = new TextEncoder().encode(secretKey)

interface SessionPayload {
    userId: string
    email: string
    [key: string]: any
}

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
    if (!session) return null
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload as SessionPayload
    } catch (error) {
        return null
    }
}

export async function createSession(userId: string, email: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const sessionCookie = await encrypt({ userId, email, expiresAt })

    const cookieStore = await cookies()
    
    // @ts-ignore
    cookieStore.set('admin_session', sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}

export async function verifyAuth() {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin_session')?.value
    return await decrypt(session)
}

export async function destroySession() {
    const cookieStore = await cookies()
    // @ts-ignore
    cookieStore.delete('admin_session')
}

export async function hashPassword(password: string) {
    return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash)
}
