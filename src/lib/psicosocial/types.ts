// ============================================================
// TYPES - Psychosocial Risk Report Generator
// ============================================================

export type RiskLevel =
  | 'Sin riesgo o riesgo despreciable'
  | 'Riesgo bajo'
  | 'Riesgo medio'
  | 'Riesgo alto'
  | 'Riesgo muy alto'
  | 'No aplica';

export type FormType = 'A' | 'B';

// ─── Raw DB Types (SurveyResponse.results JSON) ──────────────────────────────

export interface DimensionResult {
  variable: string;
  valor: number | null; // null = "No aplica"
  interpretacion: RiskLevel;
  tipo: 'Dimensión' | 'Dominio' | 'Extralaboral' | 'Total cuestionario';
}

export interface EstresResult {
  nivel: RiskLevel;
  valor: number | null;
  sintomasFisiologicos?: number;
  sintomasComportamentales?: number;
  sintomasIntelectualesLaborales?: number;
  sintomasEmocionales?: number;
}

export interface SurveyResultsJSON {
  dimensiones: DimensionResult[];
  dominios: DimensionResult[];
  extralaboral: DimensionResult[];
  totalIntralaboral?: DimensionResult;
  totalExtralaboral?: DimensionResult;
  estres?: EstresResult;
}

// ─── Raw DB Types (SurveyResponse.filters / fichaData JSON) ─────────────────

export interface FichaData {
  sexo?: string;
  fechaNacimiento?: string;
  edad?: number;
  estadoCivil?: string;
  nivelEstudios?: string;
  ocupacion?: string;
  ciudadResidencia?: string;
  deptResidencia?: string;
  estrato?: string | number;
  tipoVivienda?: string;
  personasACargo?: string | number;
  ciudadTrabajo?: string;
  deptTrabajo?: string;
  aniosEmpresa?: string | number;
  cargo?: string;
  tipoCargo?: string;
  aniosCargo?: string | number;
  area?: string;
  horasDiarias?: string | number;
  tipoContrato?: string;
  tipoSalario?: string;
}

// ─── Processed / Aggregated Report Data ──────────────────────────────────────

export interface FrequencyItem {
  label: string;
  count: number;
  percentage: number;
}

export interface DemographicsData {
  totalParticipants: number;
  formaA: number;
  formaB: number;
  sexo: FrequencyItem[];
  rangoEdad: FrequencyItem[];
  nivelEstudios: FrequencyItem[];
  tipoVivienda: FrequencyItem[];
  estadoCivil: FrequencyItem[];
  estrato: FrequencyItem[];
  personasACargo: FrequencyItem[];
  aniosEmpresa: FrequencyItem[];
  aniosCargo: FrequencyItem[];
  tipoCargo: FrequencyItem[];
  tipoContrato: FrequencyItem[];
  tipoSalario: FrequencyItem[];
  ocupacion: FrequencyItem[];
  horasDiarias: FrequencyItem[];
  ciudadResidencia: FrequencyItem[];
  deptResidencia: FrequencyItem[];
  ciudadTrabajo: FrequencyItem[];
  deptTrabajo: FrequencyItem[];
}

export interface RiskTableRow {
  factor: string;
  sinRiesgo: { count: number; pct: number };
  bajo: { count: number; pct: number };
  medio: { count: number; pct: number };
  alto: { count: number; pct: number };
  muyAlto: { count: number; pct: number };
  total: number;
}

export interface RiskSummary {
  factor: string;
  riskLevel: RiskLevel;
  percentage: number; // % in alto + muy alto
}

export interface EstresAggregated {
  distribution: FrequencyItem[]; // risk levels
  sintomasFisiologicos: FrequencyItem[];
  sintomasComportamentales: FrequencyItem[];
  sintomasIntelectualesLaborales: FrequencyItem[];
  sintomasEmocionales: FrequencyItem[];
}

export interface GeneralRiskRow {
  factor: string;
  tipo: string;
  sinRiesgo: { count: number; pct: number };
  bajo: { count: number; pct: number };
  medio: { count: number; pct: number };
  alto: { count: number; pct: number };
  muyAlto: { count: number; pct: number };
  total: number;
}

export interface PVERow {
  evaluacion: string;
  porcentaje: string;
  criterio: string;
  requiereIngreso: string;
}

export interface MatrizIntervencion {
  factor: string;
  nivelRiesgo: RiskLevel;
  acciones: string;
}

export interface ReportData {
  // Campaign / Company info
  empresaNombre: string;
  empresaNit: string;
  campanaNombre: string;
  fechaInforme: string;

  // Demographics
  demographics: DemographicsData;

  // Intralaboral
  intralaboralFormaA: RiskTableRow[];
  intralaboralFormaB: RiskTableRow[];
  dominiosFormaA: RiskTableRow[];
  dominiosFormaB: RiskTableRow[];

  // Extralaboral
  extralaboralFormaA: RiskTableRow[];
  extralaboralFormaB: RiskTableRow[];

  // Estrés
  estresGeneral: EstresAggregated;
  estresFormaA: EstresAggregated;
  estresFormaB: EstresAggregated;

  // General (all together)
  generalRisk: GeneralRiskRow[];

  // Matrices
  matrizIntralaboral: MatrizIntervencion[];
  matrizExtralaboral: MatrizIntervencion[];

  // PVE table
  pveRows: PVERow[];

  // Summary text (for conclusions - auto-generated)
  dimensionesPriorizadasA: string[];
  dimensionesPriorizadasB: string[];
  dimensionesExtralaboralesPriorizadas: string[];
}