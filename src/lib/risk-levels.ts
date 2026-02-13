export type RiskLevel = 'Sin Riesgo' | 'Riesgo Bajo' | 'Riesgo Medio' | 'Riesgo Alto' | 'Riesgo Muy Alto'

interface RiskRange {
    min: number
    max: number
    level: RiskLevel
}

// Baremos simplificados basados en la documentación oficial (ejemplo genérico, ajustar con tabla exacta)
// Estos valores son referenciales y deben ser verificados con la tabla oficial de la Batería
const DEFAULT_RANGES: RiskRange[] = [
    { min: 0, max: 19.7, level: 'Sin Riesgo' },
    { min: 19.7, max: 25.8, level: 'Riesgo Bajo' },
    { min: 25.8, max: 31.5, level: 'Riesgo Medio' },
    { min: 31.5, max: 38.0, level: 'Riesgo Alto' },
    { min: 38.0, max: 100, level: 'Riesgo Muy Alto' },
]

export function getRiskLevel(score: number): RiskLevel {
    const range = DEFAULT_RANGES.find(r => score < r.max)
    return range ? range.level : 'Riesgo Muy Alto'
}

export function getRiskColor(level: RiskLevel): string {
    switch (level) {
        case 'Sin Riesgo': return 'bg-green-100 text-green-800'
        case 'Riesgo Bajo': return 'bg-blue-100 text-blue-800'
        case 'Riesgo Medio': return 'bg-yellow-100 text-yellow-800'
        case 'Riesgo Alto': return 'bg-orange-100 text-orange-800'
        case 'Riesgo Muy Alto': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}
