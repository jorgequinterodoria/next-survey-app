import { PDFDocument } from 'pdf-lib';
import { generateConsentPDF } from './consentGenerator';
import { generateFichaPDF } from './fichaGenerator';
import { fillSurveyPDF } from './pdfTemplateProcessor';

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
      consentCity: (participantData.surveyResponse?.fichaData as any)?.ciudad_trabajo || participantData.campana?.empresa?.city || 'Bogotá',
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
    }

    // 5. Extralaboral
    if (participantData.surveyResponse?.extralaboralData) {
      const extraBytes = await fillSurveyPDF(
        'extralaboral',
        participantData.surveyResponse.extralaboralData
      );
      await appendPdf(extraBytes);
    }

    // 6. Estrés
    if (participantData.surveyResponse?.estresData) {
      const estresBytes = await fillSurveyPDF(
        'estres',
        participantData.surveyResponse.estresData
      );
      await appendPdf(estresBytes);
    }
  } catch(e) {
    console.error("Error assembling consolidated PDF components:", e);
    throw e;
  }

  // 7. Serialize final PDF document
  const finalPdfBytes = await finalPdf.save();
  return finalPdfBytes;
}
