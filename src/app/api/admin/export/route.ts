import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

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

        // Generate Rows based on requested columns
        const data = responses.map(r => {
            const ficha = (r.fichaData as unknown as Record<string, string>) || {}

            const anioNacimiento = parseInt(ficha['ficha_3'] || '0')
            let edad = ''
            if (anioNacimiento > 1900) {
                edad = (new Date().getFullYear() - anioNacimiento).toString()
            }

            return {
                'Name': r.participante.cedula, // Assuming Name is Cédula as there is no other distinct name field mapped
                'Nombre': ficha['ficha_1'] || '',
                'Empresa': r.participante.campana.empresa.name,
                'Sexo': ficha['ficha_2'] || '',
                'Año de Nacimiento': ficha['ficha_3'] || '',
                'Estado Civil': '', // Not collected in current survey form
                'Último nivel de estudios': ficha['ficha_4'] || '',
                'Ocupación o profesión': ficha['ficha_5'] || '',
                'Lugar de residencia.Ciudad': ficha['ciudad_residencia'] || '',
                'Lugar de residencia.Departamento': ficha['departamento_residencia'] || '',
                'Estrato': ficha['ficha_7'] || '',
                'Tipo de vivienda': ficha['ficha_8'] || '',
                'Número de personas que dependen económicamente': ficha['ficha_9'] || '',
                'Lugar donde trabaja actualmente.Ciudad': ficha['ciudad_trabajo'] || '',
                'Lugar donde trabaja actualmente.Departamento': ficha['departamento_trabajo'] || '',
                'Años en la empresa': ficha['ficha_11'] || '',
                'Cargo': ficha['ficha_12'] || '',
                'Tipo de cargo': ficha['ficha_13'] || '',
                'Años en el cargo': ficha['ficha_14'] || '',
                'Área de la empresa': ficha['ficha_15'] || '',
                'Número de horas diarias de trabajo': ficha['ficha_17'] || '',
                'Tipo de contrato': ficha['ficha_16'] || '',
                'Tipo de contrato1': ficha['ficha_18'] || '', // Mapping to Tipo de salario since it's the last question
                'Forma': r.formType,
                'Edad': edad,
            }
        })

        // Create workbook and worksheet
        const worksheet = XLSX.utils.json_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados')

        // Generate buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="resultados-${new Date().toISOString().split('T')[0]}.xlsx"`
            }
        })

    } catch (error) {
        console.error('Export error:', error)
        return NextResponse.json({ error: 'Failed to export results' }, { status: 500 })
    }
}
