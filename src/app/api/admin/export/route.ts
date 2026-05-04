import { prisma } from '@/lib/prisma'
import { NextResponse, NextRequest } from 'next/server'
import ExcelJS from 'exceljs'
import { CONFIG_ESTRES } from '@/lib/psychometrics/constants'
import { buildBarHorizontalSVG, buildBarVerticalSVG, buildRiskStackedBarSVG, buildLikertStackedBarSVG, svgToPng } from '@/lib/psicosocial/chartGenerator'

// Tipos auxiliares
type ResultRow = {
    id_encuesta: string
    Tipo: string
    Variable: string
    Valor: string | number
    Interpretación: string
    'DatosGen.Forma': string
    Cargo: string
}

const LIKERT_TEXT_MAP: Record<string, string> = {
    'siempre': 'SIEMPRE',
    'casi_siempre': 'CASI SIEMPRE',
    'algunas_veces': 'ALGUNAS VECES',
    'a_veces': 'A VECES',
    'casi_nunca': 'CASI NUNCA',
    'nunca': 'NUNCA'
};

const STRESS_QUESTIONS = {
    1: 'Dolores en el cuello y espalda o tensión muscular.',
    2: 'Problemas gastrointestinales, úlcera péptica, acidez, problemas digestivos o del colon.',
    3: 'Problemas respiratorios.',
    4: 'Dolor de cabeza.',
    5: 'Trastornos del sueño como somnolencia durante el día o desvelo en la noche.',
    6: 'Palpitaciones en el pecho o problemas cardíacos.',
    7: 'Cambios fuertes del apetito.',
    8: 'Problemas relacionados con la función de los órganos genitales (impotencia, frigidez).',
    9: 'Dificultad en las relaciones familiares.',
    10: 'Dificultad para permanecer quieto o dificultad para iniciar actividades.',
    11: 'Dificultad en las relaciones con otras personas.',
    12: 'Sensación de aislamiento y desinterés.',
    13: 'Sentimiento de sobrecarga de trabajo.',
    14: 'Dificultad para concentrarse, olvidos frecuentes.',
    15: 'Aumento en el número de accidentes de trabajo.',
    16: 'Sentimiento de frustración, de no haber hecho lo que se quería en la vida.',
    17: 'Cansancio, tedio o desgano.',
    18: 'Disminución del rendimiento en el trabajo o poca creatividad.',
    19: 'Deseo de no asistir al trabajo.',
    20: 'Bajo compromiso o poco interés con lo que se hace.',
    21: 'Dificultad para tomar decisiones.',
    22: 'Deseo de cambiar de empleo.',
    23: 'Sentimiento de soledad y miedo.',
    24: 'Sentimiento de irritabilidad, actitudes y pensamientos negativos.',
    25: 'Sentimiento de angustia, preocupación o tristeza.',
    26: 'Consumo de drogas para aliviar la tensión o los nervios.',
    27: 'Sentimientos de que "no vale nada", o "no sirve para nada".',
    28: 'Consumo de bebidas alcohólicas o café o cigarrillo.',
    29: 'Sentimiento de que está perdiendo la razón.',
    30: 'Comportamientos rígidos, obstinación o terquedad.',
    31: 'Sensación de no poder manejar los problemas de la vida.'
};

type FrequencyItem = {
    label: string
    count: number
    percentage: number
}

type RiskTableRow = {
    factor: string
    sinRiesgo: { count: number; pct: number }
    bajo: { count: number; pct: number }
    medio: { count: number; pct: number }
    alto: { count: number; pct: number }
    muyAlto: { count: number; pct: number }
    total: number
}

type LikertStackedRow = {
    factor: string
    nunca: { count: number; pct: number }
    aVeces: { count: number; pct: number }
    casiSiempre: { count: number; pct: number }
    siempre: { count: number; pct: number }
    total: number
}

function normalizeText(v: unknown): string {
    if (typeof v !== 'string') return ''
    return v.trim()
}

function normalizeRiskLevel(raw: unknown): string {
    const v = normalizeText(raw).toLowerCase()
    const map: Record<string, string> = {
        'sin riesgo': 'Sin riesgo o riesgo despreciable',
        'sin riesgo o riesgo despreciable': 'Sin riesgo o riesgo despreciable',
        'riesgo bajo': 'Riesgo bajo',
        'riesgo medio': 'Riesgo medio',
        'riesgo alto': 'Riesgo alto',
        'riesgo muy alto': 'Riesgo muy alto',
        'no aplica': 'No aplica',
    }
    return map[v] || (normalizeText(raw) || 'Sin datos')
}

const RISK_LEVELS_5 = new Set([
    'Sin riesgo o riesgo despreciable',
    'Riesgo bajo',
    'Riesgo medio',
    'Riesgo alto',
    'Riesgo muy alto',
])

function mapLikert4(raw: unknown): 'Nunca' | 'A veces' | 'Casi siempre' | 'Siempre' | null {
    const v = normalizeText(raw).toLowerCase()
    if (v === 'nunca' || v === 'casi_nunca') return 'Nunca'
    if (v === 'a_veces' || v === 'algunas_veces') return 'A veces'
    if (v === 'casi_siempre') return 'Casi siempre'
    if (v === 'siempre') return 'Siempre'
    return null
}

function countFrequency(values: (string | undefined | null)[], fixedOrder?: string[]): FrequencyItem[] {
    const counts: Record<string, number> = {}
    for (const v of values) {
        const key = (v ?? '').trim() || 'Sin datos'
        counts[key] = (counts[key] || 0) + 1
    }
    const total = values.length || 1
    const items = Object.entries(counts).map(([label, count]) => ({
        label,
        count,
        percentage: count / total,
    }))

    if (fixedOrder && fixedOrder.length > 0) {
        const orderIdx = new Map(fixedOrder.map((k, i) => [k, i]))
        const ordered: FrequencyItem[] = []
        for (const label of fixedOrder) {
            const found = items.find(i => i.label === label)
            ordered.push(found || { label, count: 0, percentage: 0 })
        }
        const leftovers = items
            .filter(i => !orderIdx.has(i.label))
            .sort((a, b) => b.count - a.count)
        const merged = [...ordered, ...leftovers]
        const t = merged.reduce((acc, i) => acc + i.count, 0) || 1
        return merged.map(i => ({ ...i, percentage: i.count / t }))
    }

    return items.sort((a, b) => b.count - a.count)
}

function toPlaceKey(label: string): string {
    return label
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\./g, '')
        .replace(/\s+/g, ' ')
        .trim()
}

function toTitleCase(label: string): string {
    const cleaned = label.replace(/\s+/g, ' ').trim()
    if (!cleaned) return 'Sin datos'
    return cleaned
        .split(' ')
        .map(w => (w.length <= 2 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join(' ')
}

function normalizePlaceLabel(raw: string | undefined | null): { key: string; label: string } {
    const v = (raw ?? '').trim()
    if (!v) return { key: 'sin datos', label: 'Sin datos' }
    const key = toPlaceKey(v)
    const labelMap: Record<string, string> = {
        monteria: 'Montería',
        cordoba: 'Córdoba',
        'cienaga de oro': 'Ciénaga de Oro',
        'no marcado': 'No marcado',
    }
    const label = labelMap[key] || toTitleCase(v)
    return { key, label }
}

function countFrequencyPlaces(values: (string | undefined | null)[]): FrequencyItem[] {
    const counts: Record<string, number> = {}
    const labels: Record<string, string> = {}
    for (const v of values) {
        const { key, label } = normalizePlaceLabel(v)
        counts[key] = (counts[key] || 0) + 1
        if (!labels[key]) labels[key] = label
    }
    const total = values.length || 1
    return Object.entries(counts)
        .map(([key, count]) => ({ label: labels[key] || 'Sin datos', count, percentage: count / total }))
        .sort((a, b) => b.count - a.count)
}

function getAgeRangeFromYear(rawYear: string | undefined): string {
    const year = parseInt((rawYear || '').trim(), 10)
    if (!Number.isFinite(year) || year <= 1900) return 'Sin datos'
    const age = new Date().getFullYear() - year
    if (age < 18) return 'Menores de 18 años'
    if (age <= 25) return 'Entre 18 y 25'
    if (age <= 35) return 'Entre 26 y 35'
    if (age <= 45) return 'Entre 36 y 45'
    return 'Mayores de 45'
}

function sheetFromObjects(ws: ExcelJS.Worksheet, rows: Record<string, unknown>[]) {
    const headers = rows.length > 0 ? Object.keys(rows[0]!) : []
    ws.columns = headers.map(h => ({ header: h, key: h, width: Math.min(Math.max(h.length + 2, 14), 40) }))
    const headerRow = ws.getRow(1)
    headerRow.font = { bold: true }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } }

    for (const r of rows) {
        ws.addRow(headers.map(h => r[h] ?? ''))
    }
    ws.views = [{ state: 'frozen', ySplit: 1 }]
}

function writeFrequencyTable(
    ws: ExcelJS.Worksheet,
    startRow: number,
    title: string,
    items: FrequencyItem[],
    opts: { includePercentage: boolean }
): { endRow: number } {
    const totalCols = opts.includePercentage ? 3 : 2
    ws.mergeCells(startRow, 1, startRow, 1 + totalCols)
    const titleCell = ws.getCell(startRow, 1)
    titleCell.value = title
    titleCell.font = { bold: true, size: 13 }
    titleCell.alignment = { vertical: 'middle' }

    const headerRowIdx = startRow + 1
    const headerRow = ws.getRow(headerRowIdx)
    headerRow.getCell(1).value = 'Categoría'
    headerRow.getCell(2).value = 'Cantidad'
    if (opts.includePercentage) headerRow.getCell(3).value = 'Porcentaje'
    headerRow.font = { bold: true }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
    for (let c = 1; c <= (opts.includePercentage ? 3 : 2); c++) {
        headerRow.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } }
        headerRow.getCell(c).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        }
    }

    let rowIdx = headerRowIdx + 1
    for (const it of items) {
        const row = ws.getRow(rowIdx)
        row.getCell(1).value = it.label
        row.getCell(2).value = it.count
        if (opts.includePercentage) {
            row.getCell(3).value = it.percentage
            row.getCell(3).numFmt = '0.0%'
        }
        for (let c = 1; c <= (opts.includePercentage ? 3 : 2); c++) {
            row.getCell(c).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            }
            row.getCell(c).alignment = { vertical: 'middle', wrapText: true }
        }
        rowIdx++
    }

    return { endRow: rowIdx - 1 }
}

async function addChartWithTable(params: {
    workbook: ExcelJS.Workbook
    ws: ExcelJS.Worksheet
    startRow: number
    title: string
    items: FrequencyItem[]
    chart: { kind: 'vertical' | 'horizontal'; width: number; height: number }
    table: { includePercentage: boolean }
}): Promise<number> {
    const { workbook, ws, startRow, title, items, chart, table } = params

    const tableResult = writeFrequencyTable(ws, startRow, title, items, table)
    const chartSvg =
        chart.kind === 'vertical'
            ? buildBarVerticalSVG(items, title, chart.width, chart.height)
            : buildBarHorizontalSVG(items, title, chart.width, chart.height)

    const png = await svgToPng(chartSvg)
    const bytes = new Uint8Array(png) as Uint8Array<ArrayBuffer>
    const imageId = workbook.addImage({ buffer: bytes.buffer, extension: 'png' })

    const imageTopRow = startRow - 1
    const imageLeftCol = 4
    ws.addImage(imageId, {
        tl: { col: imageLeftCol, row: imageTopRow },
        ext: { width: chart.width, height: chart.height },
    })

    const tableHeightRows = tableResult.endRow - startRow + 1
    const imageHeightRows = Math.ceil(chart.height / 18)
    const blockHeight = Math.max(tableHeightRows, imageHeightRows) + 2
    return startRow + blockHeight
}

function buildRiskRow(subset: any[], factor: string, getLevel: (r: any) => unknown): RiskTableRow {
    const counts = {
        sinRiesgo: 0,
        bajo: 0,
        medio: 0,
        alto: 0,
        muyAlto: 0,
    }

    for (const r of subset) {
        const level = normalizeRiskLevel(getLevel(r))
        if (!RISK_LEVELS_5.has(level)) continue
        if (level === 'Sin riesgo o riesgo despreciable') counts.sinRiesgo++
        else if (level === 'Riesgo bajo') counts.bajo++
        else if (level === 'Riesgo medio') counts.medio++
        else if (level === 'Riesgo alto') counts.alto++
        else if (level === 'Riesgo muy alto') counts.muyAlto++
    }

    const total = counts.sinRiesgo + counts.bajo + counts.medio + counts.alto + counts.muyAlto
    const t = total || 1
    return {
        factor,
        sinRiesgo: { count: counts.sinRiesgo, pct: counts.sinRiesgo / t },
        bajo: { count: counts.bajo, pct: counts.bajo / t },
        medio: { count: counts.medio, pct: counts.medio / t },
        alto: { count: counts.alto, pct: counts.alto / t },
        muyAlto: { count: counts.muyAlto, pct: counts.muyAlto / t },
        total,
    }
}

function buildEstresSymptomsRows(subset: any[]): LikertStackedRow[] {
    const dims = CONFIG_ESTRES.domains[0]?.dimensions || []
    return dims.map(dim => {
        const counts = { nunca: 0, aVeces: 0, casiSiempre: 0, siempre: 0 }
        for (const r of subset) {
            const answers = (r.estresData || {}) as Record<string, string>
            for (const itemId of dim.items || []) {
                const answerVal = answers[`estres_${itemId}`] || answers[itemId.toString()]
                const bucket = mapLikert4(answerVal)
                if (!bucket) continue
                if (bucket === 'Nunca') counts.nunca++
                else if (bucket === 'A veces') counts.aVeces++
                else if (bucket === 'Casi siempre') counts.casiSiempre++
                else if (bucket === 'Siempre') counts.siempre++
            }
        }
        const total = counts.nunca + counts.aVeces + counts.casiSiempre + counts.siempre
        const t = total || 1
        return {
            factor: dim.name,
            nunca: { count: counts.nunca, pct: counts.nunca / t },
            aVeces: { count: counts.aVeces, pct: counts.aVeces / t },
            casiSiempre: { count: counts.casiSiempre, pct: counts.casiSiempre / t },
            siempre: { count: counts.siempre, pct: counts.siempre / t },
            total,
        }
    })
}

function writeRiskStackedTable(ws: ExcelJS.Worksheet, startRow: number, title: string, rows: RiskTableRow[]): { endRow: number } {
    const cols = 12
    ws.mergeCells(startRow, 1, startRow, cols)
    const titleCell = ws.getCell(startRow, 1)
    titleCell.value = title
    titleCell.font = { bold: true, size: 13 }
    titleCell.alignment = { vertical: 'middle' }

    const headerRowIdx = startRow + 1
    const headerRow = ws.getRow(headerRowIdx)
    const headers = [
        'Factor',
        'Sin riesgo (n)', 'Sin riesgo (%)',
        'Bajo (n)', 'Bajo (%)',
        'Medio (n)', 'Medio (%)',
        'Alto (n)', 'Alto (%)',
        'Muy alto (n)', 'Muy alto (%)',
        'Total (n)',
    ]
    headers.forEach((h, i) => {
        headerRow.getCell(i + 1).value = h
        headerRow.getCell(i + 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } }
        headerRow.getCell(i + 1).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        }
        headerRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    })
    headerRow.font = { bold: true }

    let rowIdx = headerRowIdx + 1
    for (const r of rows) {
        const row = ws.getRow(rowIdx)
        row.getCell(1).value = r.factor
        row.getCell(2).value = r.sinRiesgo.count
        row.getCell(3).value = r.sinRiesgo.pct
        row.getCell(4).value = r.bajo.count
        row.getCell(5).value = r.bajo.pct
        row.getCell(6).value = r.medio.count
        row.getCell(7).value = r.medio.pct
        row.getCell(8).value = r.alto.count
        row.getCell(9).value = r.alto.pct
        row.getCell(10).value = r.muyAlto.count
        row.getCell(11).value = r.muyAlto.pct
        row.getCell(12).value = r.total

        for (let c = 1; c <= cols; c++) {
            row.getCell(c).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            }
            row.getCell(c).alignment = { vertical: 'middle', wrapText: true }
        }

        for (const pctCol of [3, 5, 7, 9, 11]) {
            row.getCell(pctCol).numFmt = '0.0%'
        }

        rowIdx++
    }

    return { endRow: rowIdx - 1 }
}

function writeLikertStackedTable(ws: ExcelJS.Worksheet, startRow: number, title: string, rows: LikertStackedRow[]): { endRow: number } {
    const cols = 10
    ws.mergeCells(startRow, 1, startRow, cols)
    const titleCell = ws.getCell(startRow, 1)
    titleCell.value = title
    titleCell.font = { bold: true, size: 13 }
    titleCell.alignment = { vertical: 'middle' }

    const headerRowIdx = startRow + 1
    const headerRow = ws.getRow(headerRowIdx)
    const headers = [
        'Síntoma',
        'Nunca (n)', 'Nunca (%)',
        'A veces (n)', 'A veces (%)',
        'Casi siempre (n)', 'Casi siempre (%)',
        'Siempre (n)', 'Siempre (%)',
        'Total (n)',
    ]
    headers.forEach((h, i) => {
        headerRow.getCell(i + 1).value = h
        headerRow.getCell(i + 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } }
        headerRow.getCell(i + 1).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        }
        headerRow.getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    })
    headerRow.font = { bold: true }

    let rowIdx = headerRowIdx + 1
    for (const r of rows) {
        const row = ws.getRow(rowIdx)
        row.getCell(1).value = r.factor
        row.getCell(2).value = r.nunca.count
        row.getCell(3).value = r.nunca.pct
        row.getCell(4).value = r.aVeces.count
        row.getCell(5).value = r.aVeces.pct
        row.getCell(6).value = r.casiSiempre.count
        row.getCell(7).value = r.casiSiempre.pct
        row.getCell(8).value = r.siempre.count
        row.getCell(9).value = r.siempre.pct
        row.getCell(10).value = r.total

        for (let c = 1; c <= cols; c++) {
            row.getCell(c).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            }
            row.getCell(c).alignment = { vertical: 'middle', wrapText: true }
        }

        for (const pctCol of [3, 5, 7, 9]) {
            row.getCell(pctCol).numFmt = '0.0%'
        }

        rowIdx++
    }

    return { endRow: rowIdx - 1 }
}

async function addRiskStackedChartWithTable(params: {
    workbook: ExcelJS.Workbook
    ws: ExcelJS.Worksheet
    startRow: number
    title: string
    rows: RiskTableRow[]
    chart: { width: number; height?: number }
}): Promise<number> {
    const { workbook, ws, startRow, title, rows, chart } = params

    const tableResult = writeRiskStackedTable(ws, startRow, title, rows)
    const chartSvg = buildRiskStackedBarSVG(rows, title, chart.width, chart.height)
    const png = await svgToPng(chartSvg)
    const bytes = new Uint8Array(png) as Uint8Array<ArrayBuffer>
    const imageId = workbook.addImage({ buffer: bytes.buffer, extension: 'png' })

    const imageTopRow = startRow - 1
    const imageLeftCol = 14
    ws.addImage(imageId, {
        tl: { col: imageLeftCol, row: imageTopRow },
        ext: { width: chart.width, height: chart.height || 320 },
    })

    const tableHeightRows = tableResult.endRow - startRow + 1
    const imageHeightRows = Math.ceil((chart.height || 320) / 18)
    const blockHeight = Math.max(tableHeightRows, imageHeightRows) + 2
    return startRow + blockHeight
}

async function addLikertStackedChartWithTable(params: {
    workbook: ExcelJS.Workbook
    ws: ExcelJS.Worksheet
    startRow: number
    title: string
    rows: LikertStackedRow[]
    chart: { width: number; height?: number }
}): Promise<number> {
    const { workbook, ws, startRow, title, rows, chart } = params

    const tableResult = writeLikertStackedTable(ws, startRow, title, rows)
    const chartSvg = buildLikertStackedBarSVG(rows, title, chart.width, chart.height)
    const png = await svgToPng(chartSvg)
    const bytes = new Uint8Array(png) as Uint8Array<ArrayBuffer>
    const imageId = workbook.addImage({ buffer: bytes.buffer, extension: 'png' })

    const imageTopRow = startRow - 1
    const imageLeftCol = 14
    ws.addImage(imageId, {
        tl: { col: imageLeftCol, row: imageTopRow },
        ext: { width: chart.width, height: chart.height || 320 },
    })

    const tableHeightRows = tableResult.endRow - startRow + 1
    const imageHeightRows = Math.ceil((chart.height || 320) / 18)
    const blockHeight = Math.max(tableHeightRows, imageHeightRows) + 2
    return startRow + blockHeight
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const campanaId = searchParams.get('campanaId')

        const whereClause = campanaId ? { participante: { campanaId: campanaId } } : {}

        const responses = await prisma.surveyResponse.findMany({
            where: whereClause,
            include: {
                participante: {
                    include: {
                        campana: { include: { empresa: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // 1. Hoja de Datos Demográficos (Existente)
        const demoData = responses.map(r => {
            const ficha = (r.fichaData as unknown as Record<string, string>) || {}
            const anioNacimiento = parseInt(ficha['ficha_3'] || '0')
            let edad = ''
            if (anioNacimiento > 1900) {
                edad = (new Date().getFullYear() - anioNacimiento).toString()
            }

            return {
                'Nombre': ficha['ficha_1'] || r.consentName || '',
                'Empresa': r.participante?.campana?.empresa?.name || '',
                'Sexo': ficha['ficha_2'] || '',
                'Año de nacimiento': ficha['ficha_3'] || '',
                'Estado civil': '', 
                'Ultimo nivel de estudios': ficha['ficha_4'] || '',
                'Ocupación o profesión': ficha['ficha_5'] || '',
                'Lugar de residencia.ciudad': ficha['ciudad_residencia'] || '',
                'Lugar de residencia.departamento': ficha['departamento_residencia'] || '',
                'Estrato': ficha['ficha_7'] || '',
                'Tipo de vivienda': ficha['ficha_8'] || '',
                'Número de personas que dependen económicamente': ficha['ficha_9'] || '',
                'Lugar donde trabaja actualmente.Ciudad': ficha['ciudad_trabajo'] || '',
                'Lugar donde trabaja actualmente.Departamento': ficha['departamento_trabajo'] || '',
                'Años en la empresa': ficha['ficha_11'] || '',
                'Cargo': ficha['ficha_12'] || '',
                'Tipo de cargo': ficha['ficha_13'] || '',
                'Años en el cargo': ficha['ficha_14'] || '',
                'Area de la empresa': ficha['ficha_15'] || '',
                'Numero de horas diarias de trabajo': ficha['ficha_17'] || '',
                'Tipo de contrato': ficha['ficha_16'] || '',
                'Tipo de salario (fijo, variable)': ficha['ficha_18'] || '', 
                'Forma': r.formType,
                'Edad (años)': edad,
            }
        })

        // 2. Hoja de Análisis Detallado (Nueva)
        const analysisData: ResultRow[] = [];

        responses.forEach(r => {
            const idEncuesta = `ENC_${r.id.substring(0, 4)}_${r.formType === 'A' ? 'ia' : 'ib'}`;
            const results = r.results as any; // Assuming it follows the structure from our engine
            const ficha = (r.fichaData as unknown as Record<string, string>) || {};
            const cargo = ficha['ficha_12'] || ficha['cargo'] || 'No especificado';

            if (!results) return;

            const addRow = (tipo: string, variable: string, valor: string | number, interpretacion: string) => {
                analysisData.push({
                    id_encuesta: idEncuesta,
                    Tipo: tipo,
                    Variable: variable,
                    Valor: valor,
                    Interpretación: interpretacion,
                    'DatosGen.Forma': r.formType,
                    Cargo: cargo
                });
            };

            // --- INTRALABORAL ---
            // Dimensiones Intralaborales
            if (results.intralaboral?.domains) {
                results.intralaboral.domains.forEach((d: any) => {
                    addRow('Dominio', d.name, d.transformed, d.level);
                    d.dimensions.forEach((dim: any) => {
                        addRow('Dimensión', dim.name, dim.transformed, dim.level);
                    });
                });
            }

            // --- EXTRALABORAL ---
            if (results.extralaboral?.domains) {
                results.extralaboral.domains.forEach((d: any) => {
                    d.dimensions.forEach((dim: any) => {
                        addRow('Extralaboral', dim.name, dim.transformed, dim.level);
                    });
                });
            }

            // --- TOTALES ---
            if (results.extralaboral?.total) {
                addRow('Total cuestionario', 'Factores Extralaborales', results.extralaboral.total.transformed, results.extralaboral.total.level);
            }
            if (results.intralaboral?.total) {
                addRow('Total cuestionario', 'Factores Intralaborales', results.intralaboral.total.transformed, results.intralaboral.total.level);
            }
            if (results.global) {
                addRow('Total cuestionario', 'Factores Intralaborales + Extralaborales', results.global.transformed, results.global.level);
            }
            if (results.estres?.total) {
                addRow('Total cuestionario', 'Nivel de Estrés', results.estres.total.transformed, results.estres.total.level);
            }

            // --- ESTRES DETALLADO (Items) ---
            const estresAnswers = r.estresData as Record<string, string>;
            if (estresAnswers) {
                CONFIG_ESTRES.domains[0].dimensions.forEach(dim => {
                    dim.items.forEach(itemId => {
                        let answerVal = estresAnswers[`estres_${itemId}`] || estresAnswers[itemId.toString()];
                        if (answerVal) {
                             const text = LIKERT_TEXT_MAP[answerVal] || answerVal.toUpperCase();
                             let points = 0;
                             if (answerVal === 'siempre') points = 4;
                             else if (answerVal === 'casi_siempre') points = 3;
                             else if (answerVal === 'a_veces' || answerVal === 'algunas_veces') points = 2;
                             else if (answerVal === 'casi_nunca') points = 1;
                             else if (answerVal === 'nunca') points = 0;

                             addRow(`Estrés: ${dim.name}`, (STRESS_QUESTIONS as any)[itemId] || `Pregunta ${itemId}`, points, text);
                        }
                    });
                });
            }
        });

        const workbook = new ExcelJS.Workbook()
        workbook.creator = 'next-survey-app'
        workbook.created = new Date()

        const wsDemo = workbook.addWorksheet('Datos Sociodemográficos')
        sheetFromObjects(wsDemo, demoData as unknown as Record<string, unknown>[])

        const wsAnalysis = workbook.addWorksheet('Análisis de Riesgo')
        sheetFromObjects(wsAnalysis, analysisData as unknown as Record<string, unknown>[])

        const wsCharts = workbook.addWorksheet('Gráficos')
        wsCharts.columns = [
            { key: 'a', width: 44 },
            { key: 'b', width: 12 },
            { key: 'c', width: 14 },
            { key: 'd', width: 2 },
            { key: 'e', width: 18 },
            { key: 'f', width: 18 },
            { key: 'g', width: 18 },
            { key: 'h', width: 18 },
            { key: 'i', width: 18 },
            { key: 'j', width: 18 },
            { key: 'k', width: 18 },
            { key: 'l', width: 18 },
            { key: 'm', width: 6 },
            { key: 'n', width: 18 },
            { key: 'o', width: 18 },
            { key: 'p', width: 18 },
            { key: 'q', width: 18 },
            { key: 'r', width: 18 },
            { key: 's', width: 18 },
            { key: 't', width: 18 },
        ]

        const fichaList = responses.map(r => (r.fichaData as unknown as Record<string, string>) || {})

        const sexo = countFrequency(fichaList.map(f => f['ficha_2']))
        const rangoEdadOrder = ['Menores de 18 años', 'Entre 18 y 25', 'Entre 26 y 35', 'Entre 36 y 45', 'Mayores de 45', 'Sin datos']
        const rangoEdad = countFrequency(fichaList.map(f => getAgeRangeFromYear(f['ficha_3'])), rangoEdadOrder)
        const nivelEstudios = countFrequency(fichaList.map(f => f['ficha_4']))
        const tipoVivienda = countFrequency(fichaList.map(f => f['ficha_8']))
        const estrato = countFrequency(fichaList.map(f => f['ficha_7']))
        const personasACargo = countFrequency(fichaList.map(f => f['ficha_9']))
        const aniosEmpresa = countFrequency(fichaList.map(f => f['ficha_11']))
        const aniosCargo = countFrequency(fichaList.map(f => f['ficha_14']))
        const nivelJerarquico = countFrequency(fichaList.map(f => f['ficha_13']))
        const tipoContrato = countFrequency(fichaList.map(f => f['ficha_16']))
        const tipoSalario = countFrequency(fichaList.map(f => f['ficha_18']))
        const horasDiarias = countFrequency(fichaList.map(f => f['ficha_17']))
        const ciudadResidencia = countFrequencyPlaces(fichaList.map(f => f['ciudad_residencia']))
        const deptResidencia = countFrequencyPlaces(fichaList.map(f => f['departamento_residencia']))
        const ciudadTrabajo = countFrequencyPlaces(fichaList.map(f => f['ciudad_trabajo']))
        const deptTrabajo = countFrequencyPlaces(fichaList.map(f => f['departamento_trabajo']))

        const RISK_ORDER = [
            'Sin riesgo o riesgo despreciable',
            'Riesgo bajo',
            'Riesgo medio',
            'Riesgo alto',
            'Riesgo muy alto',
            'No aplica',
            'Sin datos',
        ]

        const responsesA = responses.filter(r => r.formType === 'A')
        const responsesB = responses.filter(r => r.formType === 'B')

        const riskFreq = (subset: typeof responses, getLevel: (r: any) => unknown) =>
            countFrequency(subset.map(r => normalizeRiskLevel(getLevel(r))), RISK_ORDER)

        const intralaboralA = riskFreq(responsesA, r => (r.results as any)?.intralaboral?.total?.level)
        const intralaboralB = riskFreq(responsesB, r => (r.results as any)?.intralaboral?.total?.level)
        const extralaboralA = riskFreq(
            responsesA,
            r => (r.results as any)?.extralaboral?.total?.level ?? (r.results as any)?.extralaboral?.domains?.[0]?.level
        )
        const extralaboralB = riskFreq(
            responsesB,
            r => (r.results as any)?.extralaboral?.total?.level ?? (r.results as any)?.extralaboral?.domains?.[0]?.level
        )
        const estresGeneral = riskFreq(
            responses,
            r => (r.results as any)?.estres?.total?.level ?? (r.results as any)?.estres?.domains?.[0]?.level
        )
        const estresA = riskFreq(
            responsesA,
            r => (r.results as any)?.estres?.total?.level ?? (r.results as any)?.estres?.domains?.[0]?.level
        )
        const estresB = riskFreq(
            responsesB,
            r => (r.results as any)?.estres?.total?.level ?? (r.results as any)?.estres?.domains?.[0]?.level
        )

        let row = 1
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Sexo (cantidad y porcentaje)',
            items: sexo,
            chart: { kind: 'vertical', width: 500, height: 300 },
            table: { includePercentage: true },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Rango de edad (cantidad y porcentaje)',
            items: rangoEdad,
            chart: { kind: 'horizontal', width: 600, height: 300 },
            table: { includePercentage: true },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Nivel de estudios (cantidad)',
            items: nivelEstudios,
            chart: { kind: 'horizontal', width: 600, height: 300 },
            table: { includePercentage: false },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Tipo de vivienda (cantidad)',
            items: tipoVivienda,
            chart: { kind: 'vertical', width: 500, height: 300 },
            table: { includePercentage: false },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Nivel socioeconómico (cantidad)',
            items: estrato,
            chart: { kind: 'vertical', width: 500, height: 300 },
            table: { includePercentage: false },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Personas a cargo (cantidad)',
            items: personasACargo,
            chart: { kind: 'vertical', width: 500, height: 300 },
            table: { includePercentage: false },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Antigüedad en la empresa (cantidad)',
            items: aniosEmpresa,
            chart: { kind: 'vertical', width: 500, height: 300 },
            table: { includePercentage: false },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Antigüedad en el cargo (cantidad)',
            items: aniosCargo,
            chart: { kind: 'vertical', width: 500, height: 300 },
            table: { includePercentage: false },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Nivel jerárquico (cantidad)',
            items: nivelJerarquico,
            chart: { kind: 'vertical', width: 500, height: 300 },
            table: { includePercentage: false },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Tipo de contrato (cantidad y porcentaje)',
            items: tipoContrato,
            chart: { kind: 'vertical', width: 500, height: 300 },
            table: { includePercentage: true },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Tipo de salario (cantidad)',
            items: tipoSalario,
            chart: { kind: 'vertical', width: 500, height: 300 },
            table: { includePercentage: false },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Número de empleados por horas diarias de trabajo (cantidad)',
            items: horasDiarias,
            chart: { kind: 'vertical', width: 600, height: 300 },
            table: { includePercentage: false },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Número de empleados por ciudad de residencia (cantidad)',
            items: ciudadResidencia,
            chart: { kind: 'vertical', width: 700, height: 320 },
            table: { includePercentage: false },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Número de empleados por departamento de residencia (cantidad)',
            items: deptResidencia,
            chart: { kind: 'vertical', width: 650, height: 300 },
            table: { includePercentage: false },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Número de empleados por ciudad donde trabajan actualmente (cantidad)',
            items: ciudadTrabajo,
            chart: { kind: 'vertical', width: 700, height: 320 },
            table: { includePercentage: false },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Número de empleados por departamento donde trabaja actualmente (cantidad)',
            items: deptTrabajo,
            chart: { kind: 'vertical', width: 650, height: 300 },
            table: { includePercentage: false },
        })

        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Factor intralaboral - Forma A (porcentaje)',
            items: intralaboralA,
            chart: { kind: 'horizontal', width: 600, height: 300 },
            table: { includePercentage: true },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Factor intralaboral - Forma B (porcentaje)',
            items: intralaboralB,
            chart: { kind: 'horizontal', width: 600, height: 300 },
            table: { includePercentage: true },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Factor extralaboral - Forma A (porcentaje)',
            items: extralaboralA,
            chart: { kind: 'horizontal', width: 600, height: 300 },
            table: { includePercentage: true },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Factor extralaboral - Forma B (porcentaje)',
            items: extralaboralB,
            chart: { kind: 'horizontal', width: 600, height: 300 },
            table: { includePercentage: true },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Estrés general (Forma A y B) (porcentaje)',
            items: estresGeneral,
            chart: { kind: 'horizontal', width: 600, height: 300 },
            table: { includePercentage: true },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Estrés - Forma A (porcentaje)',
            items: estresA,
            chart: { kind: 'horizontal', width: 600, height: 300 },
            table: { includePercentage: true },
        })
        row = await addChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Estrés - Forma B (porcentaje)',
            items: estresB,
            chart: { kind: 'horizontal', width: 600, height: 300 },
            table: { includePercentage: true },
        })

        const totalsGeneralRows: RiskTableRow[] = [
            buildRiskRow(
                responses,
                'Nivel de Estrés',
                r => (r.results as any)?.estres?.total?.level ?? (r.results as any)?.estres?.domains?.[0]?.level
            ),
            buildRiskRow(
                responses,
                'Factores Intralaborales + Extralaborales',
                r => (r.results as any)?.global?.level
            ),
            buildRiskRow(
                responses,
                'Factores Extralaborales',
                r => (r.results as any)?.extralaboral?.total?.level ?? (r.results as any)?.extralaboral?.domains?.[0]?.level
            ),
            buildRiskRow(
                responses,
                'Factores Intralaborales',
                r => (r.results as any)?.intralaboral?.total?.level
            ),
        ]

        const totalsFormaARows: RiskTableRow[] = [
            buildRiskRow(
                responsesA,
                'Nivel de Estrés',
                r => (r.results as any)?.estres?.total?.level ?? (r.results as any)?.estres?.domains?.[0]?.level
            ),
            buildRiskRow(
                responsesA,
                'Factores Intralaborales + Extralaborales',
                r => (r.results as any)?.global?.level
            ),
            buildRiskRow(
                responsesA,
                'Factores Extralaborales',
                r => (r.results as any)?.extralaboral?.total?.level ?? (r.results as any)?.extralaboral?.domains?.[0]?.level
            ),
            buildRiskRow(
                responsesA,
                'Factores Intralaborales',
                r => (r.results as any)?.intralaboral?.total?.level
            ),
        ]

        const totalsFormaBRows: RiskTableRow[] = [
            buildRiskRow(
                responsesB,
                'Nivel de Estrés',
                r => (r.results as any)?.estres?.total?.level ?? (r.results as any)?.estres?.domains?.[0]?.level
            ),
            buildRiskRow(
                responsesB,
                'Factores Intralaborales + Extralaborales',
                r => (r.results as any)?.global?.level
            ),
            buildRiskRow(
                responsesB,
                'Factores Extralaborales',
                r => (r.results as any)?.extralaboral?.total?.level ?? (r.results as any)?.extralaboral?.domains?.[0]?.level
            ),
            buildRiskRow(
                responsesB,
                'Factores Intralaborales',
                r => (r.results as any)?.intralaboral?.total?.level
            ),
        ]

        row = await addRiskStackedChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Factores - Total general',
            rows: totalsGeneralRows,
            chart: { width: 700, height: 300 },
        })
        row = await addRiskStackedChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Factores - Forma A',
            rows: totalsFormaARows,
            chart: { width: 700, height: 300 },
        })
        row = await addRiskStackedChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Factores - Forma B',
            rows: totalsFormaBRows,
            chart: { width: 700, height: 300 },
        })

        const sintomasGeneralRows = buildEstresSymptomsRows(responses)
        const sintomasFormaARows = buildEstresSymptomsRows(responsesA)
        const sintomasFormaBRows = buildEstresSymptomsRows(responsesB)

        row = await addLikertStackedChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Categorías principales para los síntomas del estrés - Total general',
            rows: sintomasGeneralRows,
            chart: { width: 700, height: 300 },
        })
        row = await addLikertStackedChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Categorías principales para los síntomas del estrés - Forma A',
            rows: sintomasFormaARows,
            chart: { width: 700, height: 300 },
        })
        row = await addLikertStackedChartWithTable({
            workbook,
            ws: wsCharts,
            startRow: row,
            title: 'Categorías principales para los síntomas del estrés - Forma B',
            rows: sintomasFormaBRows,
            chart: { width: 700, height: 300 },
        })

        const out = await workbook.xlsx.writeBuffer()
        const buffer = Buffer.isBuffer(out) ? out : Buffer.from(out as ArrayBuffer)
        const filename = campanaId ? `resultados-campana-${campanaId}.xlsx` : `resultados-generales-${new Date().toISOString().split('T')[0]}.xlsx`

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${filename}"`
            }
        })

    } catch (error) {
        console.error('Export error:', error)
        return NextResponse.json({ error: 'Failed to export results' }, { status: 500 })
    }
}
