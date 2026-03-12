import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateConsolidatedPDF } from '@/lib/pdf-generators';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id: participantId } = resolvedParams;

    const participant = await prisma.participante.findUnique({
      where: { id: participantId },
      include: {
        campana: {
          include: { empresa: true }
        },
        surveyResponse: true
      }
    });

    if (!participant || !participant.surveyResponse) {
      return NextResponse.json({ error: 'Participante o respuesta no encontrada' }, { status: 404 });
    }

    // Generate the unified PDF Document
    const pdfBytes = await generateConsolidatedPDF(participant);

    // Return as a downloadable attachment stream
    const buffer = Buffer.from(pdfBytes);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Informe_General_${participant.cedula}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating consolidated PDF:', error);
    return NextResponse.json({ error: 'Excepción interna generando PDF' }, { status: 500 });
  }
}
