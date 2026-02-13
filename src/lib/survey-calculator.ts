import { getRiskLevel, RiskLevel } from './risk-levels'

// Listas de items inversos (Puntaje alto = bajo riesgo, o escala positiva)
// Estos items se invierten: 0->4, 4->0
// Basado en análisis de la batería oficial: items "positivos" son inversos.
const INVERSE_ITEMS_A = [
    4, 5, 6, 9, 12, 14, 32, 34, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
    53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75,
    76, 77, 78, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105
]

const INVERSE_ITEMS_B = [
    4, 5, 6, 9, 12, 14, 22, 24, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
    62, 63, 64, 65, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88
]

const INVERSE_ITEMS_EXTRA = [
    1, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 27, 29
]

// Mapeo de Dimensiones - FORMA A
const DIMENSIONS_A = {
    // Dominio: Condiciones del Medio Ambiente de Trabajo
    'Condiciones Ambientales': [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12],
    
    // Dominio: Demandas del Trabajo
    'Demandas Cuantitativas': [13, 14, 15],
    'Demandas de Carga Mental': [16, 17, 18, 19, 20, 21],
    'Demandas Emocionales': [106, 107, 108, 109, 110, 111, 112, 113, 114], // Condicional: Clientes
    'Exigencias de Responsabilidad': [22, 23, 24, 25, 26],
    'Demandas de la Jornada': [31, 32, 33, 34, 35, 36, 37, 38],
    'Consistencia del Rol': [27, 28, 29, 30],
    
    // Dominio: Control sobre el Trabajo
    'Control y Autonomía': [39, 40, 41, 42, 43, 44, 45, 46, 47],
    'Oportunidades de Desarrollo': [39, 40, 41, 42], // Overlaps usually, simplified here based on sections
    'Claridad de Rol': [53, 54, 55, 56, 57, 58, 59],
    'Capacitación': [60, 61, 62],
    'Participación y Manejo del Cambio': [48, 49, 50, 51, 52],

    // Dominio: Liderazgo y Relaciones Sociales
    'Características del Liderazgo': [63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75],
    'Relaciones Sociales': [76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89],
    'Relación con Colaboradores': [115, 116, 117, 118, 119, 120, 121, 122, 123], // Condicional: Jefes

    // Dominio: Recompensas
    'Reconocimiento y Compensación': [90, 91, 92, 93, 94, 96, 97, 98],
    'Recompensas (Pertenencia)': [95, 99, 100, 101, 102, 103, 104, 105]
}

// Mapeo de Dimensiones - FORMA B
const DIMENSIONS_B = {
    'Condiciones Ambientales': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    'Demandas Cuantitativas': [13, 14, 15],
    'Demandas de Carga Mental': [16, 17, 18, 19, 20],
    'Demandas Emocionales': [89, 90, 91, 92, 93, 94, 95, 96, 97], // Condicional
    'Demandas de la Jornada': [21, 22, 23, 24, 25, 26, 27, 28],
    'Control y Autonomía': [29, 30, 31, 32, 33, 34, 35, 36, 37],
    'Participación y Manejo del Cambio': [38, 39, 40],
    'Claridad de Rol': [41, 42, 43, 44, 45],
    'Capacitación': [46, 47, 48],
    'Características del Liderazgo': [49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61],
    'Relaciones Sociales': [62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73],
    'Reconocimiento y Compensación': [74, 75, 76, 77, 78, 79, 80, 81],
    'Recompensas (Pertenencia)': [82, 83, 84, 85, 86, 87, 88]
}

// Mapeo Extralaboral
const DIMENSIONS_EXTRA = {
    'Tiempo fuera del trabajo': [14, 15, 16, 17],
    'Relaciones Familiares': [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
    'Situación Económica': [29, 30, 31],
    'Vivienda y Entorno': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
}

// Mapeo Estrés
const DIMENSIONS_ESTRES = {
    'Síntomas Fisiológicos': [1, 2, 3, 4, 5, 6, 7, 8],
    'Síntomas Comportamiento Social': [9, 10, 11, 12],
    'Síntomas Intelectuales y Laborales': [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    'Síntomas Psicoemocionales': [23, 24, 25, 26, 27, 28, 29, 30, 31]
}


interface SurveyResult {
    rawScore: number
    transformedScore: number
    riskLevel: RiskLevel
}

export interface DimensionResult {
    dimension: string
    score: number
    level: RiskLevel
}

// Helper para normalizar respuestas (quitar prefijos de keys)
function normalizeAnswers(answers: Record<string, string>): Record<string, string> {
    const normalized: Record<string, string> = {}
    Object.entries(answers).forEach(([key, value]) => {
        // key es tipo 'seccion_123' o 'estres_5'
        const parts = key.split('_')
        const id = parts[parts.length - 1]
        if (!isNaN(parseInt(id))) {
            normalized[id] = value
        }
    })
    return normalized
}

const LIKERT_MAP: Record<string, number> = {
    'siempre': 4,
    'casi_siempre': 3,
    'algunas_veces': 2,
    'casi_nunca': 1,
    'nunca': 0,
    // Estres uses 'a_veces' instead of 'algunas_veces'
    'a_veces': 2
}

export function calculateDimensionScore(
    answers: Record<string, string>,
    itemIds: number[],
    inverseItems: number[]
): SurveyResult {
    let rawScore = 0
    let answeredCount = 0

    itemIds.forEach(id => {
        const value = answers[id.toString()] // Ahora answers ya viene normalizado
        if (value !== undefined && value !== null && value !== '') {
            // Convertir texto a número usando el mapa Likert
            // Si el valor ya es un número (ej. "4"), parseInt funcionará. Si es texto "siempre", usa el mapa.
            let numericValue = LIKERT_MAP[value]
            
            // Fallback: intentar parsear como número si no está en el mapa
            if (numericValue === undefined) {
                 numericValue = parseInt(value, 10)
            }
            
            if (!isNaN(numericValue)) {
                // Lógica de inversión
                if (inverseItems.includes(id)) {
                    // Escala inversa: 0->4, 1->3, 2->2, 3->1, 4->0
                    numericValue = 4 - numericValue
                }
                
                rawScore += numericValue
                answeredCount++
            }
        }
    })

    if (answeredCount === 0) {
        return { rawScore: 0, transformedScore: 0, riskLevel: 'Sin Riesgo' }
    }

    // Transformación Lineal
    const adjustedMaxScore = answeredCount * 4 
    const transformedScore = (rawScore / adjustedMaxScore) * 100

    return {
        rawScore,
        transformedScore: parseFloat(transformedScore.toFixed(1)),
        riskLevel: getRiskLevel(transformedScore)
    }
}

export function processSurveyAnswers(
    formType: string,
    fichaData: any,
    intralaboralAnswers: Record<string, string>,
    extralaboralAnswers: Record<string, string>,
    estresAnswers: Record<string, string>
) {
    // Si formType no se provee, intenta obtenerlo de fichaData o fallback a 'A'
    const finalFormType = formType || fichaData.formType || 'A'
    const results: Record<string, DimensionResult> = {}

    // Normalizar respuestas para búsqueda rápida por ID
    const normIntra = normalizeAnswers(intralaboralAnswers)
    const normExtra = normalizeAnswers(extralaboralAnswers)
    const normEstres = normalizeAnswers(estresAnswers)

    // 1. Procesar Intralaboral
    const dimensionsIntra = finalFormType === 'A' ? DIMENSIONS_A : DIMENSIONS_B
    const inverseIntra = finalFormType === 'A' ? INVERSE_ITEMS_A : INVERSE_ITEMS_B

    Object.entries(dimensionsIntra).forEach(([dimName, items]) => {
        const result = calculateDimensionScore(normIntra, items, inverseIntra)
        results[`Intra - ${dimName}`] = {
            dimension: dimName,
            score: result.transformedScore,
            level: result.riskLevel
        }
    })

    // 2. Procesar Extralaboral
    Object.entries(DIMENSIONS_EXTRA).forEach(([dimName, items]) => {
        const result = calculateDimensionScore(normExtra, items, INVERSE_ITEMS_EXTRA)
        results[`Extra - ${dimName}`] = {
            dimension: dimName,
            score: result.transformedScore,
            level: result.riskLevel
        }
    })

    // 3. Procesar Estrés
    Object.entries(DIMENSIONS_ESTRES).forEach(([dimName, items]) => {
        const result = calculateDimensionScore(normEstres, items, []) // Estrés no tiene inversos
        results[`Estrés - ${dimName}`] = {
            dimension: dimName,
            score: result.transformedScore,
            level: result.riskLevel
        }
    })

    // 4. Calcular Puntajes Totales (Promedios ponderados simplificados)
    // Nota: El cálculo total oficial es más complejo, sumando brutos totales. Aquí hacemos una aproximación útil.
    // TODO: Implementar cálculo total oficial sumando todos los items brutos y dividiendo por máximo total.
    
    return results
}
