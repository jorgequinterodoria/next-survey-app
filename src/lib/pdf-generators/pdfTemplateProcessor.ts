
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import coordinateMaps from './coordinate-maps.json';

// Types for our coordinate map
interface Coordinate {
    page: number;
    x: number;
    y: number;
}

interface FormMeta {
    width: number;
    height: number;
}

interface QuestionMap {
    meta?: FormMeta;
    [questionId: string]: {
        [optionValue: string]: Coordinate;
    } | FormMeta | undefined;
}

const MAPS = coordinateMaps as Record<string, QuestionMap>;

// Scaling factors based on our discovery
// pdf2json x * 24 ~= pdf-lib x (points)
// pdf-lib y = 792 - (pdf2json y * 24)
const SCALE_X = 24.3; // Calibrated to ~25.2 * X = 612? No. 612/25.5 = 24. 
// Let's use 24 as a baseline.
const SCALE_Y = 24.3; 
const PAGE_HEIGHT = 792;

export async function fillSurveyPDF(
    formType: 'intralaboral_A' | 'intralaboral_B' | 'extralaboral' | 'estres',
    data: any
): Promise<Uint8Array> {
    const map = MAPS[formType];
    if (!map) {
        throw new Error(`No coordinate map found for form type: ${formType}`);
    }

    // Determine filename
    let filename = '';
    switch (formType) {
        case 'intralaboral_A':
            filename = '2. Cuestionarios-de-factores-de-riesgo-psicosociales-intralaboral-forma-A.pdf';
            break;
        case 'intralaboral_B':
            filename = '3. Cuestionarios-de-factores-de-riesgo-psicosociales-intralaboral-forma-B.pdf';
            break;
        case 'extralaboral':
            filename = '5. Cuestionario-evaluacion-de-factores-de-riesgo-psicosociales-extralaboral.pdf';
            break;
        case 'estres':
            filename = '6. Cuestionario-para-la-evaluacion-del-estres.pdf';
            break;
    }

    const templatePath = path.join(process.cwd(), 'src/templates', filename);
    const pdfBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Iterate through data and fill
    // data is likely keyed by question ID, e.g. "1": "siempre" or "1": { answer: "siempre" }
    
    for (const [key, value] of Object.entries(data)) {
        // Extract question ID. keys might be "intralaboral_A_1" or just "1"
        // The data passed here should ideally be just the question data part
        // e.g. { "1": "siempre", "2": "nunca" }
        
        // Handle nested object structure if present
        const answerVal = (typeof value === 'object' && value !== null && 'answer' in value) 
            ? (value as any).answer 
            : value;

        if (!answerVal) continue;

        // Clean key to get ID
        // If data comes from SurveyResponse.intralaboralData, keys are likely just "1", "2" or maybe "intralaboral_A_1"
        // Let's assume the key is the ID or ends with it.
        const parts = key.split('_');
        const qId = parts[parts.length - 1]; // "1" from "intralaboral_A_1"

        const qMap = map[qId];
        if (!qMap) continue; // Question not in map

        // qMap has keys for options: "siempre", "casi_siempre", etc.
        const coords = (qMap as any)[answerVal];
        
        if (coords) {
            const pageIndex = coords.page;
            if (pageIndex < pages.length) {
                const page = pages[pageIndex];
                
                // Calculate coordinates
                // pdf2json Y is from top. pdf-lib Y is from bottom.
                // We need to verify if the page height matches standard 792.
                // For now, assume 792.
                
                const x = coords.x * SCALE_X;
                const y = PAGE_HEIGHT - (coords.y * SCALE_Y);
                
                // Draw X
                // Adjust to center the X. 
                // The calculated point is likely the top-left of the text found by pdf2json.
                // We might need to shift slightly right and down.
                page.drawText('X', {
                    x: x + 2, // Shift right slightly
                    y: y - 2, // Shift down slightly (since y is bottom-up, minus goes down)
                    size: 10,
                    font: font,
                    color: rgb(0, 0, 0),
                });
            }
        }
    }

    return await pdfDoc.save();
}
