// ============================================================
// DATA PROCESSOR - Matches actual SurveyResponse JSON structure
// ============================================================
import {
  ReportData, DemographicsData, FrequencyItem,
  RiskTableRow, RiskLevel, EstresAggregated,
  GeneralRiskRow, PVERow, MatrizIntervencion,
} from './types';

interface SurveyResponseRaw {
  formType: string;
  fichaData: unknown;
  filters: unknown;
  results: unknown;
}
interface ParticipanteWithResponse {
  id: string;
  cedula: string;
  surveyResponse: SurveyResponseRaw | null;
}
interface CampanaWithData {
  id: string;
  name: string;
  empresa: { id: string; name: string; nit: string | null };
  participantes: ParticipanteWithResponse[];
}

interface ResultEntry {
  level: string;
  score: number;
  dimension: string;
}
type ResultsJSON = Record<string, ResultEntry>;

interface FichaRaw {
  ficha_2?: string;  // Sexo
  ficha_3?: string;  // Año nacimiento
  ficha_4?: string;  // Nivel estudios
  ficha_5?: string;  // Ocupación
  ficha_6?: string;  // Estado civil
  ficha_7?: string;  // Estrato
  ficha_8?: string;  // Tipo vivienda
  ficha_9?: string;  // Personas a cargo
  ficha_11?: string; // Años en empresa
  ficha_12?: string; // Cargo
  ficha_13?: string; // Tipo cargo
  ficha_14?: string; // Años en cargo
  ficha_15?: string; // Área
  ficha_16?: string; // Tipo contrato
  ficha_17?: string; // Horas diarias
  ficha_18?: string; // Tipo salario
  ciudad_trabajo?: string;
  ciudad_residencia?: string;
  departamento_trabajo?: string;
  departamento_residencia?: string;
  [key: string]: string | undefined;
}

// ─── Dimension keys (as stored in results JSON) ───────────────────────────────

export const INTRA_KEYS: Record<string, string> = {
  'Intra - Características del Liderazgo': 'Características del Liderazgo',
  'Intra - Relaciones Sociales': 'Relaciones Sociales',
  'Intra - Claridad de Rol': 'Claridad de Rol',
  'Intra - Capacitación': 'Capacitación',
  'Intra - Participación y Manejo del Cambio': 'Participación y Manejo del Cambio',
  'Intra - Control y Autonomía': 'Control y Autonomía',
  'Intra - Condiciones Ambientales': 'Condiciones Ambientales',
  'Intra - Demandas Emocionales': 'Demandas Emocionales',
  'Intra - Demandas Cuantitativas': 'Demandas Cuantitativas',
  'Intra - Demandas de Carga Mental': 'Demandas de Carga Mental',
  'Intra - Demandas de la Jornada': 'Demandas de la Jornada',
  'Intra - Recompensas (Pertenencia)': 'Recompensas (Pertenencia)',
  'Intra - Reconocimiento y Compensación': 'Reconocimiento y Compensación',
};

export const EXTRA_KEYS: Record<string, string> = {
  'Extra - Tiempo fuera del trabajo': 'Tiempo fuera del trabajo',
  'Extra - Relaciones Familiares': 'Relaciones Familiares',
  'Extra - Situación Económica': 'Situación Económica',
  'Extra - Vivienda y Entorno': 'Vivienda y Entorno',
};

export const ESTRES_KEYS: Record<string, string> = {
  'Estrés - Síntomas Fisiológicos': 'Síntomas Fisiológicos',
  'Estrés - Síntomas Psicoemocionales': 'Síntomas Psicoemocionales',
  'Estrés - Síntomas Comportamiento Social': 'Síntomas Comportamiento Social',
  'Estrés - Síntomas Intelectuales y Laborales': 'Síntomas Intelectuales y Laborales',
};

export const DOMINIOS: Record<string, string[]> = {
  'Liderazgo y Relaciones Sociales': ['Características del Liderazgo', 'Relaciones Sociales', 'Claridad de Rol'],
  'Control sobre el Trabajo': ['Capacitación', 'Participación y Manejo del Cambio', 'Control y Autonomía'],
  'Demandas del Trabajo': ['Condiciones Ambientales', 'Demandas Emocionales', 'Demandas Cuantitativas', 'Demandas de Carga Mental', 'Demandas de la Jornada'],
  'Recompensas': ['Recompensas (Pertenencia)', 'Reconocimiento y Compensación'],
};

// ─── Level normalization ──────────────────────────────────────────────────────

function normalizeLevel(raw: string): RiskLevel {
  const map: Record<string, RiskLevel> = {
    'sin riesgo': 'Sin riesgo o riesgo despreciable',
    'sin riesgo o riesgo despreciable': 'Sin riesgo o riesgo despreciable',
    'riesgo bajo': 'Riesgo bajo',
    'riesgo medio': 'Riesgo medio',
    'riesgo alto': 'Riesgo alto',
    'riesgo muy alto': 'Riesgo muy alto',
    'no aplica': 'No aplica',
  };
  return map[raw?.toLowerCase()?.trim()] ?? 'Sin riesgo o riesgo despreciable';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countFrequency(values: (string | undefined | null)[]): FrequencyItem[] {
  const map: Record<string, number> = {};
  for (const v of values) {
    const key = v?.trim() || 'Sin datos';
    map[key] = (map[key] || 0) + 1;
  }
  const total = values.length || 1;
  return Object.entries(map)
    .map(([label, count]) => ({ label, count, percentage: count / total }))
    .sort((a, b) => b.count - a.count);
}

function getAgeRange(f: FichaRaw): string {
  const year = parseInt(f.ficha_3 || '');
  if (isNaN(year)) return 'Sin datos';
  const age = new Date().getFullYear() - year;
  if (age < 18) return 'Menores de 18 años';
  if (age <= 25) return 'Entre 18 y 25 años';
  if (age <= 35) return 'Entre 26 y 35 años';
  if (age <= 45) return 'Entre 36 y 45 años';
  return 'Mayores a 46 años';
}

function getAniosRange(raw?: string): string {
  if (raw === 'Menos de 1 año') return 'Menos de 1 año';
  const n = parseFloat(raw || '');
  if (isNaN(n)) return 'Sin datos';
  if (n < 1) return 'Menos de 1 año';
  if (n <= 5) return '1 a 5 años';
  if (n <= 10) return '6 a 10 años';
  if (n <= 15) return '11 a 15 años';
  return 'Más de 15 años';
}

function getPersonasRange(raw?: string): string {
  const n = parseInt(raw || '');
  if (isNaN(n)) return 'Sin datos';
  if (n === 0) return 'Ninguna';
  if (n <= 2) return '1 a 2';
  if (n <= 4) return '3 a 4';
  return '5 o más';
}

// ─── Risk table builder ───────────────────────────────────────────────────────

interface ProcessedResponse {
  formType: 'A' | 'B';
  ficha: FichaRaw;
  results: ResultsJSON;
}

function buildRiskTable(
  keys: Record<string, string>,
  responses: ProcessedResponse[],
  formFilter?: 'A' | 'B'
): RiskTableRow[] {
  const filtered = formFilter ? responses.filter(r => r.formType === formFilter) : responses;
  return Object.entries(keys).map(([resultKey, displayName]) => {
    const counts = { sinRiesgo: 0, bajo: 0, medio: 0, alto: 0, muyAlto: 0, total: 0 };
    for (const r of filtered) {
      const entry = r.results[resultKey];
      if (!entry) continue;
      const level = normalizeLevel(entry.level);
      if (level === 'No aplica') continue;
      counts.total++;
      if (level === 'Sin riesgo o riesgo despreciable') counts.sinRiesgo++;
      else if (level === 'Riesgo bajo') counts.bajo++;
      else if (level === 'Riesgo medio') counts.medio++;
      else if (level === 'Riesgo alto') counts.alto++;
      else if (level === 'Riesgo muy alto') counts.muyAlto++;
    }
    const t = counts.total || 1;
    return {
      factor: displayName,
      sinRiesgo: { count: counts.sinRiesgo, pct: counts.sinRiesgo / t },
      bajo: { count: counts.bajo, pct: counts.bajo / t },
      medio: { count: counts.medio, pct: counts.medio / t },
      alto: { count: counts.alto, pct: counts.alto / t },
      muyAlto: { count: counts.muyAlto, pct: counts.muyAlto / t },
      total: counts.total,
    };
  });
}

function buildDominiosTable(responses: ProcessedResponse[], formFilter?: 'A' | 'B'): RiskTableRow[] {
  const filtered = formFilter ? responses.filter(r => r.formType === formFilter) : responses;
  const nameToKey: Record<string, string> = {};
  for (const [k, v] of Object.entries(INTRA_KEYS)) nameToKey[v] = k;

  return Object.entries(DOMINIOS).map(([domainName, dimNames]) => {
    const counts = { sinRiesgo: 0, bajo: 0, medio: 0, alto: 0, muyAlto: 0, total: 0 };
    for (const r of filtered) {
      const scores: number[] = [];
      for (const dimName of dimNames) {
        const key = nameToKey[dimName];
        if (key && r.results[key]) scores.push(r.results[key].score);
      }
      if (scores.length === 0) continue;
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      let level: RiskLevel;
      if (avg < 20) level = 'Sin riesgo o riesgo despreciable';
      else if (avg < 40) level = 'Riesgo bajo';
      else if (avg < 60) level = 'Riesgo medio';
      else if (avg < 80) level = 'Riesgo alto';
      else level = 'Riesgo muy alto';
      counts.total++;
      if (level === 'Sin riesgo o riesgo despreciable') counts.sinRiesgo++;
      else if (level === 'Riesgo bajo') counts.bajo++;
      else if (level === 'Riesgo medio') counts.medio++;
      else if (level === 'Riesgo alto') counts.alto++;
      else if (level === 'Riesgo muy alto') counts.muyAlto++;
    }
    const t = counts.total || 1;
    return {
      factor: domainName,
      sinRiesgo: { count: counts.sinRiesgo, pct: counts.sinRiesgo / t },
      bajo: { count: counts.bajo, pct: counts.bajo / t },
      medio: { count: counts.medio, pct: counts.medio / t },
      alto: { count: counts.alto, pct: counts.alto / t },
      muyAlto: { count: counts.muyAlto, pct: counts.muyAlto / t },
      total: counts.total,
    };
  });
}

// ─── Estrés aggregation ───────────────────────────────────────────────────────

function aggregateEstres(responses: ProcessedResponse[], formFilter?: 'A' | 'B'): EstresAggregated {
  const filtered = formFilter ? responses.filter(r => r.formType === formFilter) : responses;
  const total = filtered.length || 1;
  const RISK_LEVELS: RiskLevel[] = [
    'Sin riesgo o riesgo despreciable', 'Riesgo bajo', 'Riesgo medio', 'Riesgo alto', 'Riesgo muy alto',
  ];

  const riskCounts: Record<string, number> = {};
  const byKey: Record<string, Record<string, number>> = {};
  for (const k of Object.keys(ESTRES_KEYS)) byKey[k] = {};

  for (const r of filtered) {
    const scores: number[] = [];
    for (const key of Object.keys(ESTRES_KEYS)) {
      const entry = r.results[key];
      if (entry) {
        scores.push(entry.score);
        const lvl = normalizeLevel(entry.level);
        byKey[key][lvl] = (byKey[key][lvl] || 0) + 1;
      }
    }
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      let nivel: RiskLevel;
      if (avg < 20) nivel = 'Sin riesgo o riesgo despreciable';
      else if (avg < 40) nivel = 'Riesgo bajo';
      else if (avg < 60) nivel = 'Riesgo medio';
      else if (avg < 80) nivel = 'Riesgo alto';
      else nivel = 'Riesgo muy alto';
      riskCounts[nivel] = (riskCounts[nivel] || 0) + 1;
    }
  }

  const toFreq = (map: Record<string, number>): FrequencyItem[] =>
    RISK_LEVELS.map(label => ({ label, count: map[label] || 0, percentage: (map[label] || 0) / total }));

  return {
    distribution: toFreq(riskCounts),
    sintomasFisiologicos: toFreq(byKey['Estrés - Síntomas Fisiológicos']),
    sintomasComportamentales: toFreq(byKey['Estrés - Síntomas Comportamiento Social']),
    sintomasIntelectualesLaborales: toFreq(byKey['Estrés - Síntomas Intelectuales y Laborales']),
    sintomasEmocionales: toFreq(byKey['Estrés - Síntomas Psicoemocionales']),
  };
}

// ─── Priorizadas ──────────────────────────────────────────────────────────────

function getPriorizadas(rows: RiskTableRow[], topN = 5): string[] {
  return [...rows]
    .sort((a, b) => (b.alto.pct + b.muyAlto.pct) - (a.alto.pct + a.muyAlto.pct))
    .slice(0, topN)
    .filter(r => r.alto.pct + r.muyAlto.pct > 0)
    .map(r => r.factor);
}

// ─── Matriz ───────────────────────────────────────────────────────────────────

const ACCIONES: Record<string, string> = {
  'Sin riesgo o riesgo despreciable': 'Mantener y fortalecer los factores protectores identificados.',
  'Riesgo bajo': 'Implementar acciones de mantenimiento y mejora continua.',
  'Riesgo medio': 'Diseñar e implementar intervenciones preventivas a nivel organizacional e individual.',
  'Riesgo alto': 'Intervención prioritaria: diseñar programas específicos de intervención y seguimiento.',
  'Riesgo muy alto': 'Intervención INMEDIATA: establecer medidas urgentes de control y seguimiento individual.',
};

function buildMatriz(rows: RiskTableRow[]): MatrizIntervencion[] {
  const seen = new Set<string>();
  return rows.filter(r => { if (seen.has(r.factor)) return false; seen.add(r.factor); return true; })
    .map(row => {
      let level: RiskLevel = 'Sin riesgo o riesgo despreciable';
      if (row.muyAlto.pct >= 0.2) level = 'Riesgo muy alto';
      else if (row.alto.pct + row.muyAlto.pct >= 0.3) level = 'Riesgo alto';
      else if (row.medio.pct >= 0.3) level = 'Riesgo medio';
      else if (row.bajo.pct >= 0.3) level = 'Riesgo bajo';
      return { factor: row.factor, nivelRiesgo: level, acciones: ACCIONES[level] };
    });
}

// ─── PVE ──────────────────────────────────────────────────────────────────────

function buildPVERows(
  intA: RiskTableRow[], intB: RiskTableRow[],
  extA: RiskTableRow[], extB: RiskTableRow[],
  estA: EstresAggregated, estB: EstresAggregated,
): PVERow[] {
  const pct = (rows: RiskTableRow[]) => {
    const alto = rows.reduce((acc, r) => acc + r.alto.count + r.muyAlto.count, 0);
    const t = rows.reduce((acc, r) => acc + r.total, 0);
    return t > 0 ? Math.round((alto / t) * 100) : 0;
  };
  const estresPct = (agg: EstresAggregated) => {
    const alto = (agg.distribution.find(d => d.label === 'Riesgo alto')?.count || 0)
      + (agg.distribution.find(d => d.label === 'Riesgo muy alto')?.count || 0);
    const t = agg.distribution.reduce((acc, d) => acc + d.count, 0);
    return t > 0 ? Math.round((alto / t) * 100) : 0;
  };
  const C = '30% o más en nivel de riesgo alto o muy alto';
  const data: [string, number][] = [
    ['Total Factores Intralaborales Nivel Alto - Forma A', pct(intA)],
    ['Total Factores Intralaborales Nivel Alto y muy alto - Forma B', pct(intB)],
    ['Total Factores Extralaborales Nivel Alto - Forma A', pct(extA)],
    ['Total Factores Extralaborales Nivel Alto y muy alto - Forma B', pct(extB)],
    ['Síntomas de Estrés – Forma A', estresPct(estA)],
    ['Síntomas de Estrés – Forma B', estresPct(estB)],
  ];
  return [
    ...data.map(([evaluacion, p]) => ({ evaluacion, porcentaje: `${p}%`, criterio: C, requiereIngreso: p >= 30 ? 'Sí' : 'No' })),
    { evaluacion: 'No se identificaron trabajadores con enfermedad de interés Psicosocial.', porcentaje: '0%', criterio: 'Positivo en el 9% o más', requiereIngreso: 'No' },
  ];
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export function processReportData(campana: CampanaWithData): ReportData {
  const responses: ProcessedResponse[] = campana.participantes
    .filter(p => p.surveyResponse !== null)
    .map(p => ({
      formType: (p.surveyResponse!.formType || 'B') as 'A' | 'B',
      ficha: (p.surveyResponse!.fichaData || {}) as FichaRaw,
      results: (p.surveyResponse!.results || {}) as ResultsJSON,
    }));

  const total = responses.length;
  const formaA = responses.filter(r => r.formType === 'A').length;
  const formaB = responses.filter(r => r.formType === 'B').length;

  const demographics: DemographicsData = {
    totalParticipants: total, formaA, formaB,
    sexo: countFrequency(responses.map(r => r.ficha.ficha_2)),
    rangoEdad: countFrequency(responses.map(r => getAgeRange(r.ficha))),
    nivelEstudios: countFrequency(responses.map(r => r.ficha.ficha_4)),
    tipoVivienda: countFrequency(responses.map(r => r.ficha.ficha_8)),
    estadoCivil: countFrequency(responses.map(r => r.ficha.ficha_6)),
    estrato: countFrequency(responses.map(r => r.ficha.ficha_7)),
    personasACargo: countFrequency(responses.map(r => getPersonasRange(r.ficha.ficha_9))),
    aniosEmpresa: countFrequency(responses.map(r => getAniosRange(r.ficha.ficha_11))),
    aniosCargo: countFrequency(responses.map(r => getAniosRange(r.ficha.ficha_14))),
    tipoCargo: countFrequency(responses.map(r => r.ficha.ficha_13)),
    tipoContrato: countFrequency(responses.map(r => r.ficha.ficha_16)),
    tipoSalario: countFrequency(responses.map(r => r.ficha.ficha_18)),
    ocupacion: countFrequency(responses.map(r => r.ficha.ficha_5)),
    horasDiarias: countFrequency(responses.map(r => r.ficha.ficha_17)),
    ciudadResidencia: countFrequency(responses.map(r => r.ficha.ciudad_residencia)),
    deptResidencia: countFrequency(responses.map(r => r.ficha.departamento_residencia)),
    ciudadTrabajo: countFrequency(responses.map(r => r.ficha.ciudad_trabajo)),
    deptTrabajo: countFrequency(responses.map(r => r.ficha.departamento_trabajo)),
  };

  const intralaboralFormaA = buildRiskTable(INTRA_KEYS, responses, 'A');
  const intralaboralFormaB = buildRiskTable(INTRA_KEYS, responses, 'B');
  const dominiosFormaA = buildDominiosTable(responses, 'A');
  const dominiosFormaB = buildDominiosTable(responses, 'B');
  const extralaboralFormaA = buildRiskTable(EXTRA_KEYS, responses, 'A');
  const extralaboralFormaB = buildRiskTable(EXTRA_KEYS, responses, 'B');

  const generalRisk: GeneralRiskRow[] = [
    ...buildRiskTable(INTRA_KEYS, responses).map(r => ({ ...r, tipo: 'Dimensión' })),
    ...buildDominiosTable(responses).map(r => ({ ...r, tipo: 'Dominio' })),
    ...buildRiskTable(EXTRA_KEYS, responses).map(r => ({ ...r, tipo: 'Extralaboral' })),
  ];

  const estresGeneral = aggregateEstres(responses);
  const estresFormaA = aggregateEstres(responses, 'A');
  const estresFormaB = aggregateEstres(responses, 'B');

  const dimensionesPriorizadasA = getPriorizadas(intralaboralFormaA, 4);
  const dimensionesPriorizadasB = getPriorizadas(intralaboralFormaB, 4);
  const dimensionesExtralaboralesPriorizadas = getPriorizadas(
    [...extralaboralFormaA, ...extralaboralFormaB].filter((r, i, arr) => arr.findIndex(x => x.factor === r.factor) === i), 3
  );

  const matrizIntralaboral = buildMatriz([...intralaboralFormaA, ...intralaboralFormaB]);
  const matrizExtralaboral = buildMatriz([...extralaboralFormaA, ...extralaboralFormaB]);
  const pveRows = buildPVERows(intralaboralFormaA, intralaboralFormaB, extralaboralFormaA, extralaboralFormaB, estresFormaA, estresFormaB);

  const today = new Date();
  const fechaInforme = today.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  return {
    empresaNombre: campana.empresa.name,
    empresaNit: campana.empresa.nit || '',
    campanaNombre: campana.name,
    fechaInforme: `Montería, ${fechaInforme}`,
    demographics,
    intralaboralFormaA, intralaboralFormaB,
    dominiosFormaA, dominiosFormaB,
    extralaboralFormaA, extralaboralFormaB,
    estresGeneral, estresFormaA, estresFormaB,
    generalRisk,
    matrizIntralaboral, matrizExtralaboral,
    pveRows,
    dimensionesPriorizadasA, dimensionesPriorizadasB, dimensionesExtralaboralesPriorizadas,
  };
}