import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { fichaQuestions } from '../../data/surveyData';

export async function generateFichaPDF(participantData: any): Promise<Uint8Array> {
  const fichaData = participantData.surveyResponse?.fichaData || {};
  
  const templatePath = path.join(process.cwd(), 'src', 'templates', '4. Ficha-datos-personales.pdf');
  console.log(`Generating Ficha PDF from: ${templatePath}`);
  const pdfBytes = await fs.readFile(templatePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (const q of fichaQuestions) {
    if (!q.coords || q.coords.length === 0) continue;

    if (q.subfields) {
      // Subfields: text inputs (usually)
      q.subfields.forEach((sf, idx) => {
        const val = String(fichaData[sf.key] || '');
        const coord = q.coords![idx];
        if (coord) {
           const pageIndex = coord.page - 1;
           if (pageIndex >= 0 && pageIndex < pages.length) {
             pages[pageIndex].drawText(val, {
               x: coord.x,
               y: coord.y,
               size: 10,
               font: font,
               color: rgb(0, 0, 0),
             });
           }
        }
      });
    } else if (q.opciones) {
      // Multiple choice: find index of selected option
      // The answer key logic seems to be `ficha_${q.id}` for simple questions
      const answerVal = String(fichaData[`ficha_${q.id}`] || '');
      const optionIndex = q.opciones.findIndex(opt => opt === answerVal);
      
      if (optionIndex !== -1) {
        const coord = q.coords[optionIndex];
        if (coord) {
           const pageIndex = coord.page - 1;
           if (pageIndex >= 0 && pageIndex < pages.length) {
             pages[pageIndex].drawText('X', {
               x: coord.x,
               y: coord.y,
               size: 8, // Small X
               font: fontBold,
               color: rgb(0, 0, 0),
             });
           }
        }
      }
    } else {
      // Simple text/number input
      const val = String(fichaData[`ficha_${q.id}`] || '');
      const coord = q.coords[0];
      if (coord) {
         const pageIndex = coord.page - 1;
         if (pageIndex >= 0 && pageIndex < pages.length) {
           pages[pageIndex].drawText(val, {
             x: coord.x,
             y: coord.y,
             size: 10,
             font: font,
             color: rgb(0, 0, 0),
           });
         }
      }
    }
  }

  return await pdfDoc.save();
}
