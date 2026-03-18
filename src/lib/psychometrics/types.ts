export type RiskLevel = 'Sin Riesgo' | 'Riesgo Bajo' | 'Riesgo Medio' | 'Riesgo Alto' | 'Riesgo Muy Alto';

export interface ScoreResult {
    raw: number;
    transformed: number;
    level: RiskLevel;
}

export interface DimensionConfig {
    id: string;
    name: string;
    items: number[]; // Array of item IDs (e.g., [1, 2, 3])
    factor: number; // Factor de transformación (K)
    ranges: {
        sinRiesgo: number;
        bajo: number;
        medio: number;
        alto: number;
        muyAlto: number; // This is actually redundant if we assume > alto, but good for explicit checking
    };
}

export interface DomainConfig {
    id: string;
    name: string;
    dimensions: DimensionConfig[];
    totalFactor: number; // Factor for the Domain Total calculation
    ranges: {
        sinRiesgo: number;
        bajo: number;
        medio: number;
        alto: number;
        muyAlto: number;
    };
}

export interface FormConfig {
    inverseItems: number[];
    domains: DomainConfig[];
    totalConfig: {
        factor: number; // Factor for the Grand Total calculation (Intralaboral Total)
        ranges: {
            sinRiesgo: number;
            bajo: number;
            medio: number;
            alto: number;
            muyAlto: number;
        };
    };
}
