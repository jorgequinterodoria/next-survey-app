import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const ParamsSchema = z.object({
  campanaId: z.string().min(1),
});

export async function GET(_req: Request, context: { params: Promise<{ campanaId: string }> }) {
  const { campanaId } = ParamsSchema.parse(await context.params);

  const participants = await prisma.participante.findMany({
    where: { campanaId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      cedula: true,
      nombresApellidos: true,
      cuestionarioAsignado: true,
      cargoExcel: true,
      areaExcel: true,
      surveyResponse: { select: { id: true, createdAt: true } },
    },
  });

  return NextResponse.json({
    campanaId,
    participants: participants.map((p) => ({
      id: p.id,
      cedula: p.cedula,
      nombresApellidos: p.nombresApellidos,
      cuestionarioAsignado: p.cuestionarioAsignado,
      cargo: p.cargoExcel,
      area: p.areaExcel,
      hasCompleted: Boolean(p.surveyResponse),
      completedAt: p.surveyResponse?.createdAt ?? null,
    })),
  });
}
