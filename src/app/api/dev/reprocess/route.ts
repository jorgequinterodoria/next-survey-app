import { prisma } from '@/lib/prisma'
import { processSurvey, flattenResults } from '@/lib/psychometrics'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        // 1. Fetch all responses
        const responses = await prisma.surveyResponse.findMany();
        let updatedCount = 0;

        // 2. Iterate and re-process
        for (const r of responses) {
            // Check if results are missing or in old format (e.g. empty object)
            // Or just force re-process to be safe
            
            const detailedResults = processSurvey(
                (r.formType as 'A' | 'B') || 'A',
                (r.intralaboralData as Record<string, any>) || {},
                (r.extralaboralData as Record<string, any>) || {},
                (r.estresData as Record<string, any>) || {}
            );
            
            const flattened = flattenResults(detailedResults);

            // Update in DB
            // Note: We are storing the detailed structure now in the new system logic, 
            // but the `flattenResults` was used for the frontend old logic maybe?
            // Wait, `processSurveyAnswers` (old) returned a flat structure?
            // No, the new `processSurvey` returns { intralaboral: { domains: ... }, ... }
            // The DB expects `results` field.
            // The export route uses `results.intralaboral.domains`.
            // So we should save `detailedResults` into `results`.
            
            await prisma.surveyResponse.update({
                where: { id: r.id },
                data: {
                    results: detailedResults as any
                }
            });
            
            updatedCount++;
        }

        return NextResponse.json({ 
            success: true, 
            message: `Reprocesadas ${updatedCount} encuestas correctamente.` 
        });

    } catch (error: any) {
        console.error('Reprocessing error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
