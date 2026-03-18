import { RiskLevel } from './psychometrics/types';

export { type RiskLevel };

export function getRiskColor(level: RiskLevel | string): string {
    switch (level) {
        case 'Sin Riesgo': return 'bg-green-100 text-green-800'
        case 'Riesgo Bajo': return 'bg-blue-100 text-blue-800'
        case 'Riesgo Medio': return 'bg-yellow-100 text-yellow-800'
        case 'Riesgo Alto': return 'bg-orange-100 text-orange-800'
        case 'Riesgo Muy Alto': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}
