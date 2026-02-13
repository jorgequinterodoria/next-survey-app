'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'

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
        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: 'Failed to create company' }
    }
}

export async function createCampaign(formData: FormData) {
    const name = formData.get('name') as string
    const empresaId = formData.get('empresaId') as string

    if (!name || !empresaId) return { error: 'Name and Company are required' }

    try {
        // Generate unique token
        const token = randomBytes(16).toString('hex')

        await prisma.campana.create({
            data: {
                name,
                empresaId,
                token,
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
