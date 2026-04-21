import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import type { CuestionarioAsignado } from '@prisma/client';

const ParamsSchema = z.object({
  campanaId: z.string().min(1),
});

const ImportRowSchema = z.object({
  nombresApellidos: z.string().min(1),
  cedula: z.string().min(1),
  area: z.string().optional(),
  cargo: z.string().optional(),
  cuestionarioAsignado: z.enum(['A', 'B', 'NO_APLICA']),
});

function normalizeCedula(value: unknown): string {
  if (value === null || value === undefined) return '';
  const raw = String(value).trim();
  return raw.replace(/[^\d]/g, '');
}

function normalizeHeader(h: string): string {
  return h.replace(/\s+/g, ' ').trim().toLowerCase();
}

function parseCuestionarioAsignado(value: unknown): CuestionarioAsignado | null {
  if (value === null || value === undefined) return null;
  const v = String(value).replace(/\s+/g, ' ').trim().toUpperCase();
  if (v === 'A') return 'A';
  if (v === 'B') return 'B';
  if (v === 'NO APLICA' || v === 'NO_APLICA' || v === 'NO APLICAR') return 'NO_APLICA';
  return null;
}

export async function POST(req: Request, context: { params: Promise<{ campanaId: string }> }) {
  try {
    const { campanaId } = ParamsSchema.parse(await context.params);

    const formData = await req.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Archivo Excel requerido (campo: file)' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workbook = xlsx.read(buffer, { type: 'buffer', cellDates: true });
    const sheetName =
      workbook.SheetNames.find((n) => n.toLowerCase() === 'registro') ?? workbook.SheetNames[0];
    const ws = workbook.Sheets[sheetName];
    if (!ws) {
      return NextResponse.json({ error: 'No se encontró la hoja Registro en el archivo' }, { status: 400 });
    }

    const headerRowIndex = 7;
    const dataRowStartIndex = 8;

    const range = xlsx.utils.decode_range(ws['!ref'] ?? 'A1:A1');
    const headers: Record<number, string> = {};
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = xlsx.utils.encode_cell({ r: headerRowIndex, c });
      const v = ws[addr]?.v;
      if (!v) continue;
      headers[c] = normalizeHeader(String(v));
    }

    const colByHeader = (name: string) => {
      const n = normalizeHeader(name);
      const entry = Object.entries(headers).find(([, h]) => h === n);
      return entry ? Number(entry[0]) : null;
    };

    const colNombre = colByHeader('NOMBRES Y APELLIDOS');
    const colCedula = colByHeader('IDENTIFICACIÓN');
    const colArea = colByHeader('ÁREA / CENTRO DE TRABAJO') ?? colByHeader('AREA / CENTRO DE TRABAJO');
    const colCargo = colByHeader('CARGO');
    const colCuest = colByHeader('TIPO DE CUESTIONARIO (AUTO)') ?? colByHeader('TIPO DE CUESTIONARIO');
    const colEstado = colByHeader('ESTADO ACTUAL');

    if (colNombre === null || colCedula === null || colCuest === null) {
      return NextResponse.json(
        {
          error: 'Estructura de Excel inválida',
          details: {
            requiredHeaders: ['NOMBRES Y APELLIDOS', 'IDENTIFICACIÓN', 'TIPO DE CUESTIONARIO (AUTO)'],
            detectedHeaders: Object.values(headers),
            sheetName,
            headerRow: 8,
            dataRowStart: 9,
          },
        },
        { status: 400 }
      );
    }

    const parsedRows: Array<z.infer<typeof ImportRowSchema>> = [];
    const rejected: Array<{ row: number; reason: string }> = [];

    let emptyStreak = 0;
    for (let r = dataRowStartIndex; r <= range.e.r; r++) {
      const getCell = (c: number | null) => {
        if (c === null) return undefined;
        const addr = xlsx.utils.encode_cell({ r, c });
        return ws[addr]?.v;
      };

      const nombre = getCell(colNombre);
      const cedulaRaw = getCell(colCedula);
      const cuestionarioRaw = getCell(colCuest);
      const estado = String(getCell(colEstado) ?? '').trim().toUpperCase();

      const cedula = normalizeCedula(cedulaRaw);
      const nombresApellidos = String(nombre ?? '').trim();
      const cuestionarioAsignado = parseCuestionarioAsignado(cuestionarioRaw);

      const isRowEmpty = !cedula && !nombresApellidos && !cuestionarioRaw;
      if (isRowEmpty) {
        emptyStreak++;
        if (emptyStreak >= 20) break;
        continue;
      }
      emptyStreak = 0;

      if (!cedula) {
        rejected.push({ row: r + 1, reason: 'Identificación vacía o inválida' });
        continue;
      }
      if (!nombresApellidos) {
        rejected.push({ row: r + 1, reason: 'Nombres y apellidos vacíos' });
        continue;
      }
      if (!cuestionarioAsignado) {
        rejected.push({ row: r + 1, reason: 'Tipo de cuestionario inválido (esperado: A, B o NO APLICA)' });
        continue;
      }

      const area = String(getCell(colArea) ?? '').trim() || undefined;
      const cargo = String(getCell(colCargo) ?? '').trim() || undefined;

      const candidate = { nombresApellidos, cedula, area, cargo, cuestionarioAsignado };
      const parsed = ImportRowSchema.safeParse(candidate);
      if (!parsed.success) {
        rejected.push({ row: r + 1, reason: 'Fila inválida' });
        continue;
      }
      parsedRows.push(parsed.data);
    }

    await prisma.campana.findUniqueOrThrow({ where: { id: campanaId } });

    const existing = await prisma.participante.findMany({
      where: { campanaId },
      select: { cedula: true },
    });
    const existingSet = new Set(existing.map((p) => p.cedula));

    const toCreate = parsedRows.filter((r) => !existingSet.has(r.cedula));
    const toUpdate = parsedRows.filter((r) => existingSet.has(r.cedula));

    await prisma.$transaction(async (tx) => {
      if (toCreate.length) {
        await tx.participante.createMany({
          data: toCreate.map((r) => ({
            campanaId,
            cedula: r.cedula,
            nombresApellidos: r.nombresApellidos,
            areaExcel: r.area,
            cargoExcel: r.cargo,
            cuestionarioAsignado: r.cuestionarioAsignado,
          })),
          skipDuplicates: true,
        });
      }

      for (const r of toUpdate) {
        await tx.participante.update({
          where: { cedula_campanaId: { cedula: r.cedula, campanaId } },
          data: {
            nombresApellidos: r.nombresApellidos,
            areaExcel: r.area,
            cargoExcel: r.cargo,
            cuestionarioAsignado: r.cuestionarioAsignado,
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      sheetName,
      headerRow: 8,
      dataRowStart: 9,
      totalRead: parsedRows.length + rejected.length,
      imported: toCreate.length,
      updated: toUpdate.length,
      rejected,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: e.flatten() }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : 'Error desconocido';
    return NextResponse.json({ error: 'Error interno importando Excel', details: message }, { status: 500 });
  }
}
