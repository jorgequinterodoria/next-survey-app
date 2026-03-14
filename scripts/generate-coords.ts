
import fs from 'fs';
import path from 'path';
import PDFParser from 'pdf2json';
import { formaASections, formaBSections, extralaboralSections, estresQuestions, LIKERT_OPTIONS_INTRALABORAL, LIKERT_OPTIONS_EXTRALABORAL, LIKERT_OPTIONS_ESTRES } from '../src/data/surveyData';

// Types
interface Coordinate {
    page: number;
    x: number;
    y: number;
}

interface FormMeta {
    width: number;
    height: number;
}

interface QuestionMap {
    meta?: FormMeta;
    [questionId: string]: {
        [optionValue: string]: Coordinate;
    } | FormMeta | undefined;
}

// Configuration for each form
const FORMS = [
    {
        name: 'intralaboral_A',
        filename: '2. Cuestionarios-de-factores-de-riesgo-psicosociales-intralaboral-forma-A.pdf',
        sections: formaASections,
        options: LIKERT_OPTIONS_INTRALABORAL,
        questionIdPrefix: '', // Questions are just "1", "2"...
    },
    {
        name: 'intralaboral_B',
        filename: '3. Cuestionarios-de-factores-de-riesgo-psicosociales-intralaboral-forma-B.pdf',
        sections: formaBSections,
        options: LIKERT_OPTIONS_INTRALABORAL,
        questionIdPrefix: '',
    },
    {
        name: 'extralaboral',
        filename: '5. Cuestionario-evaluacion-de-factores-de-riesgo-psicosociales-extralaboral.pdf',
        sections: extralaboralSections,
        options: LIKERT_OPTIONS_EXTRALABORAL,
        questionIdPrefix: '',
    },
     {
        name: 'estres',
        filename: '6. Cuestionario-para-la-evaluacion-del-estres.pdf',
        sections: [{ preguntas: estresQuestions }],
        options: LIKERT_OPTIONS_ESTRES,
        questionIdPrefix: '',
    }
];

// Helper to convert pdf2json coords to pdf-lib points (approximate)
// pdf2json uses 72 dpi but has some scaling. Usually x * 24 roughly maps to points, or direct mapping?
// pdf-lib: (0,0) is bottom-left. pdf2json: (0,0) is top-left.
// We need page height to flip Y.
// Let's just output raw pdf2json coords first, then we can calibrate.
// ACTUALLY: pdf-lib (points) = pdf2json_x * k.
// I will output the raw pdf2json X/Y and Page, and we can adjust the renderer later.

async function processForm(formConfig: any) {
    console.log(`Processing ${formConfig.name}...`);
    const filePath = path.join(process.cwd(), 'src/templates', formConfig.filename);
    
    const pdfParser = new PDFParser();
    
    return new Promise<QuestionMap>((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
            const map: QuestionMap = {};
            const pages = pdfData.Pages || pdfData.formImage.Pages;
            
            // Store meta info
            if (pdfData.formImage && pdfData.formImage.Width) {
                 map.meta = {
                     width: pdfData.formImage.Width, // e.g. 25.5
                     height: pages[0].Height || 33 // Estimate or get from page
                 };
            }

            // 1. Flatten all questions
            const allQuestions = formConfig.sections.flatMap((s: any) => s.preguntas);
            
            // 2. Iterate pages to find column headers and questions
            pages.forEach((page: any, pageIndex: number) => {
                const textItems = page.Texts.map((t: any) => ({
                    text: decodeURIComponent(t.R[0].T),
                    x: t.x,
                    y: t.y,
                    w: t.w
                }));

                // Find column headers on this page
                // We look for "Siempre", "Casi siempre", etc.
                const columnX: { [key: string]: number } = {};
                
                formConfig.options.forEach((opt: any) => {
                    // Fuzzy match
                    const matches = textItems.filter((t: any) => 
                        t.text.toLowerCase().includes(opt.label.toLowerCase().substring(0, 5)) // Match first 5 chars
                    );
                    
                    if (matches.length > 0) {
                        // Take the one with the highest Y (lowest on page? No, headers are at top)
                        // Headers are usually at the top of the table.
                        // But wait, there might be multiple tables?
                        // Usually headers are repeated.
                        // Let's take the first occurrence that looks like a header (y < something?)
                        // Or just take the average X if they are aligned.
                        
                        // Let's assume the X coordinate is consistent for the column.
                        // We take the first match.
                        columnX[opt.value] = matches[0].x;
                        
                        // Refinement: Sometimes headers are split ("Casi" "siempre").
                        // This is tricky.
                    }
                });
                
                // Fallback: If we didn't find headers, maybe this page continues a table from previous page?
                // But for now let's see what we find.

                // Find Questions
                allQuestions.forEach((q: any) => {
                    // Look for "ID" or "ID." at start of text
                    // e.g. "1" or "1."
                    // We need to be careful not to match "1" inside a sentence.
                    // Usually the question number is a separate text item or at start.
                    
                    const qIdStr = `${q.id}`;
                    const qIdDot = `${q.id}.`;
                    
                    const qMatch = textItems.find((t: any) => 
                        t.text.trim() === qIdStr || 
                        t.text.trim() === qIdDot ||
                        t.text.startsWith(qIdDot)
                    );

                    if (qMatch) {
                        // Found the question on this page!
                        if (!map[q.id]) map[q.id] = {};
                        
                        // For each option, we need an X coordinate.
                        // If we found headers on this page, use them.
                        // If not, we might need to use headers from previous pages (if layout is consistent).
                        
                        formConfig.options.forEach((opt: any) => {
                             // If we have a column X, use it.
                             // If not, we insert a placeholder.
                             if (columnX[opt.value]) {
                                 // We use the question's Y and the column's X.
                                 // Correction: The checkbox is usually aligned with the column header X
                                 // and the question Y.
                                 // We might need to add an offset.
                                 map[q.id][opt.value] = {
                                     page: pageIndex,
                                     x: columnX[opt.value], // + offset
                                     y: qMatch.y // + offset
                                 };
                             }
                        });
                    }
                });
            });

            resolve(map);
        });

        pdfParser.loadPDF(filePath);
    });
}

async function run() {
    const allMaps: any = {};
    
    for (const form of FORMS) {
        try {
            const map = await processForm(form);
            allMaps[form.name] = map;
            console.log(`Completed ${form.name}: Found ${Object.keys(map).length} questions.`);
        } catch (e) {
            console.error(`Error processing ${form.name}:`, e);
        }
    }
    
    // Save to file
    const outputPath = path.join(process.cwd(), 'src/lib/pdf-generators/coordinate-maps.json');
    fs.writeFileSync(outputPath, JSON.stringify(allMaps, null, 2));
    console.log(`Saved maps to ${outputPath}`);
}

run();
