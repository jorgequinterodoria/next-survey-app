'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

export async function createAdmin(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) return { error: 'Email and password are required' }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
            },
        })
        revalidatePath('/admin/admins')
        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: 'Failed to create admin' }
    }
}

export async function createCompany(formData: FormData) {
    const name = formData.get('name') as string
    const nit = formData.get('nit') as string

    if (!name) return { error: 'Name is required' }

    try {
        await prisma.empresa.create({
            data: { name, nit },
        })
        revalidatePath('/admin/companies')
        revalidatePath('/admin/campaigns')
        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: 'Failed to create company' }
    }
}

export async function createCampaign(formData: FormData) {
    const name = formData.get('name') as string
    const empresaId = formData.get('empresaId') as string
    
    // Evaluator data
    const evaluadorNombre = formData.get('evaluadorNombre') as string || null
    const evaluadorId = formData.get('evaluadorId') as string || null
    const evaluadorProfesion = formData.get('evaluadorProfesion') as string || null
    const evaluadorPostgrado = formData.get('evaluadorPostgrado') as string || null
    const evaluadorTarjeta = formData.get('evaluadorTarjeta') as string || null
    const evaluadorLicencia = formData.get('evaluadorLicencia') as string || null
    const evaluadorLicenciaFecha = formData.get('evaluadorLicenciaFecha') as string || null

    if (!name || !empresaId) return { error: 'Name and Company are required' }

    try {
        // Generate unique token
        const token = randomBytes(16).toString('hex')

        await prisma.campana.create({
            data: {
                name,
                empresaId,
                token,
                evaluadorNombre,
                evaluadorId,
                evaluadorProfesion,
                evaluadorPostgrado,
                evaluadorTarjeta,
                evaluadorLicencia,
                evaluadorLicenciaFecha
            },
        })
        revalidatePath('/admin/campaigns')
        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: 'Failed to create campaign' }
    }
}

export async function toggleCampaignStatus(id: string, isActive: boolean) {
    try {
        await prisma.campana.update({
            where: { id },
            data: { isActive },
        })
        revalidatePath('/admin/campaigns')
        return { success: true }
    } catch (error) {
        return { error: 'Failed to update status' }
    }
}

const updateCampaignSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    evaluadorNombre: z.string().nullable(),
    evaluadorId: z.string().nullable(),
    evaluadorProfesion: z.string().nullable(),
    evaluadorPostgrado: z.string().nullable(),
    evaluadorTarjeta: z.string().nullable(),
    evaluadorLicencia: z.string().nullable(),
    evaluadorLicenciaFecha: z.string().nullable(),
    removeFirma: z.boolean(),
})

function toNullIfBlank(value: FormDataEntryValue | null): string | null {
    if (typeof value !== 'string') return null
    const trimmed = value.trim()
    return trimmed.length ? trimmed : null
}

export async function updateCampaign(formData: FormData) {
    const id = formData.get('id') as string
    const name = formData.get('name') as string

    const evaluadorNombre = toNullIfBlank(formData.get('evaluadorNombre'))
    const evaluadorId = toNullIfBlank(formData.get('evaluadorId'))
    const evaluadorProfesion = toNullIfBlank(formData.get('evaluadorProfesion'))
    const evaluadorPostgrado = toNullIfBlank(formData.get('evaluadorPostgrado'))
    const evaluadorTarjeta = toNullIfBlank(formData.get('evaluadorTarjeta'))
    const evaluadorLicencia = toNullIfBlank(formData.get('evaluadorLicencia'))
    const evaluadorLicenciaFecha = toNullIfBlank(formData.get('evaluadorLicenciaFecha'))
    const removeFirma = formData.get('removeFirma') === '1'

    const parsed = updateCampaignSchema.safeParse({
        id,
        name,
        evaluadorNombre,
        evaluadorId,
        evaluadorProfesion,
        evaluadorPostgrado,
        evaluadorTarjeta,
        evaluadorLicencia,
        evaluadorLicenciaFecha,
        removeFirma,
    })

    if (!parsed.success) return { error: 'Datos inválidos para actualizar campaña' }

    const firmaFile = formData.get('evaluadorFirmaFile')

    let evaluadorFirma: string | null | undefined = undefined
    if (removeFirma) {
        evaluadorFirma = null
    } else if (firmaFile instanceof File && firmaFile.size > 0) {
        const isImage = typeof firmaFile.type === 'string' && firmaFile.type.startsWith('image/')
        if (!isImage) return { error: 'La firma debe ser una imagen' }
        if (firmaFile.size > 2 * 1024 * 1024) return { error: 'La firma supera el tamaño máximo permitido (2MB)' }

        const bytes = await firmaFile.arrayBuffer()
        const base64 = Buffer.from(bytes).toString('base64')
        evaluadorFirma = `data:${firmaFile.type || 'image/png'};base64,${base64}`
    }

    try {
        await prisma.campana.update({
            where: { id: parsed.data.id },
            data: {
                name: parsed.data.name,
                evaluadorNombre: parsed.data.evaluadorNombre,
                evaluadorId: parsed.data.evaluadorId,
                evaluadorProfesion: parsed.data.evaluadorProfesion,
                evaluadorPostgrado: parsed.data.evaluadorPostgrado,
                evaluadorTarjeta: parsed.data.evaluadorTarjeta,
                evaluadorLicencia: parsed.data.evaluadorLicencia,
                evaluadorLicenciaFecha: parsed.data.evaluadorLicenciaFecha,
                ...(evaluadorFirma !== undefined ? { evaluadorFirma } : {}),
            },
        })
        revalidatePath('/admin/campaigns')
        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: 'Failed to update campaign' }
    }
}

const updateReportMetaSchema = z.object({
    surveyResponseId: z.string().min(1),
    block: z.enum(['intralaboral', 'extralaboral', 'estres']),
    observaciones: z.string().max(5000).nullable(),
    recomendaciones: z.string().max(5000).nullable(),
    fechaElaboracion: z.string().nullable(),
})

export async function updateSurveyReportMeta(formData: FormData) {
    const surveyResponseId = formData.get('surveyResponseId') as string
    const block = formData.get('block') as 'intralaboral' | 'extralaboral' | 'estres'
    const observaciones = toNullIfBlank(formData.get('observaciones'))
    const recomendaciones = toNullIfBlank(formData.get('recomendaciones'))
    const fechaElaboracion = toNullIfBlank(formData.get('fechaElaboracion'))

    const parsed = updateReportMetaSchema.safeParse({
        surveyResponseId,
        block,
        observaciones,
        recomendaciones,
        fechaElaboracion,
    })
    if (!parsed.success) return { error: 'Datos inválidos para el informe' }

    try {
        const rows = await prisma.$queryRaw<Array<{ reportMeta: unknown }>>`
            SELECT "reportMeta" as "reportMeta"
            FROM "SurveyResponse"
            WHERE id = ${parsed.data.surveyResponseId}
            LIMIT 1
        `

        const currentMeta = rows?.[0]?.reportMeta
        const base = (currentMeta && typeof currentMeta === 'object') ? (currentMeta as Prisma.JsonObject) : {}

        const next: Prisma.JsonObject = {
            ...base,
            [parsed.data.block]: {
                observaciones: parsed.data.observaciones,
                recomendaciones: parsed.data.recomendaciones,
                fechaElaboracion: parsed.data.fechaElaboracion,
            },
        }

        await prisma.$executeRaw`
            UPDATE "SurveyResponse"
            SET "reportMeta" = ${JSON.stringify(next)}::jsonb
            WHERE id = ${parsed.data.surveyResponseId}
        `

        revalidatePath(`/admin/results/${parsed.data.surveyResponseId}`)
        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: 'Failed to update report fields' }
    }
}
