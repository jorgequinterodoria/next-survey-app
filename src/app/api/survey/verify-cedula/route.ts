import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const BodySchema = z.object({
  campaignId: z.string().min(1),
  cedula: z.string().min(1),
})

function normalizeCedula(value: string): string {
  return value.trim().replace(/[^\d]/g, '')
}

export async function POST(request: Request) {
    try {
        const body = BodySchema.parse(await request.json())
        const campaignId = body.campaignId
        const cedula = normalizeCedula(body.cedula)
        if (!cedula) return NextResponse.json({ error: 'cedula inválida' }, { status: 400 })

        // 1. Buscamos si existe la relación participante-campaña
        const participant = await prisma.participante.findUnique({
            where: {
                cedula_campanaId: {
                    cedula,
                    campanaId: campaignId
                }
            },
            select: { id: true, cuestionarioAsignado: true }
        })

        if (!participant) {
            return NextResponse.json({ hasCompleted: false, isRegistered: false })
        }

        if (participant.cuestionarioAsignado === 'NO_APLICA') {
            return NextResponse.json({
                hasCompleted: false,
                isRegistered: true,
                cuestionarioAsignado: participant.cuestionarioAsignado,
                notEligible: true,
                reason: 'NO_APLICA'
            })
        }

        // 2. Si existe, verificamos si ya tiene una respuesta guardada
        const existingResponse = await prisma.surveyResponse.findUnique({
            where: { participanteId: participant.id }
        })

        if (existingResponse) {
            return NextResponse.json({
                hasCompleted: true,
                isRegistered: true,
                cuestionarioAsignado: participant.cuestionarioAsignado ?? null
            })
        }

        // Existe el participante pero no tiene respuesta (quizás se creó pero no finalizó)
        return NextResponse.json({
            hasCompleted: false,
            isRegistered: true,
            cuestionarioAsignado: participant.cuestionarioAsignado ?? null
        })

    } catch (error: any) {
        console.error('Verify cedula error:', error)
        return NextResponse.json(
            { error: `Error interno: ${error.message}` },
            { status: 500 }
        )
    }
}
