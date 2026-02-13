import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const responses = await prisma.surveyResponse.findMany({
            include: {
                participante: {
                    include: {
                        campana: {
                            include: { empresa: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Define CSV Headers
        const headers = [
            'Empresa',
            'Campaña',
            'Cédula',
            'Fecha Respuesta',
            'Forma',
            'Consentimiento',
            // Add more specific fields if needed, flattening JSON can be complex in CSV
            'Intralaboral (JSON)',
            'Extralaboral (JSON)',
            'Estrés (JSON)'
        ]

        // Generate Rows
        const rows = responses.map(r => {
            return [
                r.participante.campana.empresa.name,
                r.participante.campana.name,
                r.participante.cedula,
                r.createdAt.toISOString(),
                r.formType,
                r.consentAccepted ? 'Sí' : 'No',
                JSON.stringify(r.intralaboralData).replace(/"/g, '""'), // Basic CSV escaping
                JSON.stringify(r.extralaboralData).replace(/"/g, '""'),
                JSON.stringify(r.estresData).replace(/"/g, '""')
            ].map(field => `"${field}"`).join(',') // Quote all fields
        })

        const csvContent = [headers.join(','), ...rows].join('\n')

        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="resultados-${new Date().toISOString().split('T')[0]}.csv"`
            }
        })

    } catch (error) {
        console.error('Export error:', error)
        return NextResponse.json({ error: 'Failed to export results' }, { status: 500 })
    }
}
