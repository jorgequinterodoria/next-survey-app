import { RiskLevel, ScoreResult, FormConfig, DomainConfig, DimensionConfig } from './types';
import { CONFIG_A, CONFIG_B, CONFIG_EXTRA, CONFIG_ESTRES, GLOBAL_RANGES } from './constants';

const LIKERT_MAP: Record<string, number> = {
    'siempre': 0,
    'casi_siempre': 1,
    'algunas_veces': 2,
    'casi_nunca': 3,
    'nunca': 4,
};

const STRESS_MAP: Record<string, number> = {
    'siempre': 4,
    'casi_siempre': 3,
    'a_veces': 2, 
    'algunas_veces': 2,
    'casi_nunca': 1,
    'nunca': 0
};

function getRiskLevel(score: number, ranges: { sinRiesgo: number, bajo: number, medio: number, alto: number, muyAlto: number }): RiskLevel {
    if (score <= ranges.sinRiesgo) return 'Sin Riesgo';
    if (score <= ranges.bajo) return 'Riesgo Bajo';
    if (score <= ranges.medio) return 'Riesgo Medio';
    if (score <= ranges.alto) return 'Riesgo Alto';
    return 'Riesgo Muy Alto';
}

function calculateScore(
    answers: Record<string, unknown>,
    items: number[],
    inverseItems: number[],
    factor: number,
    ranges: { sinRiesgo: number, bajo: number, medio: number, alto: number, muyAlto: number },
    isStress: boolean = false
): ScoreResult {
    let rawSum = 0;
    let count = 0;

    items.forEach(id => {
        let val: string | undefined;
        
        if (answers[id]) val = String(answers[id]);
        if (!val) {
            const key = Object.keys(answers).find(k => k.endsWith(`_${id}`) || k === `${id}`);
            if (key && answers[key]) val = String(answers[key]);
        }

        if (val) {
            let points = 0;
            const v = val.toString().toLowerCase();
            
            if (isStress) {
                points = STRESS_MAP[v] ?? 0;
            } else {
                points = LIKERT_MAP[v] ?? 0;
                if (inverseItems.includes(id)) {
                    points = 4 - points;
                }
            }
            
            rawSum += points;
            count++;
        }
    });

    if (count === 0) {
        return { raw: 0, transformed: 0, level: 'Sin Riesgo' };
    }

    let adjustedFactor = factor;
    if (count < items.length && items.length > 0) {
        adjustedFactor = (count / items.length) * factor;
    }
    
    if (adjustedFactor === 0) adjustedFactor = 1;

    const transformed = (rawSum / adjustedFactor) * 100;
    
    return {
        raw: rawSum,
        transformed: parseFloat(transformed.toFixed(1)),
        level: getRiskLevel(transformed, ranges)
    };
}

export function processSurvey(
    formType: 'A' | 'B',
    intraAnswers: Record<string, number>,
    extraAnswers: Record<string, number>,
    estresAnswers: Record<string, number>
) {
    const configIntra = formType === 'A' ? CONFIG_A : CONFIG_B;
    
    const intraResults: any = {
        domains: [],
        total: {}
    };
    
    let totalIntraRaw = 0;
    
    configIntra.domains.forEach(domain => {
        const domainDims: Record<string, unknown>[] = [];
        let domainRaw = 0;
        
        domain.dimensions.forEach(dim => {
            const res = calculateScore(intraAnswers, dim.items, configIntra.inverseItems, dim.factor, dim.ranges);
            domainDims.push({
                name: dim.name,
                ...res
            });
            domainRaw += res.raw;
        });

        const allDomainItems = domain.dimensions.flatMap(d => d.items);
        const domainRes = calculateScore(intraAnswers, allDomainItems, configIntra.inverseItems, domain.totalFactor, domain.ranges);
        
        intraResults.domains.push({
            name: domain.name,
            raw: domainRes.raw,
            transformed: domainRes.transformed,
            level: domainRes.level,
            dimensions: domainDims
        });
        
        totalIntraRaw += domainRes.raw;
    });
    
    const allIntraItems = configIntra.domains.flatMap(d => d.dimensions.flatMap(dim => dim.items));
    const totalIntraRes = calculateScore(intraAnswers, allIntraItems, configIntra.inverseItems, configIntra.totalConfig.factor, configIntra.totalConfig.ranges);
    
    intraResults.total = {
        raw: totalIntraRes.raw,
        transformed: totalIntraRes.transformed,
        level: totalIntraRes.level
    };
    
    // 2. EXTRALABORAL
    const extraResults: any = { domains: [], total: {} };
    CONFIG_EXTRA.domains.forEach(domain => {
         const domainDims: Record<string, unknown>[] = [];
         domain.dimensions.forEach(dim => {
            const res = calculateScore(extraAnswers, dim.items, CONFIG_EXTRA.inverseItems, dim.factor, dim.ranges);
            domainDims.push({ name: dim.name, ...res });
         });
         
         const allItems = domain.dimensions.flatMap(d => d.items);
         const domainRes = calculateScore(extraAnswers, allItems, CONFIG_EXTRA.inverseItems, domain.totalFactor, domain.ranges);
         
         extraResults.domains.push({
            name: domain.name,
            ...domainRes,
            dimensions: domainDims
         });
    });
    extraResults.total = extraResults.domains[0];
    
    const estresResults: any = { domains: [], total: {} };
    CONFIG_ESTRES.domains.forEach(domain => {
         const domainDims: Record<string, unknown>[] = [];
         domain.dimensions.forEach(dim => {
            const res = calculateScore(estresAnswers, dim.items, CONFIG_ESTRES.inverseItems, dim.factor, dim.ranges, true);
            domainDims.push({ name: dim.name, ...res });
         });
         
         const allItems = domain.dimensions.flatMap(d => d.items);
         const domainRes = calculateScore(estresAnswers, allItems, CONFIG_ESTRES.inverseItems, domain.totalFactor, domain.ranges, true);
         
         estresResults.domains.push({
            name: domain.name,
            ...domainRes,
            dimensions: domainDims
         });
    });
    estresResults.total = estresResults.domains[0];
    
    const intraExtraGlobal = calculateScore(
        { ...intraAnswers, ...extraAnswers }, 
        [...allIntraItems, ...CONFIG_EXTRA.domains[0].dimensions.flatMap(d => d.items)], 
        [...configIntra.inverseItems, ...CONFIG_EXTRA.inverseItems], 
        formType === 'A' ? 616 : 512, // Factor Global Tabla 28
        formType === 'A' ? GLOBAL_RANGES.A : GLOBAL_RANGES.B // Tabla 34
    );

    return {
        intralaboral: intraResults,
        extralaboral: extraResults,
        estres: estresResults,
        global: {
            raw: intraExtraGlobal.raw,
            transformed: intraExtraGlobal.transformed,
            level: intraExtraGlobal.level
        }
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function flattenResults(detailed: any): Record<string, unknown> {
    const flat: Record<string, unknown> = {};

    if (!detailed) return flat;

    const processTree = (prefix: string, tree: any) => {
        if (!tree) return;

        if (tree.domains && Array.isArray(tree.domains)) {
            tree.domains.forEach((d: any) => {
                // Domain Score
                // Added for completeness
                flat[`${prefix} Dominio - ${d.name}`] = { 
                    dimension: `Dominio: ${d.name}`, 
                    score: d.transformed, 
                    level: d.level,
                    raw: d.raw 
                };

                if (d.dimensions && Array.isArray(d.dimensions)) {
                    d.dimensions.forEach((dim: any) => {
                        flat[`${prefix} - ${dim.name}`] = {
                            dimension: dim.name,
                            score: dim.transformed,
                            level: dim.level
                        };
                    });
                }
            });
        }

        // Total
        if (tree.total && tree.total.dimension !== undefined || tree.total?.transformed !== undefined) {
             if (tree.total.transformed !== undefined) {
                flat[`${prefix} Total`] = {
                    dimension: 'Total',
                    score: tree.total.transformed,
                    level: tree.total.level
                };
             }
        }
    };

    processTree('Intra', detailed.intralaboral);
    processTree('Extra', detailed.extralaboral);
    processTree('Estrés', detailed.estres);
    
    if (detailed.global) {
         flat['Global Total'] = {
            dimension: 'Factores Intralaborales + Extralaborales',
            score: detailed.global.transformed,
            level: detailed.global.level
        };
    }

    return flat;
}
