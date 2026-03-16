'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { createSession, destroySession, verifyPassword, hashPassword, verifyAuth } from '@/lib/auth'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
        return { error: 'Invalid credentials' }
    }

    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
        return { error: 'Invalid credentials' }
    }

    await createSession(user.id, user.email)

    revalidatePath('/admin', 'layout')
    redirect('/admin')
}

export async function resetPassword(formData: FormData) {
    const email = formData.get('email') as string

    if (!email) {
        return { error: 'Email is required' }
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        // Silent fail for security
        return { success: 'If that email exists, a reset link has been sent' }
    }

    // Since custom email flow requires a mailer setup like Resend or Sendgrid,
    // we will notify that it is not implemented for this boilerplate yet.
    return { error: 'Email services are currently offline. Please contact an administrator.' }
}

export async function updatePassword(formData: FormData) {
    const password = formData.get('password') as string

    if (!password) {
        return { error: 'Password is required' }
    }

    const session = await verifyAuth()
    if (!session || !session.userId) {
        return { error: 'Unauthorized to update password' }
    }

    const hashedPassword = await hashPassword(password)
    await prisma.user.update({
        where: { id: session.userId as string },
        data: { password: hashedPassword }
    })

    revalidatePath('/admin', 'layout')
    redirect('/admin')
}

export async function logout() {
    await destroySession()
    revalidatePath('/', 'layout')
    redirect('/admin/login')
}
