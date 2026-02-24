// ============================================================
// API ROUTE: POST /api/reports/[campanaId]
// Next.js App Router - generates .docx from original template
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processReportData } from '@/lib/psicosocial/dataProcessor';
import { generateAllCharts } from '@/lib/psicosocial/chartGenerator';
import { processTemplate } from '@/lib/psicosocial/templateProcessor';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ campanaId: string }> }
) {
  try {
    const { campanaId } = await params;

    // ── 1. Fetch campaign with all responses from Neon ──────────────
    const campana = await prisma.campana.findUnique({
      where: { id: campanaId },
      include: {
        empresa: true,
        participantes: {
          include: {
            surveyResponse: {
              select: {
                formType: true,
                fichaData: true,
                filters: true,
                results: true,
              },
            },
          },
        },
      },
    });

    if (!campana) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });
    }

    const completedResponses = campana.participantes.filter(
      (p) => p.surveyResponse !== null
    );

    if (completedResponses.length === 0) {
      return NextResponse.json(
        { error: 'No hay respuestas completadas en esta campaña' },
        { status: 400 }
      );
    }

    // ── 2. Process data ──────────────────────────────────────────────
    const reportData = processReportData(campana as any);

    // ── 3. Generate charts ───────────────────────────────────────────
    const charts = await generateAllCharts(reportData);

    // ── 4. Fill template (preserves ALL original formatting) ─────────
    const docBuffer = await processTemplate(reportData, charts);

    // ── 5. Return file ────────────────────────────────────────────────
    const safeEmpresaName = campana.empresa.name.replace(/[^a-z0-9]/gi, '_').substring(0, 40);
    const date = new Date().toISOString().split('T')[0];
    const filename = `Informe_Riesgo_Psicosocial_${safeEmpresaName}_${date}.docx`;

    return new NextResponse(docBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': docBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Error al generar el informe', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campanaId: string }> }
) {
  return POST(request, { params });
}