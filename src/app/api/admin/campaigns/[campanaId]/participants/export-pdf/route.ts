import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import {
  generateParticipantListPDF,
  type ParticipantListRow,
  type ParticipantListMeta,
} from '@/lib/pdf-generators/participantListGenerator';

const ParamsSchema = z.object({
  campanaId: z.string().min(1),
});

export async function GET(
  _req: Request,
  context: { params: Promise<{ campanaId: string }> },
) {
  try {
    const { campanaId } = ParamsSchema.parse(await context.params);

    const campana = await prisma.campana.findUnique({
      where: { id: campanaId },
      select: {
        name: true,
        empresa: { select: { name: true } },
      },
    });

    if (!campana) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });
    }

    const participants = await prisma.participante.findMany({
      where: {
        campanaId,
        cuestionarioAsignado: { in: ['A', 'B'] },
      },
      orderBy: { createdAt: 'asc' },
      select: {
        cedula: true,
        nombresApellidos: true,
        cuestionarioAsignado: true,
        surveyResponse: { select: { createdAt: true } },
      },
    });

    const formaLabel = (val: string | null) => {
      if (val === 'NO_APLICA') return 'No aplica';
      if (val === 'A' || val === 'B') return `Forma ${val}`;
      return '—';
    };

    const rows: ParticipantListRow[] = participants.map((p, idx) => ({
      index: idx + 1,
      nombresApellidos: p.nombresApellidos || '',
      cedula: p.cedula,
      forma: formaLabel(p.cuestionarioAsignado),
      hasCompleted: Boolean(p.surveyResponse),
      completedAt: p.surveyResponse
        ? new Date(p.surveyResponse.createdAt).toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : null,
    }));

    const totalCompletados = rows.filter((r) => r.hasCompleted).length;

    const now = new Date();
    const meta: ParticipantListMeta = {
      empresaName: campana.empresa.name,
      campanaName: campana.name,
      generatedAt: now.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      totalRegistrados: rows.length,
      totalCompletados,
      totalPendientes: rows.length - totalCompletados,
    };

    const pdfBytes = await generateParticipantListPDF(rows, meta);

    const filename = `Listado_Participantes_${campana.empresa.name.replace(/\s+/g, '_')}_${campana.name.replace(/\s+/g, '_')}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating participant list PDF:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
