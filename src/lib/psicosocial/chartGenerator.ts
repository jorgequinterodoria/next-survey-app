// ============================================================
// CHART GENERATOR - SVG charts → PNG Buffer (uses `sharp`)
// Install: npm install sharp
// ============================================================
import fs from 'fs';
import path from 'path';
import type { FrequencyItem, RiskTableRow } from './types';

// ─── Color Palette ───────────────────────────────────────────────────────────

const RISK_COLORS: Record<string, string> = {
  'Sin riesgo o riesgo despreciable': '#1a9641',
  'Riesgo bajo': '#a6d96a',
  'Riesgo medio': '#ffffbf',
  'Riesgo alto': '#fdae61',
  'Riesgo muy alto': '#d73027',
};

// Excel-like colors for demographic bars
const DEMOGRAPHIC_COLORS = [
  '#e6399b', // Magenta/Pink
  '#5cb8e6', // Light Blue
  '#3d6cb8', // Darker Blue
  '#9966cc', // Purple
  '#e65c73', // Reddish
  '#003f88', // Deep Blue
  '#1a9641', // Green
  '#fdae61', // Orange
];

const CHART_COLORS = [
  '#003f88', '#0077b6', '#00b4d8', '#48cae4', '#90e0ef',
  '#1a9641', '#a6d96a', '#fdae61', '#d73027', '#7b2d8b',
];

// ─── SVG Pie Chart ────────────────────────────────────────────────────────────

export function buildPieSVG(
  data: FrequencyItem[],
  width = 500,
  height = 350
): string {
  const filtered = data.filter((d) => d.count > 0);
  if (filtered.length === 0) {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><text x="${width/2}" y="${height/2}" text-anchor="middle" font-size="14" fill="#666">Sin datos</text></svg>`;
  }

  const cx = 160;
  const cy = height / 2;
  const r = Math.min(cx, cy) - 20;
  let startAngle = -Math.PI / 2;

  const slices: string[] = [];
  const labels: string[] = [];
  const legend: string[] = [];

  const total = filtered.reduce((s, d) => s + d.count, 0);

  filtered.forEach((item, i) => {
    const pct = item.count / total;
    const angle = pct * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const largeArc = angle > Math.PI ? 1 : 0;
    const color = RISK_COLORS[item.label] || CHART_COLORS[i % CHART_COLORS.length];

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    slices.push(
      `<path d="M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z" fill="${color}" stroke="white" stroke-width="1.5"/>`
    );

    // Percentage label inside slice
    if (pct > 0.04) {
      const midAngle = startAngle + angle / 2;
      const lx = cx + (r * 0.65) * Math.cos(midAngle);
      const ly = cy + (r * 0.65) * Math.sin(midAngle);
      labels.push(
        `<text x="${lx.toFixed(2)}" y="${ly.toFixed(2)}" text-anchor="middle" dominant-baseline="middle" font-size="11" font-weight="bold" fill="${pct > 0.3 ? 'white' : '#222'}">${(pct * 100).toFixed(1)}%</text>`
      );
    }

    // Legend
    const ly = 20 + i * 22;
    legend.push(
      `<rect x="${cx * 2 + 20}" y="${ly}" width="14" height="14" fill="${color}"/>`
    );
    const shortLabel = item.label.length > 28 ? item.label.substring(0, 26) + '…' : item.label;
    legend.push(
      `<text x="${cx * 2 + 40}" y="${ly + 12}" font-size="11" fill="#333">${escapeXml(shortLabel)} (${(pct * 100).toFixed(1)}%)</text>`
    );

    startAngle = endAngle;
  });

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <rect width="${width}" height="${height}" fill="white"/>
  ${slices.join('\n  ')}
  ${labels.join('\n  ')}
  ${legend.join('\n  ')}
</svg>`;
}

// ─── SVG Vertical Bar Chart (Excel Style) ─────────────────────────────────────

export function buildBarVerticalSVG(
  data: FrequencyItem[],
  title = '',
  width = 600,
  height = 350,
  xAxisLabel = '',
  yAxisLabel = 'Número de empleados'
): string {
  const filtered = data; // Keep all data for demographic to match exact layout even if 0
  if (filtered.length === 0) {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><text x="${width/2}" y="${height/2}" text-anchor="middle" font-size="14" fill="#666">Sin datos</text></svg>`;
  }

  const marginTop = 50;
  const marginBottom = 80;
  const marginLeft = 60;
  const marginRight = 20;

  const chartW = width - marginLeft - marginRight;
  const chartH = height - marginTop - marginBottom;

  const maxVal = Math.max(...filtered.map((d) => d.count), 1); // Avoid div by 0
  
  // Calculate bar width based on number of items
  const numItems = filtered.length;
  const slotW = chartW / numItems;
  const barW = Math.min(slotW * 0.6, 60); // Max width of 60px per bar
  
  const bars = filtered.map((item, i) => {
    const barH = (item.count / maxVal) * chartH;
    const x = marginLeft + (i * slotW) + (slotW - barW) / 2;
    const y = marginTop + chartH - barH;
    
    const color = DEMOGRAPHIC_COLORS[i % DEMOGRAPHIC_COLORS.length];
    
    // Label for X Axis (wrap if too long)
    const label = item.label;
    const maxChars = Math.floor(slotW / 6); // rough estimate
    let xLabelSvg = '';
    
    if (label.length > maxChars && label.includes(' ')) {
      const words = label.split(' ');
      const mid = Math.floor(words.length / 2);
      const l1 = words.slice(0, mid).join(' ');
      const l2 = words.slice(mid).join(' ');
      xLabelSvg = `
        <text x="${x + barW/2}" y="${marginTop + chartH + 20}" text-anchor="middle" font-size="11" fill="#000">${escapeXml(l1)}</text>
        <text x="${x + barW/2}" y="${marginTop + chartH + 34}" text-anchor="middle" font-size="11" fill="#000">${escapeXml(l2)}</text>
      `;
    } else {
      const shortLabel = label.length > maxChars * 2 ? label.substring(0, maxChars * 2 - 2) + '…' : label;
      xLabelSvg = `<text x="${x + barW/2}" y="${marginTop + chartH + 20}" text-anchor="middle" font-size="11" fill="#000">${escapeXml(shortLabel)}</text>`;
    }

    return `
      <!-- Bar -->
      <rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="${color}" />
      <!-- Top Value Label -->
      <text x="${x + barW/2}" y="${y - 8}" text-anchor="middle" font-size="12" font-weight="bold" fill="#000">${item.count}</text>
      <!-- X Axis Label -->
      ${xLabelSvg}
    `;
  });

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
    <rect width="${width}" height="${height}" fill="white"/>
    
    <!-- Title -->
    ${title ? `<text x="${width / 2}" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#000">${escapeXml(title)}</text>` : ''}
    
    <!-- Outer Border -->
    <rect x="${marginLeft}" y="${marginTop}" width="${chartW}" height="${chartH}" fill="none" stroke="#ccc" stroke-width="1"/>
    
    <!-- Y Axis Label (Rotated) -->
    <text x="-${marginTop + chartH/2}" y="20" transform="rotate(-90)" text-anchor="middle" font-size="12" fill="#000">${escapeXml(yAxisLabel)}</text>
    
    <!-- X Axis Label Bottom -->
    ${xAxisLabel ? `<text x="${marginLeft + chartW/2}" y="${height - 15}" text-anchor="middle" font-size="12" fill="#000">${escapeXml(xAxisLabel)}</text>` : ''}

    ${bars.join('\n')}
  </svg>`;
}

// ─── SVG Horizontal Bar Chart ─────────────────────────────────────────────────

export function buildBarHorizontalSVG(
  data: FrequencyItem[],
  title = '',
  width = 600,
  height?: number
): string {
  const filtered = data.filter((d) => d.count > 0).slice(0, 12);
  const h = height || Math.max(250, filtered.length * 36 + 80);
  const marginLeft = 200;
  const marginRight = 80;
  const barWidth = width - marginLeft - marginRight;
  const barH = 24;
  const gap = 12;

  if (filtered.length === 0) {
    return `<svg width="${width}" height="100" xmlns="http://www.w3.org/2000/svg"><text x="${width/2}" y="50" text-anchor="middle" font-size="14" fill="#666">Sin datos</text></svg>`;
  }

  const maxVal = Math.max(...filtered.map((d) => d.count));

  const bars = filtered.map((item, i) => {
    const y = 50 + i * (barH + gap);
    const bw = maxVal > 0 ? (item.count / maxVal) * barWidth : 0;
    const color = CHART_COLORS[i % CHART_COLORS.length];
    const shortLabel = item.label.length > 26 ? item.label.substring(0, 24) + '…' : item.label;

    return `
    <text x="${marginLeft - 6}" y="${y + barH / 2 + 4}" text-anchor="end" font-size="11" fill="#333">${escapeXml(shortLabel)}</text>
    <rect x="${marginLeft}" y="${y}" width="${bw.toFixed(1)}" height="${barH}" fill="${color}" rx="2"/>
    <text x="${marginLeft + bw + 4}" y="${y + barH / 2 + 4}" font-size="11" fill="#444">${item.count} (${(item.percentage * 100).toFixed(1)}%)</text>`;
  });

  return `<svg width="${width}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <rect width="${width}" height="${h}" fill="white"/>
  ${title ? `<text x="${width / 2}" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#222">${escapeXml(title)}</text>` : ''}
  ${bars.join('')}
</svg>`;
}

// ─── SVG Stacked/Grouped Bar Chart for Risk Tables ────────────────────────────

export function buildRiskStackedBarSVG(
  rows: RiskTableRow[],
  title = '',
  width = 700,
  height?: number
): string {
  const h = height || Math.max(300, rows.length * 32 + 100);
  const marginLeft = 260;
  const marginRight = 20;
  const barW = width - marginLeft - marginRight;
  const barH = 20;
  const gap = 12;

  const COLORS = {
    sinRiesgo: '#1a9641',
    bajo: '#a6d96a',
    medio: '#ffffbf',
    alto: '#fdae61',
    muyAlto: '#d73027',
  };

  const bars = rows.map((row, i) => {
    const y = 70 + i * (barH + gap);
    const t = row.total || 1;
    const segments: string[] = [];
    let x = marginLeft;

    const parts = [
      { key: 'sinRiesgo', val: row.sinRiesgo.count },
      { key: 'bajo', val: row.bajo.count },
      { key: 'medio', val: row.medio.count },
      { key: 'alto', val: row.alto.count },
      { key: 'muyAlto', val: row.muyAlto.count },
    ] as const;

    for (const part of parts) {
      const w = (part.val / t) * barW;
      if (w > 0) {
        segments.push(
          `<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${barH}" fill="${COLORS[part.key]}"/>`
        );
        if (w > 28) {
          segments.push(
            `<text x="${(x + w / 2).toFixed(1)}" y="${y + barH / 2 + 4}" text-anchor="middle" font-size="9" fill="${part.key === 'medio' ? '#555' : 'white'}">${(part.val / t * 100).toFixed(0)}%</text>`
          );
        }
        x += w;
      }
    }

    const shortLabel = row.factor.length > 32 ? row.factor.substring(0, 30) + '…' : row.factor;
    return `
    <text x="${marginLeft - 6}" y="${y + barH / 2 + 4}" text-anchor="end" font-size="9.5" fill="#333">${escapeXml(shortLabel)}</text>
    ${segments.join('')}`;
  });

  // Legend
  const legendItems = [
    { label: 'Sin riesgo', color: COLORS.sinRiesgo },
    { label: 'Riesgo bajo', color: COLORS.bajo },
    { label: 'Riesgo medio', color: COLORS.medio },
    { label: 'Riesgo alto', color: COLORS.alto },
    { label: 'Riesgo muy alto', color: COLORS.muyAlto },
  ];
  const legendY = h - 30;
  const legendSpacing = (width - marginLeft) / 5;
  const legend = legendItems.map((item, i) => `
    <rect x="${marginLeft + i * legendSpacing}" y="${legendY}" width="12" height="12" fill="${item.color}"/>
    <text x="${marginLeft + i * legendSpacing + 16}" y="${legendY + 10}" font-size="9" fill="#444">${item.label}</text>`
  ).join('');

  return `<svg width="${width}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <rect width="${width}" height="${h}" fill="white"/>
  ${title ? `<text x="${width / 2}" y="22" text-anchor="middle" font-size="12" font-weight="bold" fill="#222">${escapeXml(title)}</text>` : ''}
  ${bars.join('')}
  ${legend}
</svg>`;
}

// ─── SVG → PNG conversion using sharp ─────────────────────────────────────────

let cachedFontBase64: string | null = null;

function getFontBase64(): string {
  if (cachedFontBase64 !== null) return cachedFontBase64;
  try {
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf');
    const fontBuffer = fs.readFileSync(fontPath);
    cachedFontBase64 = fontBuffer.toString('base64');
  } catch (e) {
    console.warn('Could not load Roboto font for charts, falling back to system fonts:', e);
    cachedFontBase64 = '';
  }
  return cachedFontBase64;
}

export async function svgToPng(svg: string, width?: number, height?: number): Promise<Buffer> {
  const fontBase64 = getFontBase64();
  
  if (fontBase64) {
    const styleTag = `<style>
      @font-face {
        font-family: 'Roboto';
        src: url(data:font/truetype;charset=utf-8;base64,${fontBase64}) format('truetype');
      }
      text { font-family: 'Roboto', sans-serif !important; }
    </style>`;
    // Inject the style tag right after the <svg ...> opening tag
    svg = svg.replace(/(<svg[^>]*>)/i, `$1${styleTag}`);
  }

  // Dynamic import to avoid issues if sharp isn't installed
  const sharp = (await import('sharp')).default;
  const buf = Buffer.from(svg, 'utf-8');
  let pipeline = sharp(buf);
  if (width || height) {
    pipeline = pipeline.resize(width, height, { fit: 'contain', background: 'white' });
  }
  return pipeline.png().toBuffer();
}

// ─── Generate all charts for the report ──────────────────────────────────────

import type { ReportData } from './types';

export interface ReportCharts {
  sexo: Buffer;
  rangoEdad: Buffer;
  nivelEstudios: Buffer;
  tipoVivienda: Buffer;
  estadoCivil: Buffer;
  estrato: Buffer;
  personasACargo: Buffer;
  aniosEmpresa: Buffer;
  aniosCargo: Buffer;
  tipoCargo: Buffer;
  tipoContrato: Buffer;
  tipoSalario: Buffer;
  ocupacion: Buffer;
  horasDiarias: Buffer;
  ciudadResidencia: Buffer;
  deptResidencia: Buffer;
  ciudadTrabajo: Buffer;
  deptTrabajo: Buffer;
  intralaboralFormaA: Buffer;
  intralaboralFormaB: Buffer;
  extralaboralFormaA: Buffer;
  extralaboralFormaB: Buffer;
  estresGeneral: Buffer;
  estresGeneralSintomas: Buffer;
  estresFormaA: Buffer;
  estresFormaASintomas: Buffer;
  estresFormaB: Buffer;
  estresFormaBSintomas: Buffer;
  generalFactores: Buffer;
  generalFormaA: Buffer;
  generalFormaB: Buffer;
}

export async function generateAllCharts(data: ReportData): Promise<ReportCharts> {
  const dem = data.demographics;
  const pieDims = { width: 500, height: 320 };
  const barDims = { width: 550 };
  const vertBarDims = { width: 500, height: 300 };

  async function pie(items: FrequencyItem[]) {
    return svgToPng(buildPieSVG(items, pieDims.width, pieDims.height));
  }
  async function bar(items: FrequencyItem[], title = '') {
    return svgToPng(buildBarHorizontalSVG(items, title, barDims.width));
  }
  async function vertBar(items: FrequencyItem[], title = '', xAxisLabel = '') {
    return svgToPng(buildBarVerticalSVG(items, title, vertBarDims.width, vertBarDims.height, xAxisLabel));
  }
  async function riskBar(rows: RiskTableRow[], title = '') {
    return svgToPng(buildRiskStackedBarSVG(rows, title, 700));
  }

  // Estrés sintomas grouped
  const estresGeneralSintomasSVG = buildBarHorizontalSVG(
    [
      ...mapEstresLabel(data.estresGeneral.sintomasFisiologicos, 'Fisiológicos'),
      ...mapEstresLabel(data.estresGeneral.sintomasComportamentales, 'Comportamentales'),
    ],
    'Principales síntomas del estrés'
  );

  const [
    sexo, rangoEdad, nivelEstudios, tipoVivienda, estadoCivil, estrato,
    personasACargo, aniosEmpresa, aniosCargo, tipoCargo, tipoContrato, tipoSalario,
    ocupacion, horasDiarias, ciudadResidencia, deptResidencia, ciudadTrabajo, deptTrabajo,
    intralaboralFormaA, intralaboralFormaB, extralaboralFormaA, extralaboralFormaB,
    estresGeneral, estresGeneralSintomas,
    estresFormaA, estresFormaASintomas,
    estresFormaB, estresFormaBSintomas,
    generalFactores, generalFormaA, generalFormaB,
  ] = await Promise.all([
    vertBar(dem.sexo, 'Número de empleados por género', 'Género'),
    vertBar(dem.rangoEdad, 'Número de empleados por rango de edad', 'Rango de edad'),
    vertBar(dem.nivelEstudios, 'Número de empleados por nivel de estudio', 'Nivel de estudio'),
    vertBar(dem.tipoVivienda, 'Número de empleados por tipo de vivienda', 'Tipo de vivienda'),
    vertBar(dem.estadoCivil, 'Número de empleados por estado civil', 'Estado civil'),
    vertBar(dem.estrato, 'Número de empleados por nivel socioeconómico', 'Nivel socioeconómico'),
    vertBar(dem.personasACargo, 'Número de empleados por número de personas a cargo', 'Número de personas a cargo'),
    vertBar(dem.aniosEmpresa, 'Número de empleados por antiguedad en la empresa', 'Antiguedad en la empresa'),
    vertBar(dem.aniosCargo, 'Número de empleados por antiguedad en el cargo', 'Antiguedad en el cargo'),
    vertBar(dem.tipoCargo, 'Número de empleados por nivel jerárquico', 'Nivel jerárquico'),
    vertBar(dem.tipoContrato, 'Número de empleados por tipo de contrato', 'Tipo de contrato'),
    vertBar(dem.tipoSalario, 'Número de empleados por tipo de salario', 'Tipo de salario'),
    bar(dem.ocupacion, 'Número de empleados por ocupación'),
    vertBar(dem.horasDiarias, 'Número de empleados por horas de trabajo', 'Horas diarias de trabajo'),
    vertBar(dem.ciudadResidencia, 'Número de empleados por ciudad de residencia', 'Ciudad de Residencia'),
    vertBar(dem.deptResidencia, 'Número de empleados por departamento de residencia', 'Departamento de Residencia'),
    vertBar(dem.ciudadTrabajo, 'Número de empleados por ciudad de trabajo', 'Ciudad de Trabajo'),
    vertBar(dem.deptTrabajo, 'Número de empleados por departamento de trabajo', 'Departamento de Trabajo'),
    riskBar(data.intralaboralFormaA, 'Factores intralaborales - Forma A'),
    riskBar(data.intralaboralFormaB, 'Factores intralaborales - Forma B'),
    riskBar(data.extralaboralFormaA, 'Factores extralaborales - Forma A'),
    riskBar(data.extralaboralFormaB, 'Factores extralaborales - Forma B'),
    pie(data.estresGeneral.distribution),
    svgToPng(estresGeneralSintomasSVG),
    pie(data.estresFormaA.distribution),
    svgToPng(buildBarHorizontalSVG(data.estresFormaA.sintomasFisiologicos, 'Síntomas del estrés - Forma A')),
    pie(data.estresFormaB.distribution),
    svgToPng(buildBarHorizontalSVG(data.estresFormaB.sintomasFisiologicos, 'Síntomas del estrés - Forma B')),
    riskBar(data.generalRisk.filter(r => r.tipo === 'Dimensión').slice(0, 19) as RiskTableRow[], 'Factores - Total general'),
    riskBar(data.generalRisk.filter(r => r.tipo === 'Dimensión').slice(0, 19) as RiskTableRow[], 'Factores - Forma A'),
    riskBar(data.generalRisk.filter(r => r.tipo === 'Dimensión').slice(0, 19) as RiskTableRow[], 'Factores - Forma B'),
  ]);

  return {
    sexo, rangoEdad, nivelEstudios, tipoVivienda, estadoCivil, estrato,
    personasACargo, aniosEmpresa, aniosCargo, tipoCargo, tipoContrato, tipoSalario,
    ocupacion, horasDiarias, ciudadResidencia, deptResidencia, ciudadTrabajo, deptTrabajo,
    intralaboralFormaA, intralaboralFormaB, extralaboralFormaA, extralaboralFormaB,
    estresGeneral, estresGeneralSintomas,
    estresFormaA, estresFormaASintomas,
    estresFormaB, estresFormaBSintomas,
    generalFactores, generalFormaA, generalFormaB,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function mapEstresLabel(items: FrequencyItem[], prefix: string): FrequencyItem[] {
  return items.map((i) => ({ ...i, label: `${prefix}: ${i.label}` }));
}