import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet, Image as PdfImage } from '@react-pdf/renderer';
import { processSurvey } from '../psychometrics';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', lineHeight: 1.4 },
  header: { fontSize: 12, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', textTransform: 'uppercase', fontFamily: 'Helvetica-Bold' },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', marginTop: 15, marginBottom: 10, backgroundColor: '#f3f4f6', padding: 5, textAlign: 'center', fontFamily: 'Helvetica-Bold' },
  table: { width: '100%', marginBottom: 15 },
  tableRow: { flexDirection: 'row', minHeight: 20, alignItems: 'stretch' },
  tableColHeader: { borderWidth: 1, borderColor: '#000', borderStyle: 'solid', backgroundColor: '#e5e7eb', padding: 5, textAlign: 'center', fontWeight: 'bold', fontFamily: 'Helvetica-Bold', justifyContent: 'center' },
  tableCol: { borderWidth: 1, borderColor: '#000', borderStyle: 'solid', padding: 5, justifyContent: 'center' },
  tableCell: { fontSize: 9 },
  tableCellBold: { fontSize: 9, fontWeight: 'bold', fontFamily: 'Helvetica-Bold' },
  interpretacionTitle: { fontSize: 11, fontWeight: 'bold', marginTop: 15, marginBottom: 5, fontFamily: 'Helvetica-Bold' },
  interpretacionText: { fontSize: 9, marginBottom: 4, textAlign: 'justify' },
  observacionesBox: { minHeight: 60, borderWidth: 1, borderColor: '#000', borderStyle: 'solid', marginTop: 5, marginBottom: 15, padding: 8 },
  signatureImage: { width: 200, height: 70, objectFit: 'contain', alignSelf: 'center', marginTop: 14, marginBottom: 6 },
  signatureLine: { borderTopWidth: 1, borderTopColor: '#000', width: 200, marginTop: 24, paddingTop: 5, textAlign: 'center', alignSelf: 'center' },
});

// Helper for generic 2-column info tables
const InfoTable = ({ title, data }: { title: string, data: [string, string][] }) => (
  <View style={{ marginBottom: 15 }} wrap={false}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.table}>
      {data.map(([label, value], i) => (
        <View style={[styles.tableRow, { minHeight: 25 }]} key={i}>
          <View style={[styles.tableCol, { width: '40%', backgroundColor: '#f9fafb' }]}>
            <Text style={styles.tableCellBold}>{label}</Text>
          </View>
          <View style={[styles.tableCol, { width: '60%' }]}>
            <Text style={styles.tableCell}>{value || ' '}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

// Formatter for numbers
const formatScore = (score: number | string | undefined | null): string => {
    if (score === undefined || score === null || score === '#N/D') return '#N/D';
    if (typeof score === 'number') return score.toFixed(1).replace('.', ',');
    return String(score);
}

// ---- Types for the table row ----
interface TableRowData {
  isDomain: boolean;
  isTotal?: boolean;
  domain: string;
  dimension: string;
  score: string;
  level: string;
}

// ---- Build table rows from the raw processSurvey structure ----

function buildIntralaboralRows(results: any, formType: 'A' | 'B'): TableRowData[] {
  const rows: TableRowData[] = [];
  if (!results?.intralaboral) return rows;

  const intra = results.intralaboral;
  const domains = intra.domains || [];

  // Map to display names for domains
  const domainDisplayNames: Record<string, string> = {
    'Liderazgo y relaciones sociales en el trabajo': 'LIDERAZGO Y RELACIONES SOCIALES EN EL TRABAJO',
    'Control sobre el trabajo': 'CONTROL SOBRE EL TRABAJO',
    'Demandas del trabajo': 'DEMANDAS DEL TRABAJO',
    'Recompensas': 'RECOMPENSAS',
  };

  // Dimensions that only exist in Form A
  const formAOnlyDimensions = [
    'Relación con los colaboradores (subordinados)',
    'Exigencias de responsabilidad del cargo',
    'Consistencia del rol',
  ];

  domains.forEach((domain: any) => {
    const dims = domain.dimensions || [];
    let isFirstInDomain = true;

    dims.forEach((dim: any) => {
      // Skip dimensions that don't exist in Form B
      if (formType === 'B' && formAOnlyDimensions.includes(dim.name)) {
        return;
      }

      rows.push({
        isDomain: false,
        domain: isFirstInDomain ? (domain.name || '') : '',
        dimension: dim.name || '',
        score: formatScore(dim.transformed),
        level: dim.level || '#N/D',
      });
      isFirstInDomain = false;
    });

    // Domain total row
    const domainUpperName = domainDisplayNames[domain.name] || (domain.name || '').toUpperCase();
    rows.push({
      isDomain: true,
      domain: domainUpperName,
      dimension: '',
      score: formatScore(domain.transformed),
      level: domain.level || '#N/D',
    });
  });

  // Grand Total
  if (intra.total) {
    rows.push({
      isDomain: true,
      isTotal: true,
      domain: 'TOTAL GENERAL FACTORES DE RIESGO PSICOSOCIAL INTRALABORAL',
      dimension: '',
      score: formatScore(intra.total.transformed),
      level: intra.total.level || '#N/D',
    });
  }

  return rows;
}

function buildExtralaboralRows(results: any): TableRowData[] {
  const rows: TableRowData[] = [];
  if (!results?.extralaboral) return rows;

  const extra = results.extralaboral;
  const domains = extra.domains || [];

  domains.forEach((domain: any) => {
    const dims = domain.dimensions || [];
    let isFirstInDomain = true;

    dims.forEach((dim: any) => {
      rows.push({
        isDomain: false,
        domain: isFirstInDomain ? 'Factores Extralaborales' : '',
        dimension: dim.name || '',
        score: formatScore(dim.transformed),
        level: dim.level || '#N/D',
      });
      isFirstInDomain = false;
    });
  });

  // Grand Total — for extralaboral, total is the same as the single domain
  const total = extra.total || (domains.length > 0 ? domains[0] : null);
  if (total) {
    rows.push({
      isDomain: true,
      isTotal: true,
      domain: 'TOTAL GENERAL FACTORES DE RIESGO PSICOSOCIAL EXTRALABORAL',
      dimension: '',
      score: formatScore(total.transformed),
      level: total.level || '#N/D',
    });
  }

  return rows;
}

function buildEstresRows(results: any): TableRowData[] {
  const rows: TableRowData[] = [];
  if (!results?.estres) return rows;

  const estres = results.estres;
  const domains = estres.domains || [];

  domains.forEach((domain: any) => {
    const dims = domain.dimensions || [];
    let isFirstInDomain = true;

    dims.forEach((dim: any) => {
      rows.push({
        isDomain: false,
        domain: isFirstInDomain ? 'Síntomas de Estrés' : '',
        dimension: dim.name || '',
        score: formatScore(dim.transformed),
        level: dim.level || '#N/D',
      });
      isFirstInDomain = false;
    });
  });

  // Grand Total
  const total = estres.total || (domains.length > 0 ? domains[0] : null);
  if (total) {
    rows.push({
      isDomain: true,
      isTotal: true,
      domain: 'TOTAL GENERAL SÍNTOMAS DE ESTRÉS',
      dimension: '',
      score: formatScore(total.transformed),
      level: total.level || '#N/D',
    });
  }

  return rows;
}

// ---- Interpretations ----
const INTRALABORAL_INTERPRETATIONS = [
  "- Sin riesgo o riesgo despreciable: ausencia de riesgo o riesgo tan bajo que no amerita desarrollar actividades de intervención. Las dimensiones y dominios que se encuentren bajo esta categoría serán objeto de acciones o programas de promoción.",
  "- Riesgo bajo: no se espera que los factores psicosociales que obtengan puntuaciones de este nivel estén relacionados con síntomas o respuestas de estrés significativas. Las dimensiones y dominios que se encuentren bajo esta categoría serán objeto de acciones o programas de intervención, a fin de mantenerlos en los niveles de riesgo más bajos posibles.",
  "- Riesgo medio: nivel de riesgo en el que se esperaría una respuesta de estrés moderada. Las dimensiones y dominios que se encuentren bajo esta categoría ameritan observación y acciones sistemáticas de intervención para prevenir efectos perjudiciales en la salud.",
  "- Riesgo alto: nivel de riesgo que tiene una importante posibilidad de asociación con respuestas de estrés alto y por tanto, las dimensiones y dominios que se encuentren bajo esta categoría requieren intervención en el marco de un sistema de vigilancia epidemiológica.",
  "- Riesgo muy alto: nivel de riesgo con amplia posibilidad de asociarse a respuestas muy altas de estrés. Por consiguiente las dimensiones y dominios que se encuentren bajo esta categoría requieren intervención inmediata en el marco de un sistema de vigilancia epidemiológica."
];

const ESTRES_INTERPRETATIONS = [
  "- Muy bajo: ausencia de síntomas de estrés u ocurrencia muy rara que no amerita desarrollar actividades de intervención específicas, salvo acciones o programas de promoción en salud.",
  "- Bajo: es indicativo de baja frecuencia de síntomas de estrés y por tanto escasa afectación del estado general de salud. Es pertinente desarrollar acciones o programas de intervención, a fin de mantener la baja frecuencia de síntomas.",
  "- Medio: la presentación de síntomas es indicativa de una respuesta de estrés moderada. Los síntomas más frecuentes y críticos ameritan observación y acciones sistemáticas de intervención para prevenir efectos perjudiciales en la salud. Además, se sugiere identificar los factores de riesgo psicosocial intra y extralaboral que pudieran tener alguna relación con los efectos identificados.",
  "- Alto: la cantidad de síntomas y su frecuencia de presentación es indicativa de una respuesta de estrés alto. Los síntomas más críticos y frecuentes requieren intervención en el marco de un sistema de vigilancia epidemiológica. Además, es muy importante identificar los factores de riesgo psicosocial intra y extralaboral que pudieran tener alguna relación con los efectos identificados.",
  "- Muy alto: la cantidad de síntomas y su frecuencia de presentación es indicativa de una respuesta de estrés severa y perjudicial para la salud. Los síntomas más críticos y frecuentes requieren intervención inmediata en el marco de un sistema de vigilancia epidemiológica. Así mismo, es imperativo identificar los factores de riesgo psicosocial intra y extralaboral que pudieran tener alguna relación con los efectos identificados."
];

const ResultsDocument = ({ type, title, participantData, results, formType }: any) => {
  const surveyResponse = participantData.surveyResponse || {};
  const fichaData = surveyResponse.fichaData || {};
  const campana = participantData.campana || {};
  const createdAt = surveyResponse.createdAt || participantData.createdAt;
  const evaluador = campana;
  const empresaName = campana?.empresa?.name || ' ';

  // Get raw values handling the {answer, label} object format OR flat string format
  const getFichaValue = (key: string) => {
    if (!fichaData || fichaData[key] === undefined || fichaData[key] === null) return ' ';
    if (typeof fichaData[key] === 'object' && fichaData[key] !== null) {
      if (fichaData[key].label) return String(fichaData[key].label);
      if (fichaData[key].answer) return String(fichaData[key].answer);
    }
    return String(fichaData[key]);
  };

  const cargo = getFichaValue('ficha_12');
  const depto = getFichaValue('ficha_15');
  
  // Calculate Age
  let birthYearStr = ' ';
  if (fichaData?.['ficha_3']) {
    birthYearStr = typeof fichaData['ficha_3'] === 'object' 
      ? (fichaData['ficha_3'].answer || fichaData['ficha_3'].label || ' ') 
      : String(fichaData['ficha_3']);
  }
  if (typeof birthYearStr === 'string' && birthYearStr.includes('-')) {
    birthYearStr = birthYearStr.split('-')[0];
  }
  const birthYear = parseInt(birthYearStr);
  const currentYear = new Date().getFullYear();
  const age = !isNaN(birthYear) ? (currentYear - birthYear).toString() : ' ';

  // Map gender
  let rawSexo = ' ';
  if (fichaData?.['ficha_2']) {
    rawSexo = typeof fichaData['ficha_2'] === 'object'
      ? (fichaData['ficha_2'].answer || fichaData['ficha_2'].label || ' ')
      : String(fichaData['ficha_2']);
  }
  const sexMap: Record<string, string> = { '1': 'Masculino', '2': 'Femenino', '3': 'No Binario' };
  const sexo = sexMap[rawSexo] || rawSexo || ' ';
  
  const trabajadorData: [string, string][] = [
    ['Nombre del trabajador:', participantData.surveyResponse?.consentName || ' '],
    ['Número de identificación (ID):', participantData.cedula || ' '],
    ['Cargo:', cargo],
    ['Departamento o sección:', depto],
    ['Edad:', age],
    ['Sexo:', sexo],
    ['Fecha de aplicación del cuestionario:', createdAt ? new Date(createdAt).toLocaleDateString() : ' '],
    ['Nombre de la empresa:', empresaName],
  ];

  const evaluadorData: [string, string][] = [
    ['Nombre del evaluador:', evaluador.evaluadorNombre || ' '],
    ['Número de identificación (c.c.):', evaluador.evaluadorId || ' '],
    ['Profesión:', evaluador.evaluadorProfesion || ' '],
    ['Postgrado:', evaluador.evaluadorPostgrado || ' '],
    ['No. Tarjeta Profesional:', evaluador.evaluadorTarjeta || ' '],
    ['No. Licencia en Salud Ocupacional:', evaluador.evaluadorLicencia || ' '],
    ['Fecha de expedición de la licencia en S.O.:', evaluador.evaluadorLicenciaFecha || ' '],
  ];

  // Build the table rows directly from the raw results structure
  let tableRows: TableRowData[] = [];
  let interpretations: string[] = [];

  if (type === 'intralaboral') {
    tableRows = buildIntralaboralRows(results, formType || 'A');
    interpretations = INTRALABORAL_INTERPRETATIONS;
  } else if (type === 'extralaboral') {
    tableRows = buildExtralaboralRows(results);
    interpretations = INTRALABORAL_INTERPRETATIONS;
  } else if (type === 'estres') {
    tableRows = buildEstresRows(results);
    interpretations = ESTRES_INTERPRETATIONS;
  }

  return (
    <Document>
      <Page size="LETTER" style={styles.page} wrap>
        <Text style={styles.header}>{title}</Text>
        
        <InfoTable title="DATOS GENERALES DEL TRABAJADOR" data={trabajadorData} />
        <InfoTable title="DATOS DEL EVALUADOR" data={evaluadorData} />
      </Page>

      <Page size="LETTER" style={styles.page} wrap>
        <Text style={styles.header}>{title} (Continuación)</Text>
        
        <View>
            <Text style={styles.sectionTitle}>RESULTADOS DEL CUESTIONARIO</Text>
            
            <View style={styles.table}>
            {/* Header row */}
            <View style={[styles.tableRow, { minHeight: 25 }]} wrap={false}>
                <View style={[styles.tableColHeader, { width: '30%' }]}><Text>Dominio</Text></View>
                <View style={[styles.tableColHeader, { width: '40%' }]}><Text>Dimensiones</Text></View>
                <View style={[styles.tableColHeader, { width: '15%' }]}><Text>Puntaje</Text></View>
                <View style={[styles.tableColHeader, { width: '15%' }]}><Text>Nivel de riesgo</Text></View>
            </View>

            {tableRows.map((row, idx) => {
                if (row.isDomain || row.isTotal) {
                    return (
                        <View style={[styles.tableRow, { minHeight: 25, backgroundColor: '#f9fafb' }]} key={idx} wrap={false}>
                            <View style={[styles.tableCol, { width: '70%' }]}>
                                <Text style={styles.tableCellBold}>{row.domain}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '15%', textAlign: 'center' }]}>
                                <Text style={styles.tableCellBold}>{row.score}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '15%', textAlign: 'center' }]}>
                                <Text style={styles.tableCellBold}>{row.level}</Text>
                            </View>
                        </View>
                    );
                }

                return (
                    <View style={[styles.tableRow, { minHeight: 25 }]} key={idx} wrap={false}>
                        <View style={[styles.tableCol, { width: '30%', backgroundColor: row.domain ? '#f9fafb' : '#fff' }]}>
                            <Text style={row.domain ? styles.tableCellBold : styles.tableCell}>{row.domain}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '40%' }]}>
                            <Text style={styles.tableCell}>{row.dimension}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%', textAlign: 'center' }]}>
                            <Text style={styles.tableCell}>{row.score}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%', textAlign: 'center' }]}>
                            <Text style={styles.tableCell}>{row.level}</Text>
                        </View>
                    </View>
                );
            })}
            </View>
        </View>

        <View wrap={false}>
            <Text style={styles.interpretacionTitle}>INTERPRETACIÓN GENÉRICA DE LOS NIVELES DE {type === 'estres' ? 'ESTRÉS' : 'RIESGO'}</Text>
            {interpretations.map((text, idx) => (
                <Text key={idx} style={styles.interpretacionText}>{text}</Text>
            ))}
        </View>

        <View wrap={false} style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>OBSERVACIONES Y COMENTARIOS DEL EVALUADOR</Text>
            <View style={styles.observacionesBox}><Text> </Text></View>
            
            <Text style={styles.sectionTitle}>RECOMENDACIONES PARTICULARES</Text>
            <View style={styles.observacionesBox}><Text> </Text></View>

            <View style={{ marginTop: 20 }}>
                <Text style={styles.tableCellBold}>Fecha de elaboración del informe: ______________________</Text>
                
                {evaluador?.evaluadorFirma ? (
                  <PdfImage style={styles.signatureImage} src={evaluador.evaluadorFirma} />
                ) : null}
                <Text style={styles.signatureLine}>Firma del evaluador</Text>
            </View>
        </View>

      </Page>
    </Document>
  );
};

export async function generateResultsReportPDF(
  participantData: any,
  type: 'intralaboral' | 'extralaboral' | 'estres'
): Promise<Uint8Array> {
  const formType = participantData.surveyResponse?.formType || 'A';
  
  let title = '';
  if (type === 'intralaboral') {
      title = `INFORME DE RESULTADOS DEL CUESTIONARIO DE FACTORES DE RIESGO PSICOSOCIAL INTRALABORAL - FORMA ${formType}`;
  } else if (type === 'extralaboral') {
      title = 'INFORME DE RESULTADOS DEL CUESTIONARIO DE FACTORES DE RIESGO PSICOSOCIAL EXTRALABORAL';
  } else if (type === 'estres') {
      title = 'INFORME DE RESULTADOS DEL CUESTIONARIO DE FACTORES DE RIESGO SÍNTOMAS DE ESTRÉS';
  }

  // Use the raw detailed results directly from processSurvey output
  // Detect the format: detailed has 'intralaboral' key, flattened does not
  let rawResults = participantData.surveyResponse?.results || {};
  
  // If results are in the old flattened format (no intralaboral key), 
  // recalculate from raw answers stored in the DB
  const isDetailedFormat = rawResults.intralaboral || rawResults.extralaboral || rawResults.estres;
  if (!isDetailedFormat) {
    const sr = participantData.surveyResponse;
    if (sr?.intralaboralData || sr?.extralaboralData || sr?.estresData) {
      rawResults = processSurvey(
        (sr.formType as 'A' | 'B') || 'A',
        (sr.intralaboralData as Record<string, any>) || {},
        (sr.extralaboralData as Record<string, any>) || {},
        (sr.estresData as Record<string, any>) || {}
      );
    }
  }

  const stream = await renderToStream(
      <ResultsDocument 
          type={type} 
          title={title} 
          participantData={participantData} 
          results={rawResults}
          formType={formType}
      />
  );
  
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(new Uint8Array(Buffer.concat(chunks))));
  });
}
