import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { consentimientoFields } from '@/data/surveyData';

export async function generateConsentPDF(data: {
  empresaName: string;
  consentName: string;
  consentDoc: string;
  consentCity: string;
  consentSignatureBase64: string;
  date: Date;
}): Promise<Uint8Array> {
  const dir = path.join(process.cwd(), 'src', 'templates');
  const file = '1. CONSENTIMIENTO INFORMADO PARA LA EVALUACION DE RIESGOS PSICOSOCIALES.pdf';
  
  const filePath = path.join(dir, file);
  console.log(`Generating Consent PDF from: ${filePath}`);
  
  const pdfBytes = await fs.readFile(filePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0]; 

  const getCoords = (id: string) => {
    const field = consentimientoFields.find(f => f.id === id);
    if (field && field.coords && field.coords.length > 0) {
      // PdfMapper guarda las coordenadas con el origen (0,0) en la esquina superior izquierda.
      // pdf-lib usa el origen (0,0) en la esquina inferior izquierda.
      // Por lo tanto, debemos invertir el eje Y: pdfLibY = pageHeight - mappedY
      // Además, PdfMapper usa un scaleFactor de 1.5, así que debemos ajustar si es necesario.
      // Sin embargo, PdfMapper YA guarda las coordenadas divididas por el scaleFactor (puntos PDF).
      // Lo único que hace PdfMapper es: pdfY = (height - yClick) / scale. 
      // O sea, PdfMapper guarda la coordenada Y desde abajo (sistema PDF).
      // Vamos a verificar cómo guarda PdfMapper:
      // const pdfY = Math.round((pdfSize.height - yClick) / scaleFactor);
      // Esto significa que 'pdfY' ya está en el sistema de coordenadas de PDF (desde abajo).
      // Entonces NO necesitamos invertir Y nuevamente.
      
      return field.coords[0];
    }
    return null;
  };

  const drawField = (id: string, text: string) => {
    const coords = getCoords(id);
    if (coords) {
      firstPage.drawText(text || '', {
        x: coords.x,
        y: coords.y,
        size: 10,
        color: rgb(0, 0, 0),
      });
    }
  };

  // 1. FECHA
  const day = data.date.getDate().toString().padStart(2, '0');
  const month = (data.date.getMonth() + 1).toString().padStart(2, '0');
  const year = data.date.getFullYear().toString();
  
  drawField('fecha_dia', day);
  drawField('fecha_mes', month);
  drawField('fecha_ano', year);

  // 2. CIUDAD
  drawField('ciudad', data.consentCity);

  // 3. NAME
  drawField('nombre', data.consentName);

  // 4. ID (Cedula 1)
  drawField('cedula_1', data.consentDoc);

  // 5. EMPRESA
  drawField('empresa', data.empresaName);

  // 6. SIGNATURE
  if (data.consentSignatureBase64) {
    try {
      const base64Data = data.consentSignatureBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
      const imageBytes = process.env.NEXT_RUNTIME === 'nodejs'
        ? Buffer.from(base64Data, 'base64')
        : Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      const signatureImage = await pdfDoc.embedPng(imageBytes);
      const sigDims = signatureImage.scale(0.15);
      
      const coords = getCoords('firma');
      if (coords) {
        firstPage.drawImage(signatureImage, {
          x: coords.x,
          y: coords.y,
          width: sigDims.width,
          height: sigDims.height,
        });
      }
    } catch (e) {
      console.warn("Could not embed signature image", e);
    }
  }

  // 7. ID (Cedula 2)
  drawField('cedula_2', data.consentDoc);

  return await pdfDoc.save();
}
