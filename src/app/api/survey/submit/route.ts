import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            campaignId,
            cedula,
            email,
            consentName,
            consentDoc,
            consentAccepted,
            formType,
            fichaAnswers,
            intralaboralAnswers,
            extralaboralAnswers,
            estresAnswers
        } = body

        // 1. Check if participant exists for this campaign
        let participant = await prisma.participante.findUnique({
            where: {
                cedula_campanaId: {
                    cedula,
                    campanaId: campaignId
                }
            }
        })

        if (participant) {
            // Check if they already have a response
            const existingResponse = await prisma.surveyResponse.findUnique({
                where: { participanteId: participant.id }
            })
            if (existingResponse) {
                return NextResponse.json({ error: 'Ya has completado esta encuesta.' }, { status: 409 })
            }
        } else {
            // Create participant
            participant = await prisma.participante.create({
                data: {
                    cedula,
                    campanaId: campaignId,
                    email: email || null
                }
            })
        }

        // 2. Create Response
        await prisma.surveyResponse.create({
            data: {
                participanteId: participant.id,
                consentName,
                consentDoc,
                consentAccepted,
                formType,
                fichaData: fichaAnswers,
                intralaboralData: intralaboralAnswers,
                extralaboralData: extralaboralAnswers,
                estresData: estresAnswers,
                filters: {} // TODO: Extract filters from fichaAnswers if needed
            }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Submission error:', error)
        return NextResponse.json({ error: 'Failed to submit survey' }, { status: 500 })
    }
}
