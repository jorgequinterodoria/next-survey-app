import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const surveyResponse = await prisma.surveyResponse.create({
            data: {
                consentName: body.consentName,
                consentDoc: body.consentDoc,
                consentAccepted: body.consentAccepted,
                formType: body.formType,
                fichaData: body.fichaData,
                intralaboralData: body.intralaboralData,
                extralaboralData: body.extralaboralData,
                estresData: body.estresData,
                filters: body.filters,
            },
        });

        return NextResponse.json({
            success: true,
            data: surveyResponse
        });
    } catch (error) {
        console.error('Error saving survey:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Error al guardar la encuesta'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const responses = await prisma.surveyResponse.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            success: true,
            data: responses
        });
    } catch (error) {
        console.error('Error fetching surveys:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Error al obtener las encuestas'
            },
            { status: 500 }
        );
    }
}