import { cookies } from 'next/headers'
import { encrypt, decrypt } from './jwt'

export { encrypt, decrypt }

export async function login(formData: FormData) {
    // Logic to be implemented in API route or server action
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    if (!session) return null
    return await decrypt(session)
}

export async function updateSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    if (!session) return

    // Refresh session if needed
    const parsed = await decrypt(session)
    parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const newToken = await encrypt(parsed)

    cookieStore.set('session', newToken, {
        httpOnly: true,
        secure: true,
        expires: parsed.expires,
        sameSite: 'lax',
        path: '/',
    })
}
