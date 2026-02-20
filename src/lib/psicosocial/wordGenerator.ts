// ============================================================
// WORD GENERATOR - Builds the complete .docx report
// Install: npm install docx
// ============================================================
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, HeadingLevel, AlignmentType, WidthType, BorderStyle,
  ShadingType, Header, PageBreak, TableOfContents, LevelFormat,
  convertInchesToTwip, VerticalAlign, PageOrientation,
} from 'docx';
import type { ReportData, RiskTableRow, MatrizIntervencion, PVERow, FrequencyItem } from './types';
import type { ReportCharts } from './chartGenerator';

// ─── Colors & Styles ─────────────────────────────────────────────────────────

const BRAND_BLUE = '003f88';
const RISK_BG: Record<string, string> = {
  'Sin riesgo o riesgo despreciable': 'C6EFCE',
  'Riesgo bajo': 'EBFFB0',
  'Riesgo medio': 'FFFF99',
  'Riesgo alto': 'FFD580',
  'Riesgo muy alto': 'FF8080',
  'No aplica': 'EEEEEE',
};

// ─── Helper builders ─────────────────────────────────────────────────────────

function heading1(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: true,
    spacing: { before: 200, after: 200 },
  });
}

function heading2(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 120 },
  });
}

function heading3(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 160, after: 100 },
  });
}

function para(text: string, bold = false, centered = false): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold, size: 22 })],
    alignment: centered ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
    spacing: { before: 80, after: 80, line: 276 },
  });
}

function bulletPara(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })],
    bullet: { level: 0 },
    spacing: { before: 60, after: 60 },
  });
}

function imageWithCaption(imgBuffer: Buffer, caption: string, width = 580, height = 320): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new ImageRun({
          data: imgBuffer,
          transformation: { width, height },
          type: 'png',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 60 },
    }),
    new Paragraph({
      children: [new TextRun({ text: caption, italics: true, size: 18, color: '666666' })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 160 },
    }),
  ];
}

function cellText(text: string, bold = false, shade?: string, fontSize = 18): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text: String(text), bold, size: fontSize })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 40, after: 40 },
      }),
    ],
    shading: shade ? { fill: shade, type: ShadingType.CLEAR, color: 'auto' } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
  });
}

function headerCell(text: string): TableCell {
  return cellText(text, true, 'D6E4F0', 17);
}

function riskCell(level: string): TableCell {
  const bg = RISK_BG[level] || 'FFFFFF';
  return cellText(level, false, bg, 17);
}

function pct(n: number): string {
  return (n * 100).toFixed(1) + '%';
}

// ─── Risk Distribution Table ──────────────────────────────────────────────────

function buildRiskTable(rows: RiskTableRow[]): Table {
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      headerCell('Factor'),
      headerCell('Sin riesgo\no r. despreciable'),
      headerCell('%'),
      headerCell('Riesgo\nbajo'),
      headerCell('%'),
      headerCell('Riesgo\nmedio'),
      headerCell('%'),
      headerCell('Riesgo\nalto'),
      headerCell('%'),
      headerCell('Riesgo\nmuy alto'),
      headerCell('%'),
      headerCell('Total'),
    ],
  });

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: row.factor, size: 17 })], spacing: { before: 40, after: 40 } })],
            margins: { top: 60, bottom: 60, left: 120, right: 60 },
          }),
          cellText(row.sinRiesgo.count.toString()),
          cellText(pct(row.sinRiesgo.pct)),
          cellText(row.bajo.count.toString()),
          cellText(pct(row.bajo.pct)),
          cellText(row.medio.count.toString()),
          cellText(pct(row.medio.pct)),
          cellText(row.alto.count.toString(), false, row.alto.pct + row.muyAlto.pct >= 0.3 ? 'FFD580' : undefined),
          cellText(pct(row.alto.pct), false, row.alto.pct + row.muyAlto.pct >= 0.3 ? 'FFD580' : undefined),
          cellText(row.muyAlto.count.toString(), false, row.muyAlto.pct >= 0.2 ? 'FF8080' : undefined),
          cellText(pct(row.muyAlto.pct), false, row.muyAlto.pct >= 0.2 ? 'FF8080' : undefined),
          cellText(row.total.toString()),
        ],
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });
}

// ─── Intervention Matrix Table ────────────────────────────────────────────────

function buildMatrizTable(rows: MatrizIntervencion[]): Table {
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      headerCell('Factor / Dimensión'),
      headerCell('Nivel de Riesgo'),
      headerCell('Acciones Recomendadas'),
    ],
  });

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: row.factor, size: 17 })], spacing: { before: 40, after: 40 } })],
            margins: { left: 120, right: 60 },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: row.nivelRiesgo, size: 17 })], alignment: AlignmentType.CENTER })],
            shading: { fill: RISK_BG[row.nivelRiesgo] || 'FFFFFF', type: ShadingType.CLEAR, color: 'auto' },
            width: { size: 20, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: row.acciones, size: 17 })], spacing: { before: 40, after: 40 } })],
            width: { size: 50, type: WidthType.PERCENTAGE },
          }),
        ],
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });
}

// ─── PVE Table ────────────────────────────────────────────────────────────────

function buildPVETable(rows: PVERow[]): Table {
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      headerCell('Resultados de la evaluación'),
      headerCell('%'),
      headerCell('Criterio para ingreso al PVE – FRP'),
      headerCell('¿Requieren ingresar al PVE?'),
    ],
  });

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: row.evaluacion, size: 17 })] })], margins: { left: 120, right: 60 } }),
          cellText(row.porcentaje),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: row.criterio, size: 17 })] })] }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: row.requiereIngreso, bold: true, size: 17, color: row.requiereIngreso === 'Sí' ? 'CC0000' : '006600' })], alignment: AlignmentType.CENTER })],
            shading: { fill: row.requiereIngreso === 'Sí' ? 'FFE0E0' : 'E0FFE0', type: ShadingType.CLEAR, color: 'auto' },
          }),
        ],
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });
}

// ─── Cover Page ───────────────────────────────────────────────────────────────

function buildCoverPage(data: ReportData): Paragraph[] {
  return [
    new Paragraph({ children: [new TextRun({ text: '', size: 10 })], spacing: { before: 1400 } }),
    new Paragraph({
      children: [new TextRun({ text: 'INFORME DE EVALUACIÓN DEL RIESGO PSICOSOCIAL', bold: true, size: 32, color: BRAND_BLUE })],
      alignment: AlignmentType.CENTER, spacing: { before: 200, after: 400 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Empresa: ', bold: true, size: 24 }), new TextRun({ text: data.empresaNombre, size: 24 })],
      alignment: AlignmentType.CENTER, spacing: { before: 100, after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'NIT: ', bold: true, size: 22 }), new TextRun({ text: data.empresaNit, size: 22 })],
      alignment: AlignmentType.CENTER, spacing: { before: 60, after: 60 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Campaña: ${data.campanaNombre}`, size: 22 })],
      alignment: AlignmentType.CENTER, spacing: { before: 60, after: 300 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Elaborado por:', bold: true, size: 22 })],
      alignment: AlignmentType.CENTER, spacing: { before: 200, after: 60 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'MGA CONSULTOR EMPRESARIAL S.A.S.', bold: true, size: 22 })],
      alignment: AlignmentType.CENTER, spacing: { before: 60, after: 60 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Licencia de SST N° #### de 2019', size: 20 })],
      alignment: AlignmentType.CENTER, spacing: { before: 60, after: 300 },
    }),
    new Paragraph({
      children: [new TextRun({ text: data.fechaInforme, italics: true, size: 20 })],
      alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 },
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── Introduction Section ─────────────────────────────────────────────────────

function buildIntroSection(data: ReportData): Paragraph[] {
  const empresa = data.empresaNombre;
  return [
    heading1('I. INTRODUCCIÓN'),
    para(
      'En el marco de la Gestión del Riesgo Psicosocial en Colombia, el Ministerio de la Protección Social identificó la presencia de los factores de riesgos psicosociales como prioritarios. Mediante la Resolución 2646 de 2008 se definen las responsabilidades en cuanto a la identificación, evaluación, prevención, intervención y monitoreo permanente de la exposición a los factores de riesgos psicosocial en el trabajo.'
    ),
    para(
      `En el marco del Sistema de Gestión de Seguridad y Salud en el Trabajo de la empresa ${empresa}, mediante este informe se entrega un diagnóstico del nivel de riesgo psicosocial presente en la empresa conforme a las pautas establecidas en la batería de riesgo psicosocial expuesta por el Ministerio de la Protección Social Resolución 2646 de 2008 y la Resolución 2764 de 2022 del Ministerio del Trabajo.`
    ),
    heading1('II. OBJETIVOS'),
    heading2('2.1. Objetivo General'),
    para(
      `Desarrollar acciones de vigilancia de la salud de la población trabajadora de ${empresa} a partir de la evaluación objetiva y subjetiva del riesgo psicosocial mediante la adopción de la Batería de Instrumentos para la Evaluación de Factores de Riesgo Psicosocial, definida por el Ministerio de Trabajo mediante la Resolución 2764 expedida en 2022.`
    ),
    heading2('2.2. Objetivos Específicos'),
    bulletPara(`Realizar un análisis del contexto de la empresa ${empresa}, actividad socioeconómica y características demográficas de la población trabajadora.`),
    bulletPara(`Evaluar el Riesgo Psicosocial inherente a ${empresa} a partir de la identificación, evaluación y valoración de los factores de riesgos psicosociales intralaborales y extralaborales.`),
    bulletPara(`Evaluar el riesgo expresado en la población trabajadora de ${empresa} a partir de la identificación del nivel de estrés.`),
  ];
}

// ─── Generalidades Section ────────────────────────────────────────────────────

function buildGeneralidadesSection(data: ReportData): Paragraph[] {
  return [
    heading1('IX. GENERALIDADES DE LA EMPRESA A EVALUAR'),
    heading2('9.1. Plataforma Estratégica'),
    para('[Completar: Misión, Visión de la empresa]'),
    heading2('9.2. Estructura Organizacional'),
    para('[Insertar organigrama de la empresa]'),
    heading2('9.3. Localización de la empresa'),
    para('[Completar: dirección, ciudad, departamento]'),
    heading2('9.4. Actividad Económica'),
    para('[Completar: actividad económica principal de la empresa]'),
    heading2('9.5. ARL y Nivel de Riesgo'),
    para('[Completar: nombre de ARL y nivel de riesgo asignado]'),
    heading2('9.6. Número total de trabajadores'),
    para(`Total de trabajadores evaluados en esta campaña: ${data.demographics.totalParticipants}`),
    heading2('9.7. Antecedentes en materia de Gestión del Riesgo Psicosocial en la Empresa'),
    para('[Completar: historia de evaluaciones previas de riesgo psicosocial]'),
  ];
}

// ─── Demographics Section ─────────────────────────────────────────────────────

function buildDemographicsSection(data: ReportData, charts: ReportCharts): (Paragraph | Table)[] {
  const dem = data.demographics;
  const results: (Paragraph | Table)[] = [
    heading1('X. EVALUACIÓN DE LOS FACTORES PSICOSOCIALES Y SUS EFECTOS'),
    heading2('10.1. Planificación de la aplicación del instrumento'),
    para(
      `Se estableció el cronograma de trabajo, número de participantes y clasificación en las formas A y B según lo establece la Resolución 2764 de 2022. Total de participantes evaluados: ${dem.totalParticipants} trabajadores, distribuidos así: Forma A: ${dem.formaA} y Forma B: ${dem.formaB}.`
    ),
    heading2('10.2. Análisis de los Resultados'),
    para(
      `El presente diagnóstico se realizó con ${dem.totalParticipants} colaboradores, a quienes se les asignó la forma de evaluación conforme al perfil discriminado por la batería: Forma A: ${dem.formaA} y Forma B: ${dem.formaB}.`
    ),
    heading3('10.3.1. Descripción Sociodemográfica de la Población'),
    heading3('Género'),
    ...imageWithCaption(charts.sexo, 'Gráfico 1: Género'),
    heading3('Rango de Edad'),
    ...imageWithCaption(charts.rangoEdad, 'Gráfico 2: Promedio de edad'),
    heading3('Nivel de Estudios'),
    ...imageWithCaption(charts.nivelEstudios, 'Gráfico 3: Nivel de estudios'),
    heading3('Tipo de Vivienda'),
    ...imageWithCaption(charts.tipoVivienda, 'Gráfico 4: Tipo de vivienda'),
    heading3('Estado Civil'),
    ...imageWithCaption(charts.estadoCivil, 'Gráfico 5: Estado civil'),
    heading3('Nivel Socioeconómico'),
    ...imageWithCaption(charts.estrato, 'Gráfico 6: Nivel socioeconómico'),
    heading3('Personas a Cargo'),
    ...imageWithCaption(charts.personasACargo, 'Gráfico 7: Personas a cargo'),
    heading3('Antigüedad en la Empresa'),
    ...imageWithCaption(charts.aniosEmpresa, 'Gráfico 8: Antigüedad en la empresa'),
    heading3('Antigüedad en el Cargo'),
    ...imageWithCaption(charts.aniosCargo, 'Gráfico 9: Antigüedad en el cargo'),
    heading3('Niveles Jerárquicos'),
    ...imageWithCaption(charts.tipoCargo, 'Gráfico 10: Niveles jerárquicos'),
    heading3('Tipo de Contrato'),
    ...imageWithCaption(charts.tipoContrato, 'Gráfico 11: Tipo de contrato'),
    heading3('Tipo de Salario'),
    ...imageWithCaption(charts.tipoSalario, 'Gráfico 12: Tipo de salario'),
    heading3('Ocupación u Oficio'),
    ...imageWithCaption(charts.ocupacion, 'Gráfico 13: Ocupación u oficio'),
    heading3('Horas de Trabajo al Día'),
    ...imageWithCaption(charts.horasDiarias, 'Gráfico 14: Horas de trabajo al día'),
    heading3('Ciudad de Residencia'),
    ...imageWithCaption(charts.ciudadResidencia, 'Gráfico 15: Ciudad de residencia'),
    heading3('Departamento de Residencia'),
    ...imageWithCaption(charts.deptResidencia, 'Gráfico 16: Departamento de residencia'),
    heading3('Ciudad donde Trabaja Actualmente'),
    ...imageWithCaption(charts.ciudadTrabajo, 'Gráfico 17: Ciudad donde trabaja actualmente'),
    heading3('Departamento donde Trabaja Actualmente'),
    ...imageWithCaption(charts.deptTrabajo, 'Gráfico 18: Departamento donde trabaja actualmente'),
  ];
  return results;
}

// ─── Risk Analysis Section ────────────────────────────────────────────────────

function buildRiskSection(data: ReportData, charts: ReportCharts): (Paragraph | Table)[] {
  const results: (Paragraph | Table)[] = [];

  // Intralaboral
  results.push(heading2('10.3.2. Análisis de Riesgo Psicosocial'));
  results.push(heading3('10.3.2.1. Análisis Intralaboral'));
  results.push(para('Tabla 14: Análisis intralaboral'));
  results.push(buildRiskTable([...data.intralaboralFormaA, ...data.intralaboralFormaB]));
  results.push(new Paragraph({ spacing: { before: 160 } }));

  if (data.dimensionesPriorizadasA.length > 0) {
    results.push(para('Las dimensiones intralaborales Forma A con mayor nivel de riesgo alto y muy alto son:', true));
    data.dimensionesPriorizadasA.forEach((d) => results.push(bulletPara(d)));
  }
  if (data.dimensionesPriorizadasB.length > 0) {
    results.push(para('Las dimensiones intralaborales Forma B con mayor nivel de riesgo alto y muy alto son:', true));
    data.dimensionesPriorizadasB.forEach((d) => results.push(bulletPara(d)));
  }

  results.push(heading3('Disposición Gráfica - Evaluación Intralaboral por Formas'));
  results.push(...imageWithCaption(charts.intralaboralFormaA, 'Gráfico 19: Factores intralaborales Forma A'));
  results.push(...imageWithCaption(charts.intralaboralFormaB, 'Gráfico 20: Factores intralaborales Forma B'));

  // Dominios
  results.push(heading3('Análisis Intralaboral por Dominios'));
  results.push(para('Tabla 15: Análisis intralaboral por dominios'));
  results.push(buildRiskTable([...data.dominiosFormaA, ...data.dominiosFormaB]));
  results.push(new Paragraph({ spacing: { before: 160 } }));

  // Extralaboral
  results.push(heading3('10.3.2.2. Análisis Extralaboral'));
  results.push(para('Tabla 16: Análisis extralaboral por dimensiones'));
  results.push(buildRiskTable([...data.extralaboralFormaA, ...data.extralaboralFormaB]));
  results.push(new Paragraph({ spacing: { before: 160 } }));

  if (data.dimensionesExtralaboralesPriorizadas.length > 0) {
    results.push(para('Las dimensiones extralaborales priorizadas son:', true));
    data.dimensionesExtralaboralesPriorizadas.forEach((d) => results.push(bulletPara(d)));
  }

  results.push(heading3('Disposición Gráfica - Evaluación Extralaboral por Formas'));
  results.push(...imageWithCaption(charts.extralaboralFormaA, 'Gráfico 21: Factores extralaborales Forma A'));
  results.push(...imageWithCaption(charts.extralaboralFormaB, 'Gráfico 22: Factores extralaborales Forma B'));

  // Estrés
  results.push(heading3('10.3.2.3. Análisis y Evaluación del Estrés'));
  results.push(...imageWithCaption(charts.estresGeneral, 'Gráfico 23: Estrés - Total General'));
  results.push(...imageWithCaption(charts.estresGeneralSintomas, 'Gráfico 24: Principales síntomas del estrés'));
  results.push(...imageWithCaption(charts.estresFormaA, 'Gráfico 25: Estrés Forma A'));
  results.push(...imageWithCaption(charts.estresFormaASintomas, 'Gráfico 26: Principales síntomas del estrés - Forma A'));
  results.push(...imageWithCaption(charts.estresFormaB, 'Gráfico 27: Estrés Forma B'));
  results.push(...imageWithCaption(charts.estresFormaBSintomas, 'Gráfico 28: Principales síntomas del estrés - Forma B'));

  // General
  results.push(heading3('10.3.2.4. Análisis de Riesgo de la Empresa a Nivel General'));
  results.push(para('Tabla 17: Análisis de la empresa a nivel general'));
  results.push(buildRiskTable(data.generalRisk as RiskTableRow[]));
  results.push(new Paragraph({ spacing: { before: 160 } }));
  results.push(...imageWithCaption(charts.generalFactores, 'Gráfico 29: Factores - Total general'));
  results.push(...imageWithCaption(charts.generalFormaA, 'Gráfico 30: Factores - Forma A'));
  results.push(...imageWithCaption(charts.generalFormaB, 'Gráfico 31: Factores - Forma B'));

  // Matrices
  results.push(heading3('10.3.2.5. Noción de Evaluación General del Riesgo Psicosocial'));
  results.push(para('Matriz de intervención intralaboral:'));
  results.push(para('Tabla 18: Matriz de dimensiones'));
  results.push(buildMatrizTable(data.matrizIntralaboral));
  results.push(new Paragraph({ spacing: { before: 160 } }));
  results.push(para('Matriz de intervención Extralaboral:'));
  results.push(para('Tabla 19: Matriz de intervención extralaboral'));
  results.push(buildMatrizTable(data.matrizExtralaboral));
  results.push(new Paragraph({ spacing: { before: 160 } }));

  return results;
}

// ─── Conclusions Section ──────────────────────────────────────────────────────

function buildConclusionsSection(data: ReportData): (Paragraph | Table)[] {
  const empresa = data.empresaNombre;
  const dem = data.demographics;

  // Gender conclusion
  const totalM = dem.sexo.find((s) => /mascul/i.test(s.label));
  const totalF = dem.sexo.find((s) => /femen/i.test(s.label));
  const genderText = totalM && totalF
    ? `La población evaluada está conformada por ${(totalF.percentage * 100).toFixed(1)}% mujeres y ${(totalM.percentage * 100).toFixed(1)}% hombres.`
    : 'La distribución por género está disponible en las gráficas correspondientes.';

  return [
    heading1('XI. CONCLUSIONES Y RECOMENDACIONES'),
    para('El análisis se realizó de manera general gracias a los resultados obtenidos mediante la aplicación de la batería de instrumentos para la evaluación de factores de riesgos del Ministerio del Trabajo, adoptado mediante la Resolución 2764 del 2022.'),
    heading3('Conclusiones Sociodemográficas'),
    para(genderText),
    para(`El total de participantes evaluados fue de ${dem.totalParticipants} trabajadores de la empresa ${empresa}, distribuidos en Forma A (${dem.formaA} personas) y Forma B (${dem.formaB} personas).`),
    heading3('Conclusiones Forma A'),
    data.dimensionesPriorizadasA.length > 0
      ? para(`Las dimensiones con mayor nivel de riesgo en Forma A son: ${data.dimensionesPriorizadasA.join(', ')}. Se recomienda priorizar intervenciones en estas áreas.`)
      : para('No se identificaron dimensiones de riesgo alto o muy alto en Forma A que requieran intervención prioritaria.'),
    heading3('Conclusiones Forma B'),
    data.dimensionesPriorizadasB.length > 0
      ? para(`Las dimensiones con mayor nivel de riesgo en Forma B son: ${data.dimensionesPriorizadasB.join(', ')}. Se recomienda priorizar intervenciones en estas áreas.`)
      : para('No se identificaron dimensiones de riesgo alto o muy alto en Forma B que requieran intervención prioritaria.'),
    heading3('Conclusiones Extralaborales'),
    data.dimensionesExtralaboralesPriorizadas.length > 0
      ? para(`Las dimensiones extralaborales priorizadas son: ${data.dimensionesExtralaboralesPriorizadas.join(', ')}.`)
      : para('No se identificaron dimensiones extralaborales de riesgo alto o muy alto prioritarias.'),
    para('Las dimensiones priorizadas se deben tener en cuenta para el establecimiento de acciones de promoción de factores de protección e intervención de acuerdo con las guías y protocolos de atención propuestos por el ministerio del trabajo y el contexto de la organización.'),
    heading3('Análisis para Determinación de Ingreso de Trabajadores al PVE FRP'),
    buildPVETable(data.pveRows),
    new Paragraph({ spacing: { before: 160 } }),
    para(`De esta forma, se consolida el Informe de la Evaluación de Riesgo Psicosocial en ${empresa}.`),
  ];
}

// ─── Final Sections ───────────────────────────────────────────────────────────

function buildFinalSections(data: ReportData): Paragraph[] {
  const empresa = data.empresaNombre;
  return [
    heading1('XII. RESERVA DE LA INFORMACIÓN Y EVALUACIÓN'),
    para(
      `La información utilizada para la evaluación de los factores Psicosociales de la empresa ${empresa} está sometida a reserva, conforme lo establece la Ley 1090 de 2006.`
    ),
    heading1('XIII. CONTROL DE REVISIÓN, VERIFICACIÓN Y APROBACIÓN DEL DOCUMENTO'),
    para('Como constancia de lo descrito en el presente informe, firman los profesionales que participaron en su elaboración:'),
    new Paragraph({ spacing: { before: 400 } }),
    para('_______________________________', false, true),
    para('Nombre Psicólogo', false, true),
    para('Psicólogo Especialista en Higiene y Seguridad Industrial', false, true),
    para('Licencia SST N° ####', false, true),
    new Paragraph({ spacing: { before: 300 } }),
    para(`Fecha: ${data.fechaInforme}`, false, true),
  ];
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export async function generateWordDocument(
  data: ReportData,
  charts: ReportCharts
): Promise<Buffer> {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22 },
          paragraph: { spacing: { line: 276 } },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'heading 1',
          run: { bold: true, size: 28, color: BRAND_BLUE },
          paragraph: { spacing: { before: 400, after: 200 } },
        },
        {
          id: 'Heading2',
          name: 'heading 2',
          run: { bold: true, size: 24, color: '2F5496' },
          paragraph: { spacing: { before: 280, after: 160 } },
        },
        {
          id: 'Heading3',
          name: 'heading 3',
          run: { bold: true, size: 22, color: '1F3763' },
          paragraph: { spacing: { before: 200, after: 120 } },
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: 'default-bullet',
          levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) } } } }],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1080 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: `Informe de Evaluación de Riesgo Psicosocial – ${data.empresaNombre}`, size: 16, color: '666666', italics: true }),
                ],
                border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BRAND_BLUE } },
              }),
            ],
          }),
        },
        children: [
          ...buildCoverPage(data),
          ...buildIntroSection(data),
          ...buildGeneralidadesSection(data),
          ...buildDemographicsSection(data, charts),
          ...buildRiskSection(data, charts),
          ...buildConclusionsSection(data),
          ...buildFinalSections(data),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}