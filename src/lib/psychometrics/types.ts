export type RiskLevel = 'Sin Riesgo' | 'Riesgo Bajo' | 'Riesgo Medio' | 'Riesgo Alto' | 'Riesgo Muy Alto';

export interface ScoreResult {
    raw: number;
    transformed: number;
    level: RiskLevel;
}

export interface DimensionConfig {
    id: string;
    name: string;
    items: number[];
    factor: number;
    ranges: {
        sinRiesgo: number;
        bajo: number;
        medio: number;
        alto: number;
        muyAlto: number;
    };
}

export interface DomainConfig {
    id: string;
    name: string;
    dimensions: DimensionConfig[];
    totalFactor: number;
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
        factor: number;
        ranges: {
            sinRiesgo: number;
            bajo: number;
            medio: number;
            alto: number;
            muyAlto: number;
        };
    };
}
