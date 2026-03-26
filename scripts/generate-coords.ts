
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


const FORMS = [
    {
        name: 'intralaboral_A',
        filename: '2. Cuestionarios-de-factores-de-riesgo-psicosociales-intralaboral-forma-A.pdf',
        sections: formaASections,
        options: LIKERT_OPTIONS_INTRALABORAL,
        questionIdPrefix: '',
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

async function processForm(formConfig: any) {
    console.log(`Processing ${formConfig.name}...`);
    const filePath = path.join(process.cwd(), 'src/templates', formConfig.filename);
    
    const pdfParser = new PDFParser();
    
    return new Promise<QuestionMap>((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
            const map: QuestionMap = {};
            const pages = pdfData.Pages || pdfData.formImage.Pages;
            
            if (pdfData.formImage && pdfData.formImage.Width) {
                 map.meta = {
                     width: pdfData.formImage.Width,
                     height: pages[0].Height || 33
                 };
            }

            const allQuestions = formConfig.sections.flatMap((s: any) => s.preguntas);
            
            pages.forEach((page: any, pageIndex: number) => {
                const textItems = page.Texts.map((t: any) => ({
                    text: decodeURIComponent(t.R[0].T),
                    x: t.x,
                    y: t.y,
                    w: t.w
                }));

                const columnX: { [key: string]: number } = {};
                
                formConfig.options.forEach((opt: any) => {
                    const matches = textItems.filter((t: any) => 
                        t.text.toLowerCase().includes(opt.label.toLowerCase().substring(0, 5))
                    );
                    
                    if (matches.length > 0) {
                        columnX[opt.value] = matches[0].x;
                    }
                });
                
                allQuestions.forEach((q: any) => {
                    const qIdStr = `${q.id}`;
                    const qIdDot = `${q.id}.`;
                    
                    const qMatch = textItems.find((t: any) => 
                        t.text.trim() === qIdStr || 
                        t.text.trim() === qIdDot ||
                        t.text.startsWith(qIdDot)
                    );

                    if (qMatch) {
                        if (!map[q.id]) map[q.id] = {};
                        const qEntry = map[q.id] as { [key: string]: Coordinate };
                        
                        formConfig.options.forEach((opt: any) => {
                             if (columnX[opt.value]) {
                                 qEntry[opt.value] = {
                                     page: pageIndex,
                                     x: columnX[opt.value],
                                     y: qMatch.y
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
    
    const outputPath = path.join(process.cwd(), 'src/lib/pdf-generators/coordinate-maps.json');
    fs.writeFileSync(outputPath, JSON.stringify(allMaps, null, 2));
    console.log(`Saved maps to ${outputPath}`);
}

run();
