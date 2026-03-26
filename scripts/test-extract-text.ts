
import path from 'path';
import PDFParser from 'pdf2json';

const pdfParser = new PDFParser();

const filePath = path.join(process.cwd(), 'src/templates', '2. Cuestionarios-de-factores-de-riesgo-psicosociales-intralaboral-forma-A.pdf');

pdfParser.on("pdfParser_dataError", (errData: any) => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
    if (pdfData.formImage) {
        const page = pdfData.formImage.Pages[0];
        const texts = page.Texts.map((t: any) => ({
            text: decodeURIComponent(t.R[0].T),
            x: t.x,
            y: t.y
        }));
        texts.slice(0, 50).forEach((t: any) => console.log(`Text: "${t.text}" at (${t.x}, ${t.y})`));
    } else if (pdfData.Pages) {
         const page = pdfData.Pages[0];
         const texts = page.Texts.map((t: any) => ({
            text: decodeURIComponent(t.R[0].T),
            x: t.x,
            y: t.y
        }));
        texts.slice(0, 50).forEach((t: any) => console.log(`Text: "${t.text}" at (${t.x}, ${t.y})`));
    } else {
        console.log("Could not find Pages array");
    }
});

pdfParser.loadPDF(filePath);
