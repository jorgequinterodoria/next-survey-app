
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { 
  formaASections, 
  formaBSections, 
  extralaboralSections, 
  estresQuestions,
  LIKERT_OPTIONS_INTRALABORAL,
  LIKERT_OPTIONS_EXTRALABORAL,
  LIKERT_OPTIONS_ESTRES
} from '../../data/surveyData';

export async function fillSurveyPDF(
    formType: 'intralaboral_A' | 'intralaboral_B' | 'extralaboral' | 'estres',
    data: any
): Promise<Uint8Array> {
    let filename = '';
    let sections: any[] = [];
    let optionsList: any[] = [];
    let isEstres = false;

    switch (formType) {
        case 'intralaboral_A':
            filename = '2. Cuestionarios-de-factores-de-riesgo-psicosociales-intralaboral-forma-A.pdf';
            sections = formaASections;
            optionsList = LIKERT_OPTIONS_INTRALABORAL;
            break;
        case 'intralaboral_B':
            filename = '3. Cuestionarios-de-factores-de-riesgo-psicosociales-intralaboral-forma-B.pdf';
            sections = formaBSections;
            optionsList = LIKERT_OPTIONS_INTRALABORAL;
            break;
        case 'extralaboral':
            filename = '5. Cuestionario-evaluacion-de-factores-de-riesgo-psicosociales-extralaboral.pdf';
            sections = extralaboralSections;
            optionsList = LIKERT_OPTIONS_EXTRALABORAL;
            break;
        case 'estres':
            filename = '6. Cuestionario-para-la-evaluacion-del-estres.pdf';
            sections = [{ preguntas: estresQuestions }];
            optionsList = LIKERT_OPTIONS_ESTRES;
            isEstres = true;
            break;
    }

    const templatePath = path.join(process.cwd(), 'src/templates', filename);
    const pdfBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica); // Usar fuente normal para la X

    // Aplanar las preguntas para búsqueda rápida
    const questionsMap = new Map();
    sections.forEach(sec => {
        sec.preguntas.forEach((q: any) => {
            questionsMap.set(q.id.toString(), q);
        });
    });

    for (const [key, value] of Object.entries(data)) {
        // La llave puede ser "1", "intralaboral_A_1", etc.
        const parts = key.split('_');
        const qId = parts[parts.length - 1];
        
        const question = questionsMap.get(qId);
        if (!question || !question.coords) continue;

        const answerVal = (typeof value === 'object' && value !== null && 'answer' in value) 
            ? (value as any).answer 
            : value;
            
        if (!answerVal) continue;

        // Encontrar el índice de la opción seleccionada
        const optionIndex = optionsList.findIndex(opt => opt.value === answerVal);
        
        if (optionIndex !== -1 && question.coords[optionIndex]) {
            const coord = question.coords[optionIndex];
            
            // Validar que la página exista (coord.page es 1-based, array es 0-based)
            const pageIndex = coord.page - 1;
            if (pageIndex >= 0 && pageIndex < pages.length) {
                const page = pages[pageIndex];
                
                // Dibujar la X pequeña
                page.drawText('X', {
                    x: coord.x, // Ajuste fino si es necesario (centrado)
                    y: coord.y, 
                    size: 8, // Tamaño reducido como pidió el usuario
                    font: font,
                    color: rgb(0, 0, 0),
                });
            }
        }
    }

    return await pdfDoc.save();
}
