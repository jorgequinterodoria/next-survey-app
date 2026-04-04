import { prisma } from '@/lib/prisma'
import { NextResponse, NextRequest } from 'next/server'
import * as XLSX from 'xlsx'
import { CONFIG_A, CONFIG_B, CONFIG_EXTRA, CONFIG_ESTRES } from '@/lib/psychometrics/constants'

// Tipos auxiliares
type ResultRow = {
    id_encuesta: string
    Tipo: string
    Variable: string
    Valor: string | number
    Interpretación: string
    'DatosGen.Forma': string
    Cargo: string
}

const LIKERT_TEXT_MAP: Record<string, string> = {
    'siempre': 'SIEMPRE',
    'casi_siempre': 'CASI SIEMPRE',
    'algunas_veces': 'ALGUNAS VECES',
    'a_veces': 'A VECES',
    'casi_nunca': 'CASI NUNCA',
    'nunca': 'NUNCA'
};

const STRESS_QUESTIONS = {
    1: 'Dolores en el cuello y espalda o tensión muscular.',
    2: 'Problemas gastrointestinales, úlcera péptica, acidez, problemas digestivos o del colon.',
    3: 'Problemas respiratorios.',
    4: 'Dolor de cabeza.',
    5: 'Trastornos del sueño como somnolencia durante el día o desvelo en la noche.',
    6: 'Palpitaciones en el pecho o problemas cardíacos.',
    7: 'Cambios fuertes del apetito.',
    8: 'Problemas relacionados con la función de los órganos genitales (impotencia, frigidez).',
    9: 'Dificultad en las relaciones familiares.',
    10: 'Dificultad para permanecer quieto o dificultad para iniciar actividades.',
    11: 'Dificultad en las relaciones con otras personas.',
    12: 'Sensación de aislamiento y desinterés.',
    13: 'Sentimiento de sobrecarga de trabajo.',
    14: 'Dificultad para concentrarse, olvidos frecuentes.',
    15: 'Aumento en el número de accidentes de trabajo.',
    16: 'Sentimiento de frustración, de no haber hecho lo que se quería en la vida.',
    17: 'Cansancio, tedio o desgano.',
    18: 'Disminución del rendimiento en el trabajo o poca creatividad.',
    19: 'Deseo de no asistir al trabajo.',
    20: 'Bajo compromiso o poco interés con lo que se hace.',
    21: 'Dificultad para tomar decisiones.',
    22: 'Deseo de cambiar de empleo.',
    23: 'Sentimiento de soledad y miedo.',
    24: 'Sentimiento de irritabilidad, actitudes y pensamientos negativos.',
    25: 'Sentimiento de angustia, preocupación o tristeza.',
    26: 'Consumo de drogas para aliviar la tensión o los nervios.',
    27: 'Sentimientos de que "no vale nada", o "no sirve para nada".',
    28: 'Consumo de bebidas alcohólicas o café o cigarrillo.',
    29: 'Sentimiento de que está perdiendo la razón.',
    30: 'Comportamientos rígidos, obstinación o terquedad.',
    31: 'Sensación de no poder manejar los problemas de la vida.'
};

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const campanaId = searchParams.get('campanaId')

        const whereClause = campanaId ? { participante: { campanaId: campanaId } } : {}

        const responses = await prisma.surveyResponse.findMany({
            where: whereClause,
            include: {
                participante: {
                    include: {
                        campana: { include: { empresa: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // 1. Hoja de Datos Demográficos (Existente)
        const demoData = responses.map(r => {
            const ficha = (r.fichaData as unknown as Record<string, string>) || {}
            const anioNacimiento = parseInt(ficha['ficha_3'] || '0')
            let edad = ''
            if (anioNacimiento > 1900) {
                edad = (new Date().getFullYear() - anioNacimiento).toString()
            }

            return {
                'Nombre': ficha['ficha_1'] || r.consentName || '',
                'Empresa': r.participante?.campana?.empresa?.name || '',
                'Sexo': ficha['ficha_2'] || '',
                'Año de nacimiento': ficha['ficha_3'] || '',
                'Estado civil': '', 
                'Ultimo nivel de estudios': ficha['ficha_4'] || '',
                'Ocupación o profesión': ficha['ficha_5'] || '',
                'Lugar de residencia.ciudad': ficha['ciudad_residencia'] || '',
                'Lugar de residencia.departamento': ficha['departamento_residencia'] || '',
                'Estrato': ficha['ficha_7'] || '',
                'Tipo de vivienda': ficha['ficha_8'] || '',
                'Número de personas que dependen económicamente': ficha['ficha_9'] || '',
                'Lugar donde trabaja actualmente.Ciudad': ficha['ciudad_trabajo'] || '',
                'Lugar donde trabaja actualmente.Departamento': ficha['departamento_trabajo'] || '',
                'Años en la empresa': ficha['ficha_11'] || '',
                'Cargo': ficha['ficha_12'] || '',
                'Tipo de cargo': ficha['ficha_13'] || '',
                'Años en el cargo': ficha['ficha_14'] || '',
                'Area de la empresa': ficha['ficha_15'] || '',
                'Numero de horas diarias de trabajo': ficha['ficha_17'] || '',
                'Tipo de contrato': ficha['ficha_16'] || '',
                'Tipo de salario (fijo, variable)': ficha['ficha_18'] || '', 
                'Forma': r.formType,
                'Edad (años)': edad,
            }
        })

        // 2. Hoja de Análisis Detallado (Nueva)
        const analysisData: ResultRow[] = [];

        responses.forEach(r => {
            const idEncuesta = `ENC_${r.id.substring(0, 4)}_${r.formType === 'A' ? 'ia' : 'ib'}`;
            const results = r.results as any; // Assuming it follows the structure from our engine
            const ficha = (r.fichaData as unknown as Record<string, string>) || {};
            const cargo = ficha['ficha_12'] || ficha['cargo'] || 'No especificado';

            if (!results) return;

            const addRow = (tipo: string, variable: string, valor: string | number, interpretacion: string) => {
                analysisData.push({
                    id_encuesta: idEncuesta,
                    Tipo: tipo,
                    Variable: variable,
                    Valor: valor,
                    Interpretación: interpretacion,
                    'DatosGen.Forma': r.formType,
                    Cargo: cargo
                });
            };

            // --- INTRALABORAL ---
            // Dimensiones Intralaborales
            if (results.intralaboral?.domains) {
                results.intralaboral.domains.forEach((d: any) => {
                    addRow('Dominio', d.name, d.transformed, d.level);
                    d.dimensions.forEach((dim: any) => {
                        addRow('Dimensión', dim.name, dim.transformed, dim.level);
                    });
                });
            }

            // --- EXTRALABORAL ---
            if (results.extralaboral?.domains) {
                results.extralaboral.domains.forEach((d: any) => {
                    d.dimensions.forEach((dim: any) => {
                        addRow('Extralaboral', dim.name, dim.transformed, dim.level);
                    });
                });
            }

            // --- TOTALES ---
            if (results.extralaboral?.total) {
                addRow('Total cuestionario', 'Factores Extralaborales', results.extralaboral.total.transformed, results.extralaboral.total.level);
            }
            if (results.intralaboral?.total) {
                addRow('Total cuestionario', 'Factores Intralaborales', results.intralaboral.total.transformed, results.intralaboral.total.level);
            }
            if (results.global) {
                addRow('Total cuestionario', 'Factores Intralaborales + Extralaborales', results.global.transformed, results.global.level);
            }
            if (results.estres?.total) {
                addRow('Total cuestionario', 'Nivel de Estrés', results.estres.total.transformed, results.estres.total.level);
            }

            // --- ESTRES DETALLADO (Items) ---
            const estresAnswers = r.estresData as Record<string, string>;
            if (estresAnswers) {
                CONFIG_ESTRES.domains[0].dimensions.forEach(dim => {
                    dim.items.forEach(itemId => {
                        let answerVal = estresAnswers[`estres_${itemId}`] || estresAnswers[itemId.toString()];
                        if (answerVal) {
                             const text = LIKERT_TEXT_MAP[answerVal] || answerVal.toUpperCase();
                             let points = 0;
                             if (answerVal === 'siempre') points = 4;
                             else if (answerVal === 'casi_siempre') points = 3;
                             else if (answerVal === 'a_veces' || answerVal === 'algunas_veces') points = 2;
                             else if (answerVal === 'casi_nunca') points = 1;
                             else if (answerVal === 'nunca') points = 0;

                             addRow(`Estrés: ${dim.name}`, (STRESS_QUESTIONS as any)[itemId] || `Pregunta ${itemId}`, points, text);
                        }
                    });
                });
            }
        });


        // Create workbook
        const workbook = XLSX.utils.book_new()

        // 1. Sheet Demográficos
        const wsDemo = XLSX.utils.json_to_sheet(demoData)
        XLSX.utils.book_append_sheet(workbook, wsDemo, 'Datos Sociodemográficos')

        // 2. Sheet Análisis
        const wsAnalysis = XLSX.utils.json_to_sheet(analysisData)
        XLSX.utils.book_append_sheet(workbook, wsAnalysis, 'Análisis de Riesgo')

        // Generate buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
        const filename = campanaId ? `resultados-campana-${campanaId}.xlsx` : `resultados-generales-${new Date().toISOString().split('T')[0]}.xlsx`

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${filename}"`
            }
        })

    } catch (error) {
        console.error('Export error:', error)
        return NextResponse.json({ error: 'Failed to export results' }, { status: 500 })
    }
}
