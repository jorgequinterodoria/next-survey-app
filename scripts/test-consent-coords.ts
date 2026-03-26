import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

async function testConsentFilling() {
  const dir = path.join(process.cwd(), 'src/templates');
  const file = '1. CONSENTIMIENTO INFORMADO PARA LA EVALUACIÓN DE RIESGOS PSICOSOCIALES.pdf';
  
  const pdfBytes = await fs.readFile(path.join(dir, file));
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  console.log(`Page dimensions: ${width} x ${height}`);


  firstPage.drawText('X: 100, Y: 100', { x: 100, y: 100, size: 10, color: rgb(1,0,0) });
  firstPage.drawText('X: 100, Y: 150', { x: 100, y: 150, size: 10, color: rgb(1,0,0) });
  firstPage.drawText('X: 100, Y: 200', { x: 100, y: 200, size: 10, color: rgb(1,0,0) });
  firstPage.drawText('X: 300, Y: 100', { x: 300, y: 100, size: 10, color: rgb(1,0,0) });
  firstPage.drawText('X: 300, Y: 150', { x: 300, y: 150, size: 10, color: rgb(1,0,0) });
  firstPage.drawText('X: 300, Y: 200', { x: 300, y: 200, size: 10, color: rgb(1,0,0) });
  
  const outDir = path.join(process.cwd(), 'scripts/out');
  await fs.mkdir(outDir, { recursive: true });
  const pdfResult = await pdfDoc.save();
  await fs.writeFile(path.join(outDir, 'consent_test.pdf'), pdfResult);
  console.log('Saved to scripts/out/consent_test.pdf');
}

testConsentFilling().catch(console.error);
