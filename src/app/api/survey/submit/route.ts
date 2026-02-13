import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { processSurveyAnswers } from '@/lib/survey-calculator'
import {
    fichaQuestions,
    formaASections,
    formaBSections,
    extralaboralSections,
    estresQuestions
} from '@/data/surveyData'

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

        // --- VALIDATION START ---
        const missingErrors: string[] = []

        // 1. Validate Consent
        if (!consentAccepted) missingErrors.push('Debe aceptar el consentimiento informado.')
        if (!consentName?.trim()) missingErrors.push('Falta el nombre en el consentimiento.')
        if (!consentDoc?.trim()) missingErrors.push('Falta el documento en el consentimiento.')

        // 2. Validate Ficha
        if (fichaAnswers) {
            fichaQuestions.forEach((q) => {
                if (q.subfields) {
                    q.subfields.forEach((sf) => {
                        if (!fichaAnswers[sf.key]?.trim()) {
                            missingErrors.push(`Ficha: ${q.texto} (${sf.label})`)
                        }
                    })
                } else {
                    if (!fichaAnswers[`ficha_${q.id}`]?.trim()) {
                        missingErrors.push(`Ficha: ${q.texto}`)
                    }
                }
            })
        } else {
            missingErrors.push('Faltan los datos de la ficha general.')
        }

        // 3. Validate Intralaboral
        if (intralaboralAnswers) {
            const sections = formType === 'A' ? formaASections : formaBSections
            sections.forEach((section) => {
                // Logic for filtered sections (Clientes, Jefatura):
                // If the section has a filter, we assume it's skipped if NO questions are answered.
                // If ANY question is answered, we validate ALL questions in that section.
                let shouldValidate = true
                if (section.filtro) {
                    const hasAnyAnswer = section.preguntas.some(
                        (q) => intralaboralAnswers[`${section.key}_${q.id}`]
                    )
                    if (!hasAnyAnswer) {
                        shouldValidate = false
                    }
                }

                if (shouldValidate) {
                    section.preguntas.forEach((q) => {
                        if (!intralaboralAnswers[`${section.key}_${q.id}`]) {
                            missingErrors.push(`Intralaboral - ${section.titulo}: Pregunta ${q.id}`)
                        }
                    })
                }
            })
        } else {
            missingErrors.push('Faltan las respuestas del cuestionario Intralaboral.')
        }

        // 4. Validate Extralaboral
        if (extralaboralAnswers) {
            extralaboralSections.forEach((section) => {
                section.preguntas.forEach((q) => {
                    if (!extralaboralAnswers[`${section.key}_${q.id}`]) {
                        missingErrors.push(`Extralaboral - ${section.titulo}: Pregunta ${q.id}`)
                    }
                })
            })
        } else {
             missingErrors.push('Faltan las respuestas del cuestionario Extralaboral.')
        }

        // 5. Validate Estres
        if (estresAnswers) {
            estresQuestions.forEach((q) => {
                if (!estresAnswers[`estres_${q.id}`]) {
                    missingErrors.push(`Estrés: Pregunta ${q.id}`)
                }
            })
        } else {
            missingErrors.push('Faltan las respuestas del cuestionario de Estrés.')
        }

        if (missingErrors.length > 0) {
            return NextResponse.json(
                { error: 'Faltan preguntas por responder', details: missingErrors },
                { status: 400 }
            )
        }
        // --- VALIDATION END ---

        // 1. Calculate Results
        const results = processSurveyAnswers(
            formType,
            fichaAnswers,
            intralaboralAnswers,
            extralaboralAnswers,
            estresAnswers
        )

        // 2. Check if participant exists for this campaign
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

        // 3. Create Response
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
                filters: {}, // TODO: Extract filters from fichaAnswers if needed
                results: results as any // Guardar resultados procesados
            }
        })

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Submission error:', error)
        return NextResponse.json({ error: `Error interno: ${error.message}` }, { status: 500 })
    }
}
