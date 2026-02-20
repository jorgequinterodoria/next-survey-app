// ============================================================
// TEMPLATE PROCESSOR
// Reads the original .docx template, preserves ALL formatting
// (headers, footers, styles, highlights, static text) and
// injects dynamic content: company name, charts, risk tables.
//
// npm install jszip
// Template path: src/templates/informe_psicosocial.docx
// ============================================================

import JSZip from 'jszip';
import path from 'path';
import fs from 'fs';
import type { ReportData, RiskTableRow, MatrizIntervencion, PVERow } from './types';
import type { ReportCharts } from './chartGenerator';

// ─── EMU dimensions (1 inch = 914400 EMU, 1 twip = 635 EMU) ─────────────────
const EMU_FULL = 5_943_600;  // ~6.5 inches — full table width
const EMU_HALF = 2_895_600;  // ~3.17 inches — half table (side-by-side charts)
const EMU_H_FULL = 3_200_000; // chart height full
const EMU_H_HALF = 2_743_200; // chart height half

// Risk level → background fill color
const RISK_BG: Record<string, string> = {
  'Sin riesgo o riesgo despreciable': 'C6EFCE',
  'Riesgo bajo': 'EBFFB0',
  'Riesgo medio': 'FFFF99',
  'Riesgo alto': 'FFD580',
  'Riesgo muy alto': 'FF8080',
};

// ─── Chart cell mapping ────────────────────────────────────────────────────────
// marker = text inside the template chart placeholder cell
type ChartKey = keyof ReportCharts;

const CHART_MAP: Array<{ marker: string; key: ChartKey; cx: number; cy: number }> = [
  { marker: 'Gráfico 1: Genero', key: 'sexo', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 2: Promedio de edad', key: 'rangoEdad', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 3: Nivel de estudios', key: 'nivelEstudios', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 4: Tipo de vivienda', key: 'tipoVivienda', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 5: Estado civil', key: 'estadoCivil', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 6: Nivel socioeconómico', key: 'estrato', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 7: Personas a cargo', key: 'personasACargo', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 8: Antigüedad en la empresa', key: 'aniosEmpresa', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 9: antigüedad en el cargo', key: 'aniosCargo', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 10: Niveles jerárquicos', key: 'tipoCargo', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 11: Tipo de contrato', key: 'tipoContrato', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 12: Tipo de salario', key: 'tipoSalario', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 13: Ocupación u oficio', key: 'ocupacion', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 14: Horas de trabajo al día', key: 'horasDiarias', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 15: Ciudad de residencia', key: 'ciudadResidencia', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 16: Departamento de residencia', key: 'deptResidencia', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 17: Ciudad donde trabaja actualmente', key: 'ciudadTrabajo', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 18: Departamentos donde trabaja actualmente', key: 'deptTrabajo', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 19: Factores intralaborales Forma A', key: 'intralaboralFormaA', cx: EMU_HALF, cy: EMU_H_HALF },
  { marker: 'Gráfico 20: Factores intralaborales', key: 'intralaboralFormaB', cx: EMU_HALF, cy: EMU_H_HALF },
  { marker: 'Gráfico 21: Factores extralaborales forma A', key: 'extralaboralFormaA', cx: EMU_HALF, cy: EMU_H_HALF },
  { marker: 'Gráfico 22: Factores extralaborales forma B', key: 'extralaboralFormaB', cx: EMU_HALF, cy: EMU_H_HALF },
  { marker: 'Gráfico 23: Estrés TOTAL GENERAL', key: 'estresGeneral', cx: EMU_HALF, cy: EMU_H_HALF },
  { marker: 'Gráfico 24: Principales síntomas del estrés', key: 'estresGeneralSintomas', cx: EMU_HALF, cy: EMU_H_HALF },
  { marker: 'Gráfico 25: Estrés forma A', key: 'estresFormaA', cx: EMU_HALF, cy: EMU_H_HALF },
  { marker: 'Gráfico 26: Principales síntomas del estrés. Forma A', key: 'estresFormaASintomas', cx: EMU_HALF, cy: EMU_H_HALF },
  { marker: 'Gráfico 27: Estrés forma B', key: 'estresFormaB', cx: EMU_HALF, cy: EMU_H_HALF },
  { marker: 'Gráfico 28: Principales síntomas de estrés. Forma B', key: 'estresFormaBSintomas', cx: EMU_HALF, cy: EMU_H_HALF },
  { marker: 'Gráfico 29: Factores - Total general', key: 'generalFactores', cx: EMU_FULL, cy: EMU_H_FULL },
  { marker: 'Gráfico 30: Factores - Forma A', key: 'generalFormaA', cx: EMU_HALF, cy: EMU_H_HALF },
  { marker: 'Gráfico 31: Factores forma B', key: 'generalFormaB', cx: EMU_HALF, cy: EMU_H_HALF },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function x(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function pct(n: number): string {
  return (n * 100).toFixed(1) + '%';
}

let imgIdCounter = 200;
function nextId() { return ++imgIdCounter; }

// ─── Build inline image XML ───────────────────────────────────────────────────

function inlineImageXml(rId: string, cx: number, cy: number, name: string): string {
  const id1 = nextId(); const id2 = nextId();
  return `<w:r><w:rPr/><w:drawing>` +
    `<wp:inline distT="0" distB="0" distL="0" distR="0"` +
    ` xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">` +
    `<wp:extent cx="${cx}" cy="${cy}"/>` +
    `<wp:effectExtent l="0" t="0" r="0" b="0"/>` +
    `<wp:docPr id="${id1}" name="${x(name)}"/>` +
    `<wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr>` +
    `<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">` +
    `<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">` +
    `<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">` +
    `<pic:nvPicPr><pic:cNvPr id="${id2}" name="${x(name)}"/><pic:cNvPicPr><a:picLocks noChangeAspect="1"/></pic:cNvPicPr></pic:nvPicPr>` +
    `<pic:blipFill><a:blip r:embed="${rId}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>` +
    `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>` +
    `</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
}

// ─── Build risk table XML ──────────────────────────────────────────────────────

function riskTableXml(rows: RiskTableRow[]): string {
  const W = `xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"`;

  const hcell = (t: string) =>
    `<w:tc><w:tcPr><w:tcBorders><w:top w:val="single" w:sz="4" w:color="auto"/><w:left w:val="single" w:sz="4" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:color="auto"/><w:right w:val="single" w:sz="4" w:color="auto"/></w:tcBorders><w:shd w:val="clear" w:color="auto" w:fill="003F88"/><w:vAlign w:val="center"/></w:tcPr>` +
    `<w:p><w:pPr><w:jc w:val="center"/><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="16"/></w:rPr></w:pPr>` +
    `<w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="16"/></w:rPr><w:t>${x(t)}</w:t></w:r></w:p></w:tc>`;

  const dcell = (t: string, fill?: string) =>
    `<w:tc><w:tcPr><w:tcBorders><w:top w:val="single" w:sz="4" w:color="auto"/><w:left w:val="single" w:sz="4" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:color="auto"/><w:right w:val="single" w:sz="4" w:color="auto"/></w:tcBorders>` +
    (fill ? `<w:shd w:val="clear" w:color="auto" w:fill="${fill}"/>` : '') +
    `<w:vAlign w:val="center"/></w:tcPr>` +
    `<w:p><w:pPr><w:jc w:val="center"/><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/><w:sz w:val="16"/></w:rPr></w:pPr>` +
    `<w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/><w:sz w:val="16"/></w:rPr><w:t>${x(t)}</w:t></w:r></w:p></w:tc>`;

  const fcell = (t: string) =>
    `<w:tc><w:tcPr><w:tcW w:w="2600" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:color="auto"/><w:left w:val="single" w:sz="4" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:color="auto"/><w:right w:val="single" w:sz="4" w:color="auto"/></w:tcBorders><w:vAlign w:val="center"/></w:tcPr>` +
    `<w:p><w:pPr><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/><w:sz w:val="16"/></w:rPr></w:pPr>` +
    `<w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/><w:sz w:val="16"/></w:rPr><w:t>${x(t)}</w:t></w:r></w:p></w:tc>`;

  const headerRow = `<w:tr><w:trPr><w:tblHeader/><w:trHeight w:val="400"/></w:trPr>` +
    `<w:tc><w:tcPr><w:tcW w:w="2600" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:color="auto"/><w:left w:val="single" w:sz="4" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:color="auto"/><w:right w:val="single" w:sz="4" w:color="auto"/></w:tcBorders><w:shd w:val="clear" w:color="auto" w:fill="003F88"/><w:vAlign w:val="center"/></w:tcPr>` +
    `<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="16"/></w:rPr><w:t>Factor</w:t></w:r></w:p></w:tc>` +
    hcell('Sin Riesgo') + hcell('%') + hcell('R. Bajo') + hcell('%') +
    hcell('R. Medio') + hcell('%') + hcell('R. Alto') + hcell('%') +
    hcell('R. Muy Alto') + hcell('%') + hcell('Total') + `</w:tr>`;

  const dataRows = rows.map(r => {
    const altoFill = (r.alto.pct + r.muyAlto.pct) >= 0.3 ? 'FFD580' : undefined;
    const muyAltoFill = r.muyAlto.pct >= 0.2 ? 'FF8080' : undefined;
    return `<w:tr><w:trPr><w:trHeight w:val="350"/></w:trPr>` +
      fcell(r.factor) +
      dcell(String(r.sinRiesgo.count), 'C6EFCE') + dcell(pct(r.sinRiesgo.pct), 'C6EFCE') +
      dcell(String(r.bajo.count), 'EBFFB0') + dcell(pct(r.bajo.pct), 'EBFFB0') +
      dcell(String(r.medio.count), 'FFFF99') + dcell(pct(r.medio.pct), 'FFFF99') +
      dcell(String(r.alto.count), altoFill) + dcell(pct(r.alto.pct), altoFill) +
      dcell(String(r.muyAlto.count), muyAltoFill) + dcell(pct(r.muyAlto.pct), muyAltoFill) +
      dcell(String(r.total)) + `</w:tr>`;
  }).join('');

  return `<w:tbl ${W}>` +
    `<w:tblPr><w:tblW w:w="9351" w:type="dxa"/><w:jc w:val="center"/>` +
    `<w:tblBorders><w:top w:val="single" w:sz="4" w:color="auto"/><w:left w:val="single" w:sz="4" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:color="auto"/><w:right w:val="single" w:sz="4" w:color="auto"/><w:insideH w:val="single" w:sz="4" w:color="auto"/><w:insideV w:val="single" w:sz="4" w:color="auto"/></w:tblBorders>` +
    `<w:tblStyle w:val="TablaconestilodeTablaconestil0"/></w:tblPr>` +
    headerRow + dataRows + `</w:tbl>`;
}

// ─── Build matriz table XML ────────────────────────────────────────────────────

function matrizTableXml(rows: MatrizIntervencion[]): string {
  const W = `xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"`;
  const hcell = (t: string, w = '0') =>
    `<w:tc><w:tcPr>${w !== '0' ? `<w:tcW w:w="${w}" w:type="dxa"/>` : ''}<w:shd w:val="clear" w:color="auto" w:fill="003F88"/><w:vAlign w:val="center"/></w:tcPr>` +
    `<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="16"/></w:rPr><w:t>${x(t)}</w:t></w:r></w:p></w:tc>`;

  const headerRow = `<w:tr><w:trPr><w:tblHeader/></w:trPr>${hcell('Factor / Dimensión', '3000')}${hcell('Nivel de Riesgo', '2000')}${hcell('Acciones Recomendadas', '4351')}</w:tr>`;

  const border = `<w:tcBorders><w:top w:val="single" w:sz="4" w:color="auto"/><w:left w:val="single" w:sz="4" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:color="auto"/><w:right w:val="single" w:sz="4" w:color="auto"/></w:tcBorders>`;

  const dataRows = rows.map(r => {
    const fill = RISK_BG[r.nivelRiesgo] || 'FFFFFF';
    return `<w:tr>` +
      `<w:tc><w:tcPr><w:tcW w:w="3000" w:type="dxa"/>${border}</w:tcPr><w:p><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>${x(r.factor)}</w:t></w:r></w:p></w:tc>` +
      `<w:tc><w:tcPr><w:tcW w:w="2000" w:type="dxa"/>${border}<w:shd w:val="clear" w:color="auto" w:fill="${fill}"/><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>${x(r.nivelRiesgo)}</w:t></w:r></w:p></w:tc>` +
      `<w:tc><w:tcPr><w:tcW w:w="4351" w:type="dxa"/>${border}</w:tcPr><w:p><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>${x(r.acciones)}</w:t></w:r></w:p></w:tc>` +
      `</w:tr>`;
  }).join('');

  return `<w:tbl ${W}><w:tblPr><w:tblW w:w="9351" w:type="dxa"/><w:jc w:val="center"/><w:tblBorders><w:top w:val="single" w:sz="4" w:color="auto"/><w:left w:val="single" w:sz="4" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:color="auto"/><w:right w:val="single" w:sz="4" w:color="auto"/><w:insideH w:val="single" w:sz="4" w:color="auto"/><w:insideV w:val="single" w:sz="4" w:color="auto"/></w:tblBorders></w:tblPr>${headerRow}${dataRows}</w:tbl>`;
}

// ─── Build PVE table rows ──────────────────────────────────────────────────────

function buildPveTable(rows: PVERow[]): string {
  const W = `xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"`;
  const border = `<w:tcBorders><w:top w:val="single" w:sz="4" w:color="auto"/><w:left w:val="single" w:sz="4" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:color="auto"/><w:right w:val="single" w:sz="4" w:color="auto"/></w:tcBorders>`;

  const headerRow =
    `<w:tr><w:trPr><w:tblHeader/><w:shd w:val="clear" w:color="auto" w:fill="FFC000"/></w:trPr>` +
    ['Resultados de la evaluación', '%', 'Criterio para ingreso al PVE – FRP', '¿Requieren ingresar al PVE?'].map(t =>
      `<w:tc><w:tcPr>${border}<w:shd w:val="clear" w:color="auto" w:fill="FFC000"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="16"/></w:rPr><w:t>${x(t)}</w:t></w:r></w:p></w:tc>`
    ).join('') + `</w:tr>`;

  const dataRows = rows.map(r => {
    const shade = r.requiereIngreso === 'Sí' ? 'FFE0E0' : 'E0FFE0';
    const color = r.requiereIngreso === 'Sí' ? 'CC0000' : '006600';
    return `<w:tr>` +
      `<w:tc><w:tcPr>${border}</w:tcPr><w:p><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>${x(r.evaluacion)}</w:t></w:r></w:p></w:tc>` +
      `<w:tc><w:tcPr>${border}<w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>${x(r.porcentaje)}</w:t></w:r></w:p></w:tc>` +
      `<w:tc><w:tcPr>${border}</w:tcPr><w:p><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>${x(r.criterio)}</w:t></w:r></w:p></w:tc>` +
      `<w:tc><w:tcPr>${border}<w:shd w:val="clear" w:color="auto" w:fill="${shade}"/><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="${color}"/><w:sz w:val="16"/></w:rPr><w:t>${x(r.requiereIngreso)}</w:t></w:r></w:p></w:tc>` +
      `</w:tr>`;
  }).join('');

  return `<w:tbl ${W}><w:tblPr><w:tblW w:w="9351" w:type="dxa"/><w:jc w:val="center"/><w:tblBorders><w:top w:val="single" w:sz="4" w:color="auto"/><w:left w:val="single" w:sz="4" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:color="auto"/><w:right w:val="single" w:sz="4" w:color="auto"/><w:insideH w:val="single" w:sz="4" w:color="auto"/><w:insideV w:val="single" w:sz="4" w:color="auto"/></w:tblBorders></w:tblPr>${headerRow}${dataRows}</w:tbl>`;
}

// ─── XML-aware paragraph finder ───────────────────────────────────────────────
// Word splits text across multiple <w:r><w:t> runs (e.g., "Gráfico" + " " + "1" + ": Genero").
// A simple indexOf('Gráfico 1: Genero') will NEVER find this.
// This function iterates over <w:p> elements, reconstructs their text, and returns
// the start/end offsets of the matching paragraph.

interface ParagraphMatch {
  pStart: number; // index of <w:p in the doc string
  pEnd: number;   // index right after </w:p>
}

function findParagraphByText(doc: string, targetText: string, skipHidden = true): ParagraphMatch | null {
  const pOpenTag = '<w:p';
  const pCloseTag = '</w:p>';
  const tRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;

  let searchFrom = 0;
  while (searchFrom < doc.length) {
    const pStart = doc.indexOf(pOpenTag, searchFrom);
    if (pStart === -1) break;

    const pEnd = doc.indexOf(pCloseTag, pStart);
    if (pEnd === -1) break;
    const pEndFull = pEnd + pCloseTag.length;

    const paraXml = doc.slice(pStart, pEndFull);

    // Skip paragraphs that are inside TOC / webHidden fields
    if (skipHidden && paraXml.includes('webHidden')) {
      searchFrom = pEndFull;
      continue;
    }

    // Reconstruct text from all <w:t> tags in this paragraph
    let fullText = '';
    let match;
    tRegex.lastIndex = 0;
    while ((match = tRegex.exec(paraXml)) !== null) {
      fullText += match[1];
    }

    if (fullText.includes(targetText)) {
      return { pStart, pEnd: pEndFull };
    }

    searchFrom = pEndFull;
  }

  return null;
}

// ─── Find and insert a table after a caption paragraph ────────────────────────

function insertTableAfterCaption(doc: string, captionText: string, tableXml: string): string {
  const match = findParagraphByText(doc, captionText);
  if (!match) {
    console.warn(`[templateProcessor] table caption NOT FOUND: "${captionText}"`);
    return doc;
  }
  console.log(`[templateProcessor] ✓ inserted table after: "${captionText}"`);
  return doc.slice(0, match.pEnd) + '\n' + tableXml + '\n' + doc.slice(match.pEnd);
}

// ─── Replace existing table that contains a unique marker string ──────────────

function replaceTableContaining(doc: string, marker: string, newTableXml: string): string {
  const idx = doc.indexOf(marker);
  if (idx === -1) return doc;
  const tblStart = doc.lastIndexOf('<w:tbl>', idx);
  if (tblStart === -1) return doc;
  const tblEnd = doc.indexOf('</w:tbl>', idx) + '</w:tbl>'.length;
  if (tblEnd <= 0) return doc;
  return doc.slice(0, tblStart) + newTableXml + doc.slice(tblEnd);
}

// ─── Inject image into table cell that contains a marker ─────────────────────

function injectImageIntoCell(
  doc: string,
  marker: string,
  rId: string,
  cx: number,
  cy: number,
  name: string
): string {
  // Find the <w:tc> containing the marker
  const idx = doc.indexOf(marker);
  if (idx === -1) return doc;

  const tcStart = doc.lastIndexOf('<w:tc>', idx);
  const tcEnd = doc.indexOf('</w:tc>', idx) + '</w:tc>'.length;
  if (tcStart === -1 || tcEnd <= 0) return doc;

  const origCell = doc.slice(tcStart, tcEnd);

  // Keep tcPr, replace all paragraphs with one containing the image
  const tcPrMatch = origCell.match(/(<w:tcPr>[\s\S]*?<\/w:tcPr>)/);
  const tcPr = tcPrMatch ? tcPrMatch[1] : '';

  const newCell =
    `<w:tc>${tcPr}` +
    `<w:p><w:pPr><w:jc w:val="center"/><w:rPr/></w:pPr>${inlineImageXml(rId, cx, cy, name)}</w:p>` +
    `</w:tc>`;

  return doc.slice(0, tcStart) + newCell + doc.slice(tcEnd);
}

// ─── Replace paragraph (or cell) containing marker with an image ─────────────

function replaceParagraphWithImage(
  doc: string,
  marker: string,
  rId: string,
  cx: number,
  cy: number,
  name: string
): string {
  const match = findParagraphByText(doc, marker);
  if (!match) {
    console.warn(`[templateProcessor] chart marker NOT FOUND: "${marker}"`);
    return doc;
  }

  // Check if the matched paragraph is inside a <w:tc> (table cell)
  const tcStart = doc.lastIndexOf('<w:tc>', match.pStart);
  const tcClose = doc.lastIndexOf('</w:tc>', match.pStart);
  if (tcStart !== -1 && (tcClose === -1 || tcStart > tcClose)) {
    // Inside a cell — replace the cell content
    const tcEnd = doc.indexOf('</w:tc>', match.pStart) + '</w:tc>'.length;
    const origCell = doc.slice(tcStart, tcEnd);
    const tcPrMatch = origCell.match(/(<w:tcPr>[\s\S]*?<\/w:tcPr>)/);
    const tcPr = tcPrMatch ? tcPrMatch[1] : '';
    const newCell =
      `<w:tc>${tcPr}` +
      `<w:p><w:pPr><w:jc w:val="center"/><w:rPr/></w:pPr>${inlineImageXml(rId, cx, cy, name)}</w:p>` +
      `</w:tc>`;
    console.log(`[templateProcessor] ✓ injected chart (cell) for: "${marker}"`);
    return doc.slice(0, tcStart) + newCell + doc.slice(tcEnd);
  }

  // Standalone paragraph — replace it entirely with an image paragraph
  const imgParagraph =
    '<w:p><w:pPr><w:jc w:val="center"/><w:rPr/></w:pPr>' +
    inlineImageXml(rId, cx, cy, name) +
    '</w:p>';

  console.log(`[templateProcessor] ✓ injected chart (paragraph) for: "${marker}"`);
  return doc.slice(0, match.pStart) + imgParagraph + doc.slice(match.pEnd);
}

// ─── Replace text in paragraph (handles split runs) ──────────────────────────

function replaceText(doc: string, oldText: string, newText: string): string {
  // Simple string replacement in <w:t> content — also handles split runs
  // First try direct replacement
  doc = doc.replace(new RegExp(oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), x(newText));
  return doc;
}

// ─── Add relationship ─────────────────────────────────────────────────────────

function addRel(rels: string, rId: string, target: string): string {
  const newRel = `<Relationship Id="${rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${target}"/>`;
  return rels.replace('</Relationships>', newRel + '</Relationships>');
}

// ─── Build conclusion text ─────────────────────────────────────────────────────

function buildConclusionText(data: ReportData): Record<string, string> {
  const dem = data.demographics;
  const fem = dem.sexo.find(s => /femen/i.test(s.label));
  const masc = dem.sexo.find(s => /mascul/i.test(s.label));
  const topEdu = dem.nivelEstudios.slice(0, 2).map(e => `${e.label} (${(e.percentage * 100).toFixed(0)}%)`).join(' y ');
  const topContrato = dem.tipoContrato[0];
  const topHoras = dem.horasDiarias[0];

  return {
    'Conclusiones sexo y distribución geográfica.':
      fem && masc
        ? `La población evaluada está conformada por ${(fem.percentage * 100).toFixed(1)}% de mujeres y ${(masc.percentage * 100).toFixed(1)}% de hombres. Total evaluados: ${dem.totalParticipants} trabajadores.`
        : `Total de trabajadores evaluados: ${dem.totalParticipants}.`,

    'Conclusiones nivel de escolaridad y ocupaciones.':
      `Los niveles de escolaridad más frecuentes son: ${topEdu}.`,

    'Conclusiones tipo de contrato y horas de la jornada laboral.':
      `El tipo de contrato predominante es "${topContrato?.label || 'N/A'}" (${((topContrato?.percentage || 0) * 100).toFixed(0)}%). Las horas diarias más reportadas: ${topHoras?.label || 'N/A'}.`,

    'Conclusiones Forma A.':
      data.dimensionesPriorizadasA.length > 0
        ? `Las dimensiones intralaborales priorizadas (Forma A) son: ${data.dimensionesPriorizadasA.join(', ')}.`
        : 'No se identificaron dimensiones de alto riesgo prioritarias en Forma A.',

    'Conclusiones Forma B.':
      data.dimensionesPriorizadasB.length > 0
        ? `Las dimensiones intralaborales priorizadas (Forma B) son: ${data.dimensionesPriorizadasB.join(', ')}.`
        : 'No se identificaron dimensiones de alto riesgo prioritarias en Forma B.',

    'Conclusiones dominios.':
      'Los dominios con mayor nivel de riesgo se priorizan para intervención organizacional conforme a los resultados obtenidos.',

    'Conclusiones intralaborales.':
      `El análisis intralaboral incluyó ${dem.formaA + dem.formaB} trabajadores: Forma A (${dem.formaA}) y Forma B (${dem.formaB}).`,

    'Conclusiones intralaborales áreas y cargos.':
      'Se recomienda revisar los factores de riesgo prioritarios por área y cargo para focalizar las intervenciones.',

    'Conclusiones extralaborales áreas y cargos.':
      data.dimensionesExtralaboralesPriorizadas.length > 0
        ? `Las dimensiones extralaborales priorizadas son: ${data.dimensionesExtralaboralesPriorizadas.join(', ')}.`
        : 'No se identificaron dimensiones extralaborales de riesgo alto prioritarias.',
  };
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export async function processTemplate(
  data: ReportData,
  charts: ReportCharts
): Promise<Buffer> {

  // 1. Load the original template file
  const templatePath = path.join(process.cwd(), 'src', 'templates', 'informe_psicosocial.docx');
  const templateBuffer = fs.readFileSync(templatePath);
  const zip = await JSZip.loadAsync(templateBuffer);

  // 2. Extract XML files
  let doc = await zip.file('word/document.xml')!.async('string');
  let rels = await zip.file('word/_rels/document.xml.rels')!.async('string');
  let h1 = await zip.file('word/header1.xml')!.async('string');
  let h2 = await zip.file('word/header2.xml')!.async('string');

  const empresa = data.empresaNombre;
  const dem = data.demographics;
  const today = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  // ── A. Text replacements ─────────────────────────────────────────────────────

  // Company name (all variants in document)
  for (const variant of ['Nombre de la empresa cliente', 'NOMBRE DE LA EMPRESA CLIENTE', 'NOMBRE DE LA EMPRESA', 'Nombre de la empresa']) {
    doc = doc.split(variant).join(x(empresa));
    h1 = h1.split(variant).join(x(empresa));
    h2 = h2.split(variant).join(x(empresa));
  }
  doc = doc.split('Logo empresa cliente').join(x(empresa));
  h1 = h1.split('Logo empresa cliente').join(x(empresa));
  h2 = h2.split('Logo empresa cliente').join(x(empresa));

  // NIT
  if (data.empresaNit) {
    doc = doc.replace(/>Nit\.<\/w:t>/, `>${x(data.empresaNit)}</w:t>`);
  }

  // Date
  doc = doc.split('Montería, fecha').join(x(data.fechaInforme));
  doc = doc.replace(/>fecha\s*<\/w:t>/, `>${x(today)}</w:t>`);
  doc = doc.split('26/08/2023').join(today);
  doc = doc.split('30/08/2023').join(today);

  // Total participants
  doc = doc.split('133 colaboradores').join(`${dem.totalParticipants} colaboradores`);
  doc = doc.replace(/Forma A: 13 [Yy] Forma B: 120/g, `Forma A: ${dem.formaA} y Forma B: ${dem.formaB}`);

  // Conclusions (replace placeholder text with real conclusions)
  const conclusions = buildConclusionText(data);
  for (const [placeholder, value] of Object.entries(conclusions)) {
    const idx = doc.indexOf(placeholder);
    if (idx !== -1) {
      // Find enclosing <w:t> tag and replace its content
      const tStart = doc.lastIndexOf('<w:t', idx);
      const tEnd = doc.indexOf('</w:t>', idx) + '</w:t>'.length;
      if (tStart !== -1 && tEnd > 0) {
        const tagOpen = doc.slice(tStart, doc.indexOf('>', tStart) + 1);
        doc = doc.slice(0, tStart) + tagOpen + x(value) + '</w:t>' + doc.slice(tEnd);
      }
    }
  }

  // ── B. Insert risk data tables after their caption paragraphs ────────────────

  // Deduplicated rows (Forma A + B merged)
  const dedup = (rows: RiskTableRow[]): RiskTableRow[] =>
    rows.filter((r, i, arr) => arr.findIndex(a => a.factor === r.factor) === i);

  const tableInserts: Array<[string, string]> = [
    ['Tabla 14: Análisis intralaboral',
      riskTableXml(dedup([...data.intralaboralFormaA, ...data.intralaboralFormaB]))],
    ['Tabla 15: Análisis intralaboral por dominios',
      riskTableXml(dedup([...data.dominiosFormaA, ...data.dominiosFormaB]))],
    ['Tabla 16: Análisis extralaboral por dimensiones',
      riskTableXml(dedup([...data.extralaboralFormaA, ...data.extralaboralFormaB]))],
    ['Tabla 17: análisis de la empresa a nivel general',
      riskTableXml(dedup(data.generalRisk as RiskTableRow[]))],
    ['Tabla 18: Matriz de dimensiones',
      matrizTableXml(data.matrizIntralaboral)],
    ['Tabla 19: Matriz de intervención extralaboral',
      matrizTableXml(data.matrizExtralaboral)],
  ];

  for (const [caption, tableXml] of tableInserts) {
    doc = insertTableAfterCaption(doc, caption, tableXml);
  }

  // ── C. Replace the PVE table (already in template, replace it entirely) ──────

  doc = replaceTableContaining(doc, 'Resultados de la evaluaci', buildPveTable(data.pveRows));

  // ── D. Inject chart images into placeholder cells ────────────────────────────

  let rIdN = 100;
  for (const entry of CHART_MAP) {
    const buf = charts[entry.key] as Buffer | undefined;
    if (!buf) continue;

    const rId = `rIdImg${rIdN++}`;
    const filename = `chart_${rId}.png`;

    // Add PNG to zip
    zip.file(`word/media/${filename}`, buf);

    // Add relationship
    rels = addRel(rels, rId, `media/${filename}`);

    // Inject image replacing the placeholder paragraph (or cell)
    doc = replaceParagraphWithImage(doc, entry.marker, rId, entry.cx, entry.cy, entry.marker);
  }

  // ── E. Write back all modified files ─────────────────────────────────────────

  zip.file('word/document.xml', doc);
  zip.file('word/_rels/document.xml.rels', rels);
  zip.file('word/header1.xml', h1);
  zip.file('word/header2.xml', h2);

  // ── F. Generate output buffer ─────────────────────────────────────────────────

  return zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}
