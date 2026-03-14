
import { fillSurveyPDF } from '../src/lib/pdf-generators/pdfTemplateProcessor';
import fs from 'fs/promises';
import path from 'path';

async function test() {
    const dummyData = {
        "1": "siempre",
        "2": "nunca",
        "3": "algunas_veces",
        "4": "siempre",
        "5": "casi_siempre",
        "10": "siempre",
        "122": "nunca"
    };

    try {
        console.log("Filling Intralaboral A...");
        const pdfBytes = await fillSurveyPDF('intralaboral_A', dummyData);
        await fs.writeFile(path.join(process.cwd(), 'scripts/out/filled_intra_a.pdf'), pdfBytes);
        console.log("Done! Check scripts/out/filled_intra_a.pdf");
    } catch (e) {
        console.error(e);
    }
}

test();
