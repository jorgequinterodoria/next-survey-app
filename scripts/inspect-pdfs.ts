import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

async function inspectPDFs() {
  const dir = path.join(process.cwd(), 'src/templates');
  const files = await fs.readdir(dir);
  
  for (const file of files) {
    if (!file.endsWith('.pdf')) continue;
    
    console.log(`\n--- Inspecting: ${file} ---`);
    const pdfBytes = await fs.readFile(path.join(dir, file));
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    if (fields.length === 0) {
      console.log('No form fields found.');
    } else {
      console.log(`Found ${fields.length} fields:`);
      fields.forEach(field => {
        const type = field.constructor.name;
        const name = field.getName();
        console.log(`- ${name} (${type})`);
      });
    }
  }
}

inspectPDFs().catch(console.error);
