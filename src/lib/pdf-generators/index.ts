import { PDFDocument } from 'pdf-lib';
import { generateConsentPDF } from './consentGenerator';
import { generateFichaPDF } from './fichaGenerator';
import { fillSurveyPDF } from './pdfTemplateProcessor';
import { generateResultsReportPDF } from './resultsReportGenerator';

export async function generateConsolidatedPDF(participantData: any) {
  // 1. Create a fresh empty PDFDocument to act as our final consolidated file
  const finalPdf = await PDFDocument.create();

  // Helper function to append pdf bytes to the final document
  const appendPdf = async (pdfBytes: Uint8Array) => {
    const docToAppend = await PDFDocument.load(pdfBytes);
    const pages = await finalPdf.copyPages(docToAppend, docToAppend.getPageIndices());
    pages.forEach(page => finalPdf.addPage(page));
  };

  try {
    // 2. Consentimiento Informado (pdf-lib mapping over template)
    const consentBytes = await generateConsentPDF({
      empresaName: participantData.campana?.empresa?.name || '',
      consentName: participantData.surveyResponse?.consentName || '',
      consentDoc: participantData.surveyResponse?.consentDoc || '',
      consentCity: (participantData.surveyResponse?.fichaData as any)?.ciudad_trabajo || participantData.campana?.empresa?.city || 'Montería',
      consentSignatureBase64: participantData.surveyResponse?.consentSignature || '',
      date: participantData.surveyResponse?.createdAt || new Date(),
    });
    await appendPdf(consentBytes);

    // 3. Ficha de Datos Personales
    if (participantData.surveyResponse?.fichaData) {
      const fichaBytes = await generateFichaPDF(participantData);
      await appendPdf(fichaBytes);
    }

    // 4. Intralaboral (Form Type A or B logic)
    if (participantData.surveyResponse?.intralaboralData) {
      const isFormA = participantData.surveyResponse?.formType === 'A';
      const formType = isFormA ? 'intralaboral_A' : 'intralaboral_B';
      const intraBytes = await fillSurveyPDF(
        formType,
        participantData.surveyResponse.intralaboralData
      );
      await appendPdf(intraBytes);
      
      // Adjuntar INFORME DE RESULTADOS INTRALABORAL
      const intraResultsBytes = await generateResultsReportPDF(participantData, 'intralaboral');
      await appendPdf(intraResultsBytes);
    }

    // 5. Extralaboral
    if (participantData.surveyResponse?.extralaboralData) {
      const extraBytes = await fillSurveyPDF(
        'extralaboral',
        participantData.surveyResponse.extralaboralData
      );
      await appendPdf(extraBytes);

      // Adjuntar INFORME DE RESULTADOS EXTRALABORAL
      const extraResultsBytes = await generateResultsReportPDF(participantData, 'extralaboral');
      await appendPdf(extraResultsBytes);
    }

    // 6. Estrés
    if (participantData.surveyResponse?.estresData) {
      const estresBytes = await fillSurveyPDF(
        'estres',
        participantData.surveyResponse.estresData
      );
      await appendPdf(estresBytes);

      // Adjuntar INFORME DE RESULTADOS ESTRÉS
      const estresResultsBytes = await generateResultsReportPDF(participantData, 'estres');
      await appendPdf(estresResultsBytes);
    }
  } catch(e) {
    console.error("Error assembling consolidated PDF components:");
    console.error(e);
    if (e instanceof Error) {
        console.error("Message:", e.message);
        console.error("Stack:", e.stack);
    }
    throw e;
  }

  // 7. Serialize final PDF document
  const finalPdfBytes = await finalPdf.save();
  return finalPdfBytes;
}
