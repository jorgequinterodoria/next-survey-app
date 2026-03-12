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

  // Test lines and markers to find exact positions
  const drawCross = (x: number, y: number, label: string) => {
    firstPage.drawText(label, { x: x + 2, y: y + 2, size: 8, color: rgb(1,0,0) });
    firstPage.drawLine({ start: { x: x - 5, y }, end: { x: x + 5, y }, thickness: 1, color: rgb(1,0,0) });
    firstPage.drawLine({ start: { x, y: y - 5 }, end: { x, y: y + 5 }, thickness: 1, color: rgb(1,0,0) });
  };

  // Top Table: Date
  // Try around Y: 600-650? In the original it's below the title
  drawCross(400, 640, 'D1');
  drawCross(450, 640, 'M1');
  drawCross(500, 640, 'Y1');

  // "Yo, _________"
  // Try Y: 560-590
  drawCross(150, 580, 'Nombre');

  // "Identificado con documento ... No. ________ de: _______"
  drawCross(300, 550, 'CC');
  drawCross(500, 550, 'Lug');

  // "En condicion de trabajador de la empresa _________"
  drawCross(280, 500, 'Empresa');

  // "Firma: _________ CC ________"
  // Try Y: 100-150
  drawCross(150, 100, 'Sig');
  drawCross(400, 100, 'CC2');

  // Save
  const outDir = path.join(process.cwd(), 'scripts/out');
  await fs.mkdir(outDir, { recursive: true });
  const pdfResult = await pdfDoc.save();
  await fs.writeFile(path.join(outDir, 'consent_test_2.pdf'), pdfResult);
  console.log('Saved to scripts/out/consent_test_2.pdf');
}

testConsentFilling().catch(console.error);
