import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

export async function generateConsentPDF(data: {
  empresaName: string;
  consentName: string;
  consentDoc: string;
  consentSignatureBase64: string;
  date: Date;
}): Promise<Uint8Array> {
  const dir = path.join(process.cwd(), 'src/templates');
  const file = '1. CONSENTIMIENTO INFORMADO PARA LA EVALUACIÓN DE RIESGOS PSICOSOCIALES.pdf';
  
  const pdfBytes = await fs.readFile(path.join(dir, file));
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0]; // Assuming it's a 1-page document
  
  // 1. FECHA (Top right table) ~ Y: 638
  const day = data.date.getDate().toString().padStart(2, '0');
  const month = (data.date.getMonth() + 1).toString().padStart(2, '0');
  const year = data.date.getFullYear().toString();
  
  firstPage.drawText(day, { x: 440, y: 638, size: 10, color: rgb(0, 0, 0) });
  firstPage.drawText(month, { x: 480, y: 638, size: 10, color: rgb(0, 0, 0) });
  firstPage.drawText(year, { x: 525, y: 638, size: 10, color: rgb(0, 0, 0) });

  // 2. NAME (YO, ...___) ~ Y: 605
  firstPage.drawText(data.consentName, { x: 110, y: 605, size: 10, color: rgb(0, 0, 0) });

  // 3. ID (Cedula No. ___) ~ Y: 584
  firstPage.drawText(data.consentDoc, { x: 295, y: 584, size: 10, color: rgb(0, 0, 0) });

  // 4. EMPRESA ~ Y: 498
  firstPage.drawText(data.empresaName, { x: 90, y: 498, size: 10, color: rgb(0, 0, 0) });

  // 5. SIGNATURE & CC AT BOTTOM ~ Y: 145
  if (data.consentSignatureBase64) {
    try {
      const base64Data = data.consentSignatureBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
      const imageBytes = process.env.NEXT_RUNTIME === 'nodejs'
        ? Buffer.from(base64Data, 'base64')
        : Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      const signatureImage = await pdfDoc.embedPng(imageBytes);
      const sigDims = signatureImage.scale(0.15); // scaled down significantly to sit on the line properly

      firstPage.drawImage(signatureImage, {
        x: 120,
        y: 145,
        width: sigDims.width,
        height: sigDims.height,
      });
    } catch (e) {
      console.warn("Could not embed signature image", e);
    }
  }

  // CC Text at the bottom right next to CC___________
  firstPage.drawText(data.consentDoc, { x: 370, y: 145, size: 10, color: rgb(0, 0, 0) });

  return await pdfDoc.save();
}
