import fs from 'fs/promises';
import path from 'path';
import PDFParser from 'pdf2json';

async function parsePDFCoords() {
  const dir = path.join(process.cwd(), 'src/templates');
  const file = '1. CONSENTIMIENTO INFORMADO PARA LA EVALUACIÓN DE RIESGOS PSICOSOCIALES.pdf';
  
  const pdfParser = new PDFParser();

  pdfParser.on("pdfParser_dataError", (errData: any) => console.error(errData.parserError));
  pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
    const page = pdfData.formImage.Pages[0];
    const texts = page.Texts;
    
    console.log("Found texts:");
    for (const t of texts) {
      const textString = decodeURIComponent(t.R[0].T);
      if (
        textString.includes('FECHA') || 
        textString.includes('Yo') || 
        textString.includes('Identificado') || 
        textString.includes('empresa') || 
        textString.includes('Firma')
      ) {
        console.log(`Text: "${textString}" | X: ${t.x} | Y: ${t.y}`);
      }
    }
  });

  pdfParser.loadPDF(path.join(dir, file));
}

parsePDFCoords().catch(console.error);
