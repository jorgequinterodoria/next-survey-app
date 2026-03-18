import { FormConfig } from './types';

// ============================================================================
// BAREMOS GLOBALES (Tabla 34)
// ============================================================================
export const GLOBAL_RANGES = {
    A: { sinRiesgo: 18.8, bajo: 24.4, medio: 29.5, alto: 35.4, muyAlto: 100 },
    B: { sinRiesgo: 19.9, bajo: 24.8, medio: 29.5, alto: 35.4, muyAlto: 100 }
};

// ============================================================================
// 1. ITEMS INVERSOS (Polaridad Inversa: Siempre=4 ... Nunca=0)
// Según Tabla 21 y 22: Los de la fila de abajo.
// ============================================================================
export const INVERSE_ITEMS = {
    A: [1, 2, 3, 7, 8, 10, 11, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 33, 35, 36, 37, 38, 52, 80, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123],
    B: [1, 2, 3, 7, 8, 10, 11, 13, 15, 16, 17, 18, 19, 20, 21, 23, 25, 26, 27, 28, 66, 89, 90, 91, 92, 93, 94, 95, 96],
    EXTRA: [2, 3, 6, 9, 13, 15, 18, 25, 27, 28, 29, 30],
    ESTRES: [] // Todos directos
};

// ============================================================================
// 2. DOMINIOS Y DIMENSIONES (Agrupación y Factores K)
// ============================================================================

// --- FORMA A ---
export const CONFIG_A: FormConfig = {
    inverseItems: INVERSE_ITEMS.A,
    totalConfig: {
        factor: 492, // Tabla 27
        ranges: { sinRiesgo: 19.7, bajo: 25.8, medio: 31.5, alto: 38.0, muyAlto: 100 } // Tabla 33
    },
    domains: [
        {
            id: 'liderazgo_relaciones',
            name: 'Liderazgo y relaciones sociales en el trabajo',
            totalFactor: 164, // Tabla 26
            ranges: { sinRiesgo: 9.1, bajo: 17.7, medio: 25.6, alto: 34.8, muyAlto: 100 }, // Tabla 31
            dimensions: [
                {
                    id: 'caracteristicas_liderazgo',
                    name: 'Características del liderazgo',
                    items: [63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75],
                    factor: 52, // Tabla 25
                    ranges: { sinRiesgo: 3.8, bajo: 15.4, medio: 30.8, alto: 46.2, muyAlto: 100 }
                },
                {
                    id: 'relaciones_sociales',
                    name: 'Relaciones sociales en el trabajo',
                    items: [76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89],
                    factor: 56, // Tabla 25
                    ranges: { sinRiesgo: 5.4, bajo: 16.1, medio: 25.0, alto: 37.5, muyAlto: 100 }
                },
                {
                    id: 'retroalimentacion_desempeno',
                    name: 'Retroalimentación del desempeño',
                    items: [90, 91, 92, 93, 94],
                    factor: 20, // Tabla 25
                    ranges: { sinRiesgo: 10.0, bajo: 25.0, medio: 40.0, alto: 55.0, muyAlto: 100 }
                },
                {
                    id: 'relacion_colaboradores',
                    name: 'Relación con los colaboradores (subordinados)',
                    items: [115, 116, 117, 118, 119, 120, 121, 122, 123],
                    factor: 36, // Tabla 25
                    ranges: { sinRiesgo: 13.9, bajo: 25.0, medio: 33.3, alto: 47.2, muyAlto: 100 }
                }
            ]
        },
        {
            id: 'control_trabajo',
            name: 'Control sobre el trabajo',
            totalFactor: 84, // Tabla 26
            ranges: { sinRiesgo: 10.7, bajo: 19.0, medio: 29.8, alto: 40.5, muyAlto: 100 }, // Tabla 31
            dimensions: [
                {
                    id: 'claridad_rol',
                    name: 'Claridad de rol',
                    items: [53, 54, 55, 56, 57, 58, 59],
                    factor: 28, // Tabla 25
                    ranges: { sinRiesgo: 0.9, bajo: 10.7, medio: 21.4, alto: 39.3, muyAlto: 100 }
                },
                {
                    id: 'capacitacion',
                    name: 'Capacitación',
                    items: [60, 61, 62],
                    factor: 12, // Tabla 25
                    ranges: { sinRiesgo: 0.9, bajo: 16.7, medio: 33.3, alto: 50.0, muyAlto: 100 }
                },
                {
                    id: 'participacion_cambio',
                    name: 'Participación y manejo del cambio',
                    items: [48, 49, 50, 51],
                    factor: 16, // Tabla 25
                    ranges: { sinRiesgo: 12.5, bajo: 25.0, medio: 37.5, alto: 50.0, muyAlto: 100 }
                },
                {
                    id: 'oportunidades_desarrollo',
                    name: 'Oportunidades para el uso y desarrollo de habilidades y conocimientos',
                    items: [39, 40, 41, 42],
                    factor: 16, // Tabla 25
                    ranges: { sinRiesgo: 0.9, bajo: 6.3, medio: 18.8, alto: 31.3, muyAlto: 100 }
                },
                {
                    id: 'control_autonomia',
                    name: 'Control y autonomía sobre el trabajo',
                    items: [44, 45, 46],
                    factor: 12, // Tabla 25
                    ranges: { sinRiesgo: 8.3, bajo: 25.0, medio: 41.7, alto: 58.3, muyAlto: 100 }
                }
            ]
        },
        {
            id: 'demandas_trabajo',
            name: 'Demandas del trabajo',
            totalFactor: 200, // Tabla 26
            ranges: { sinRiesgo: 28.5, bajo: 35.0, medio: 41.5, alto: 47.5, muyAlto: 100 }, // Tabla 31
            dimensions: [
                {
                    id: 'demandas_ambientales',
                    name: 'Demandas ambientales y de esfuerzo físico',
                    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    factor: 48, // Tabla 25
                    ranges: { sinRiesgo: 14.6, bajo: 22.9, medio: 31.3, alto: 39.6, muyAlto: 100 }
                },
                {
                    id: 'demandas_emocionales',
                    name: 'Demandas emocionales',
                    items: [106, 107, 108, 109, 110, 111, 112, 113, 114],
                    factor: 36, // Tabla 25
                    ranges: { sinRiesgo: 16.7, bajo: 25.0, medio: 33.3, alto: 47.2, muyAlto: 100 }
                },
                {
                    id: 'demandas_cuantitativas',
                    name: 'Demandas cuantitativas',
                    items: [13, 14, 15, 32, 43, 47],
                    factor: 24, // Tabla 25
                    ranges: { sinRiesgo: 25.0, bajo: 33.3, medio: 45.8, alto: 54.2, muyAlto: 100 }
                },
                {
                    id: 'influencia_trabajo_entorno',
                    name: 'Influencia del trabajo sobre el entorno extralaboral',
                    items: [35, 36, 37, 38],
                    factor: 16, // Tabla 25
                    ranges: { sinRiesgo: 18.8, bajo: 31.3, medio: 43.8, alto: 50.0, muyAlto: 100 }
                },
                {
                    id: 'exigencias_responsabilidad',
                    name: 'Exigencias de responsabilidad del cargo',
                    items: [19, 22, 23, 24, 25, 26],
                    factor: 24, // Tabla 25
                    ranges: { sinRiesgo: 37.5, bajo: 54.2, medio: 66.7, alto: 79.2, muyAlto: 100 }
                },
                {
                    id: 'demandas_carga_mental',
                    name: 'Demandas de carga mental',
                    items: [16, 17, 18, 20, 21],
                    factor: 20, // Tabla 25
                    ranges: { sinRiesgo: 60.0, bajo: 70.0, medio: 80.0, alto: 90.0, muyAlto: 100 }
                },
                {
                    id: 'consistencia_rol',
                    name: 'Consistencia del rol',
                    items: [27, 28, 29, 30, 52],
                    factor: 20, // Tabla 25
                    ranges: { sinRiesgo: 15.0, bajo: 25.0, medio: 35.0, alto: 45.0, muyAlto: 100 }
                },
                {
                    id: 'demandas_jornada',
                    name: 'Demandas de la jornada de trabajo',
                    items: [31, 33, 34],
                    factor: 12, // Tabla 25
                    ranges: { sinRiesgo: 8.3, bajo: 25.0, medio: 33.3, alto: 50.0, muyAlto: 100 }
                }
            ]
        },
        {
            id: 'recompensas',
            name: 'Recompensas',
            totalFactor: 44, // Tabla 26
            ranges: { sinRiesgo: 4.5, bajo: 11.4, medio: 20.5, alto: 29.5, muyAlto: 100 }, // Tabla 31
            dimensions: [
                {
                    id: 'recompensas_pertenencia',
                    name: 'Recompensas derivadas de la pertenencia a la organización y del trabajo que se realiza',
                    items: [95, 102, 103, 104, 105],
                    factor: 20, // Tabla 25
                    ranges: { sinRiesgo: 0.9, bajo: 5.0, medio: 10.0, alto: 20.0, muyAlto: 100 }
                },
                {
                    id: 'reconocimiento_compensacion',
                    name: 'Reconocimiento y compensación',
                    items: [96, 97, 98, 99, 100, 101],
                    factor: 24, // Tabla 25
                    ranges: { sinRiesgo: 4.2, bajo: 16.7, medio: 25.0, alto: 37.5, muyAlto: 100 }
                }
            ]
        }
    ]
};

// --- FORMA B ---
export const CONFIG_B: FormConfig = {
    inverseItems: INVERSE_ITEMS.B,
    totalConfig: {
        factor: 388, // Tabla 27
        ranges: { sinRiesgo: 20.6, bajo: 26.0, medio: 31.2, alto: 38.7, muyAlto: 100 } // Tabla 33
    },
    domains: [
        {
            id: 'liderazgo_relaciones',
            name: 'Liderazgo y relaciones sociales en el trabajo',
            totalFactor: 120, // Tabla 26
            ranges: { sinRiesgo: 8.3, bajo: 17.5, medio: 26.7, alto: 38.3, muyAlto: 100 }, // Tabla 32
            dimensions: [
                {
                    id: 'caracteristicas_liderazgo',
                    name: 'Características del liderazgo',
                    items: [49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61],
                    factor: 52, // Tabla 25
                    ranges: { sinRiesgo: 3.8, bajo: 13.5, medio: 25.0, alto: 38.5, muyAlto: 100 } // Tabla 30
                },
                {
                    id: 'relaciones_sociales',
                    name: 'Relaciones sociales en el trabajo',
                    items: [62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73],
                    factor: 48, // Tabla 25
                    ranges: { sinRiesgo: 6.3, bajo: 14.6, medio: 27.1, alto: 37.5, muyAlto: 100 } // Tabla 30
                },
                {
                    id: 'retroalimentacion_desempeno',
                    name: 'Retroalimentación del desempeño',
                    items: [74, 75, 76, 77, 78],
                    factor: 20, // Tabla 25
                    ranges: { sinRiesgo: 5.0, bajo: 20.0, medio: 30.0, alto: 50.0, muyAlto: 100 } // Tabla 30
                }
                // No "Relación con Colaboradores" in Form B
            ]
        },
        {
            id: 'control_trabajo',
            name: 'Control sobre el trabajo',
            totalFactor: 72, // Tabla 26
            ranges: { sinRiesgo: 19.4, bajo: 26.4, medio: 34.7, alto: 43.1, muyAlto: 100 }, // Tabla 32
            dimensions: [
                {
                    id: 'claridad_rol',
                    name: 'Claridad de rol',
                    items: [41, 42, 43, 44, 45],
                    factor: 20, // Tabla 25
                    ranges: { sinRiesgo: 0.9, bajo: 5.0, medio: 15.0, alto: 30.0, muyAlto: 100 } // Tabla 30
                },
                {
                    id: 'capacitacion',
                    name: 'Capacitación',
                    items: [46, 47, 48],
                    factor: 12, // Tabla 25
                    ranges: { sinRiesgo: 0.9, bajo: 16.7, medio: 25.0, alto: 50.0, muyAlto: 100 } // Tabla 30
                },
                {
                    id: 'participacion_cambio',
                    name: 'Participación y manejo del cambio',
                    items: [38, 39, 40],
                    factor: 12, // Tabla 25
                    ranges: { sinRiesgo: 16.7, bajo: 33.3, medio: 41.7, alto: 58.3, muyAlto: 100 } // Tabla 30
                },
                {
                    id: 'oportunidades_desarrollo',
                    name: 'Oportunidades para el uso y desarrollo de habilidades y conocimientos',
                    items: [29, 30, 31, 32],
                    factor: 16, // Tabla 25
                    ranges: { sinRiesgo: 12.5, bajo: 25.0, medio: 37.5, alto: 56.3, muyAlto: 100 } // Tabla 30
                },
                {
                    id: 'control_autonomia',
                    name: 'Control y autonomía sobre el trabajo',
                    items: [34, 35, 36],
                    factor: 12, // Tabla 25
                    ranges: { sinRiesgo: 33.3, bajo: 50.0, medio: 66.7, alto: 75.0, muyAlto: 100 } // Tabla 30
                }
            ]
        },
        {
            id: 'demandas_trabajo',
            name: 'Demandas del trabajo',
            totalFactor: 156, // Tabla 26
            ranges: { sinRiesgo: 26.9, bajo: 33.3, medio: 37.8, alto: 44.2, muyAlto: 100 }, // Tabla 32
            dimensions: [
                {
                    id: 'demandas_ambientales',
                    name: 'Demandas ambientales y de esfuerzo físico',
                    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    factor: 48, // Tabla 25
                    ranges: { sinRiesgo: 22.9, bajo: 31.3, medio: 39.6, alto: 47.9, muyAlto: 100 } // Tabla 30
                },
                {
                    id: 'demandas_emocionales',
                    name: 'Demandas emocionales',
                    items: [89, 90, 91, 92, 93, 94, 95, 96, 97],
                    factor: 36, // Tabla 25
                    ranges: { sinRiesgo: 19.4, bajo: 27.8, medio: 38.9, alto: 47.2, muyAlto: 100 } // Tabla 30
                },
                {
                    id: 'demandas_cuantitativas',
                    name: 'Demandas cuantitativas',
                    items: [13, 14, 15],
                    factor: 12, // Tabla 25
                    ranges: { sinRiesgo: 16.7, bajo: 33.3, medio: 41.7, alto: 50.0, muyAlto: 100 } // Tabla 30
                },
                {
                    id: 'influencia_trabajo_entorno',
                    name: 'Influencia del trabajo sobre el entorno extralaboral',
                    items: [25, 26, 27, 28],
                    factor: 16, // Tabla 25
                    ranges: { sinRiesgo: 12.5, bajo: 25.0, medio: 31.3, alto: 50.0, muyAlto: 100 } // Tabla 30
                },
                // No "Exigencias de responsabilidad" in Form B
                {
                    id: 'demandas_carga_mental',
                    name: 'Demandas de carga mental',
                    items: [16, 17, 18, 19, 20],
                    factor: 20, // Tabla 25
                    ranges: { sinRiesgo: 50.0, bajo: 65.0, medio: 75.0, alto: 85.0, muyAlto: 100 } // Tabla 30
                },
                // No "Consistencia del rol" in Form B
                {
                    id: 'demandas_jornada',
                    name: 'Demandas de la jornada de trabajo',
                    items: [21, 22, 23, 24, 33, 37],
                    factor: 24, // Tabla 25
                    ranges: { sinRiesgo: 25.0, bajo: 37.5, medio: 45.8, alto: 58.3, muyAlto: 100 } // Tabla 30
                }
            ]
        },
        {
            id: 'recompensas',
            name: 'Recompensas',
            totalFactor: 40, // Tabla 26
            ranges: { sinRiesgo: 2.5, bajo: 10.0, medio: 17.5, alto: 27.5, muyAlto: 100 }, // Tabla 32
            dimensions: [
                {
                    id: 'recompensas_pertenencia',
                    name: 'Recompensas derivadas de la pertenencia a la organización y del trabajo que se realiza',
                    items: [85, 86, 87, 88],
                    factor: 16, // Tabla 25
                    ranges: { sinRiesgo: 0.9, bajo: 6.3, medio: 12.5, alto: 18.8, muyAlto: 100 } // Tabla 30
                },
                {
                    id: 'reconocimiento_compensacion',
                    name: 'Reconocimiento y compensación',
                    items: [79, 80, 81, 82, 83, 84],
                    factor: 24, // Tabla 25
                    ranges: { sinRiesgo: 0.9, bajo: 12.5, medio: 25.0, alto: 37.5, muyAlto: 100 } // Tabla 30
                }
            ]
        }
    ]
};

// --- EXTRALABORAL ---
export const CONFIG_EXTRA: FormConfig = {
    inverseItems: [2, 3, 6, 16, 17, 24, 26, 28, 30, 31],
    totalConfig: {
        factor: 124,
        ranges: { sinRiesgo: 11.3, bajo: 16.9, medio: 25.8, alto: 33.9, muyAlto: 100 } // General approximate ranges
    },
    domains: [
        {
            id: 'extralaboral_general',
            name: 'Factores Extralaborales',
            totalFactor: 124,
            ranges: { sinRiesgo: 11.3, bajo: 16.9, medio: 25.8, alto: 33.9, muyAlto: 100 },
            dimensions: [
                { id: 'tiempo_fuera', name: 'Tiempo fuera del trabajo', items: [14, 15, 16, 17], factor: 16, ranges: { sinRiesgo: 10, bajo: 20, medio: 30, alto: 40, muyAlto: 100 } },
                { id: 'relaciones_familiares', name: 'Relaciones Familiares', items: [18, 19, 20], factor: 12, ranges: { sinRiesgo: 10, bajo: 20, medio: 30, alto: 40, muyAlto: 100 } },
                { id: 'comunicacion_interpersonal', name: 'Comunicación y relaciones interpersonales', items: [21, 22, 23, 24], factor: 16, ranges: { sinRiesgo: 10, bajo: 20, medio: 30, alto: 40, muyAlto: 100 } },
                { id: 'situacion_economica', name: 'Situación económica del grupo familiar', items: [29, 30, 31], factor: 12, ranges: { sinRiesgo: 10, bajo: 20, medio: 30, alto: 40, muyAlto: 100 } },
                { id: 'caracteristicas_vivienda', name: 'Características de la vivienda y de su entorno', items: [5, 6, 7, 8, 9, 10, 11, 12, 13], factor: 36, ranges: { sinRiesgo: 10, bajo: 20, medio: 30, alto: 40, muyAlto: 100 } },
                { id: 'influencia_entorno', name: 'Influencia del entorno extralaboral sobre el trabajo', items: [25, 26, 27, 28], factor: 16, ranges: { sinRiesgo: 10, bajo: 20, medio: 30, alto: 40, muyAlto: 100 } },
                { id: 'desplazamiento', name: 'Desplazamiento vivienda-trabajo-vivienda', items: [1, 2, 3, 4], factor: 16, ranges: { sinRiesgo: 10, bajo: 20, medio: 30, alto: 40, muyAlto: 100 } }
            ]
        }
    ]
};

// --- ESTRES ---
export const CONFIG_ESTRES: FormConfig = {
    inverseItems: INVERSE_ITEMS.ESTRES,
    totalConfig: {
        factor: 124,
        ranges: { sinRiesgo: 7.8, bajo: 12.6, medio: 17.7, alto: 25.0, muyAlto: 100 } // Approximate
    },
    domains: [
        {
            id: 'estres_general',
            name: 'Nivel de Estrés',
            totalFactor: 124,
            ranges: { sinRiesgo: 7.8, bajo: 12.6, medio: 17.7, alto: 25.0, muyAlto: 100 },
            dimensions: [
                { id: 'sintomas_fisiologicos', name: 'Síntomas Fisiológicos', items: [1, 2, 3, 4, 5, 6, 7, 8], factor: 32, ranges: { sinRiesgo: 10, bajo: 20, medio: 30, alto: 40, muyAlto: 100 } },
                { id: 'sintomas_social', name: 'Síntomas de Comportamiento Social', items: [9, 10, 11, 12], factor: 16, ranges: { sinRiesgo: 10, bajo: 20, medio: 30, alto: 40, muyAlto: 100 } },
                { id: 'sintomas_intelectual', name: 'Síntomas Intelectuales y Laborales', items: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22], factor: 40, ranges: { sinRiesgo: 10, bajo: 20, medio: 30, alto: 40, muyAlto: 100 } },
                { id: 'sintomas_psico', name: 'Síntomas Psicoemocionales', items: [23, 24, 25, 26, 27, 28, 29, 30, 31], factor: 36, ranges: { sinRiesgo: 10, bajo: 20, medio: 30, alto: 40, muyAlto: 100 } }
            ]
        }
    ]
};
