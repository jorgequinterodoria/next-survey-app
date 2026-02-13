import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Missing credentials' },
                { status: 400 }
            )
        }

        const admin = await prisma.admin.findUnique({
            where: { email },
        })

        if (!admin) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        const isValid = await bcrypt.compare(password, admin.password)

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Create session
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
        const session = await encrypt({ adminId: admin.id, email: admin.email, expires })

        // Save session in a cookie
        const cookieStore = await cookies()
        cookieStore.set('session', session, {
            httpOnly: true,
            secure: true,
            expires,
            sameSite: 'lax',
            path: '/'
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
