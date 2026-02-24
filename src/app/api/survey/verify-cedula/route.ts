import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { campaignId, cedula } = body

        if (!campaignId || !cedula) {
            return NextResponse.json(
                { error: 'campaignId and cedula are required' },
                { status: 400 }
            )
        }

        // 1. Buscamos si existe la relación participante-campaña
        const participant = await prisma.participante.findUnique({
            where: {
                cedula_campanaId: {
                    cedula,
                    campanaId: campaignId
                }
            }
        })

        if (!participant) {
            // El participante no existe para esta campaña, por ende no la ha completado
            return NextResponse.json({ hasCompleted: false })
        }

        // 2. Si existe, verificamos si ya tiene una respuesta guardada
        const existingResponse = await prisma.surveyResponse.findUnique({
            where: { participanteId: participant.id }
        })

        if (existingResponse) {
            return NextResponse.json({ hasCompleted: true })
        }

        // Existe el participante pero no tiene respuesta (quizás se creó pero no finalizó)
        return NextResponse.json({ hasCompleted: false })

    } catch (error: any) {
        console.error('Verify cedula error:', error)
        return NextResponse.json(
            { error: `Error interno: ${error.message}` },
            { status: 500 }
        )
    }
}
