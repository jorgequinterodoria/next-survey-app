import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { formaASections, formaBSections, extralaboralSections, estresQuestions, fichaQuestions, consentimientoFields } = data;

    const content = `// This file is auto-generated and updated by PdfMapper.
export interface SurveyQuestion {
  id: number;
  texto: string;
  coords?: { x: number; y: number; page: number }[];
}

export interface SurveySection {
  key: string;
  titulo: string;
  instruccion: string;
  filtro?: string;
  preguntas: SurveyQuestion[];
}

export interface FichaQuestion {
  id: number;
  texto: string;
  tipo: 'text' | 'select' | 'number' | 'radio' | 'years';
  opciones?: string[];
  subfields?: { label: string; key: string }[];
  coords?: { x: number; y: number; page: number }[];
}

export interface ConsentimientoField {
  id: string;
  label: string;
  coords?: { x: number; y: number; page: number }[];
}

export const LIKERT_OPTIONS_INTRALABORAL = [
  { value: 'siempre', label: 'Siempre' },
  { value: 'casi_siempre', label: 'Casi siempre' },
  { value: 'algunas_veces', label: 'Algunas veces' },
  { value: 'casi_nunca', label: 'Casi nunca' },
  { value: 'nunca', label: 'Nunca' },
];

export const LIKERT_OPTIONS_ESTRES = [
  { value: 'siempre', label: 'Siempre' },
  { value: 'casi_siempre', label: 'Casi siempre' },
  { value: 'a_veces', label: 'A veces' },
  { value: 'nunca', label: 'Nunca' },
];

export const LIKERT_OPTIONS_EXTRALABORAL = [
  { value: 'siempre', label: 'Siempre' },
  { value: 'casi_siempre', label: 'Casi siempre' },
  { value: 'algunas_veces', label: 'Algunas veces' },
  { value: 'casi_nunca', label: 'Casi nunca' },
  { value: 'nunca', label: 'Nunca' },
];

// FORMA A sections
export const formaASections: SurveySection[] = ${JSON.stringify(formaASections, null, 2)};

// FORMA B sections
export const formaBSections: SurveySection[] = ${JSON.stringify(formaBSections, null, 2)};

// Extralaboral sections
export const extralaboralSections: SurveySection[] = ${JSON.stringify(extralaboralSections, null, 2)};

// Estrés questions
export const estresQuestions: SurveyQuestion[] = ${JSON.stringify(estresQuestions, null, 2)};

// Ficha de datos generales
export const fichaQuestions: FichaQuestion[] = ${JSON.stringify(fichaQuestions, null, 2)};

// Consentimiento Informado fields
export const consentimientoFields: ConsentimientoField[] = ${JSON.stringify(consentimientoFields, null, 2)};
`;

    const filePath = path.join(process.cwd(), 'src/data/surveyData.ts');
    fs.writeFileSync(filePath, content, 'utf8');

    return Response.json({ success: true, message: 'surveyData.ts updated successfully' });
  } catch (error) {
    console.error('Error saving coords:', error);
    return Response.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
