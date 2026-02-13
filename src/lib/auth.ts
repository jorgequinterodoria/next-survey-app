import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.JWT_SECRET || 'your-secret-key'
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key)
}

export async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        return null
    }
}

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
