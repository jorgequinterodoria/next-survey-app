
import fs from 'fs';
import path from 'path';
import PDFParser from 'pdf2json';

const pdfParser = new PDFParser();

const filePath = path.join(process.cwd(), 'src/templates', '2. Cuestionarios-de-factores-de-riesgo-psicosociales-intralaboral-forma-A.pdf');

pdfParser.on("pdfParser_dataError", (errData: any) => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
    // Inspect the structure first
    console.log("pdfData keys:", Object.keys(pdfData));
    if (pdfData.formImage) {
        console.log("formImage found");
        const page = pdfData.formImage.Pages[0];
        const texts = page.Texts.map((t: any) => ({
            text: decodeURIComponent(t.R[0].T),
            x: t.x,
            y: t.y
        }));
        console.log("--- Extracted Text Sample (Page 1) ---");
        texts.slice(0, 50).forEach((t: any) => console.log(`Text: "${t.text}" at (${t.x}, ${t.y})`));
    } else if (pdfData.Pages) {
         console.log("Pages found directly");
         const page = pdfData.Pages[0];
         const texts = page.Texts.map((t: any) => ({
            text: decodeURIComponent(t.R[0].T),
            x: t.x,
            y: t.y
        }));
        console.log("--- Extracted Text Sample (Page 1) ---");
        texts.slice(0, 50).forEach((t: any) => console.log(`Text: "${t.text}" at (${t.x}, ${t.y})`));
    } else {
        console.log("Could not find Pages array");
    }
});

pdfParser.loadPDF(filePath);
