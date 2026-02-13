import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
        return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    try {
        const campaign = await prisma.campana.findUnique({
            where: { token },
            include: { empresa: true },
        })

        if (!campaign) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
        }

        if (!campaign.isActive) {
            return NextResponse.json({ error: 'Campaign is inactive' }, { status: 403 })
        }

        return NextResponse.json({
            valid: true,
            campaign: {
                id: campaign.id,
                name: campaign.name,
                empresa: campaign.empresa.name
            }
        })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
