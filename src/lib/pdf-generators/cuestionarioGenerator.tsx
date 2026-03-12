import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { 
  formaASections, 
  formaBSections, 
  extralaboralSections, 
  estresQuestions,
  LIKERT_OPTIONS_INTRALABORAL,
  LIKERT_OPTIONS_EXTRALABORAL,
  LIKERT_OPTIONS_ESTRES
} from '../../data/surveyData';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 8, fontFamily: 'Helvetica' },
  header: { fontSize: 11, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', textTransform: 'uppercase' },
  sectionTitle: { fontSize: 9, fontWeight: 'bold', marginTop: 15, marginBottom: 5, backgroundColor: '#e5e7eb', padding: 4 },
  instruction: { fontSize: 8, marginBottom: 8, fontStyle: 'italic', color: '#374151' },
  table: { width: '100%', borderTop: 1, borderLeft: 1, borderColor: '#000' },
  tableRow: { flexDirection: 'row' },
  tableColQuestionHeader: { width: '50%', borderBottom: 1, borderRight: 1, borderColor: '#000', backgroundColor: '#e5e7eb', padding: 4, textAlign: 'center', fontWeight: 'bold' },
  tableColOptionHeader: { borderBottom: 1, borderRight: 1, borderColor: '#000', backgroundColor: '#e5e7eb', padding: 4, textAlign: 'center', fontSize: 7, fontWeight: 'bold' },
  tableColQuestion: { width: '50%', borderBottom: 1, borderRight: 1, borderColor: '#000', padding: 4 },
  tableColOption: { borderBottom: 1, borderRight: 1, borderColor: '#000', padding: 4, textAlign: 'center', fontFamily: 'Helvetica-Bold' },
});

const SurveyTable = ({ sectionTitle, sectionKey, instruction, questions, options, data, isEstres }: any) => {
  const optionWidth = `${50 / options.length}%`;
  
  return (
    <View wrap={false} style={{ marginBottom: 10 }}>
      {sectionTitle ? <Text style={styles.sectionTitle}>{sectionTitle}</Text> : null}
      {instruction ? <Text style={styles.instruction}>{instruction}</Text> : null}
      
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColQuestionHeader}><Text>PREGUNTA</Text></View>
          {options.map((opt: any) => (
            <View key={opt.value} style={[styles.tableColOptionHeader, { width: optionWidth }]}>
              <Text>{opt.label}</Text>
            </View>
          ))}
        </View>

        {questions.map((q: any) => {
          const dataKey = isEstres ? `estres_${q.id}` : `${sectionKey}_${q.id}`;
          const rawAnswer = data[dataKey];
          const answer = typeof rawAnswer === 'object' && rawAnswer !== null ? rawAnswer.answer : rawAnswer;
          
          return (
            <View style={styles.tableRow} key={q.id} wrap={false}>
              <View style={styles.tableColQuestion}><Text>{q.id}. {q.texto}</Text></View>
              {options.map((opt: any) => (
                <View key={opt.value} style={[styles.tableColOption, { width: optionWidth }]}>
                  <Text>{answer === opt.value ? 'X' : ''}</Text>
                </View>
              ))}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const CuestionarioDocument = ({ title, data, surveyType }: { title: string, data: any, surveyType: string }) => {
  let sections: any[] = [];
  let options: any[] = [];

  if (surveyType === 'intralaboral_A') {
    sections = formaASections;
    options = LIKERT_OPTIONS_INTRALABORAL;
  } else if (surveyType === 'intralaboral_B') {
    sections = formaBSections;
    options = LIKERT_OPTIONS_INTRALABORAL;
  } else if (surveyType === 'extralaboral') {
    sections = extralaboralSections;
    options = LIKERT_OPTIONS_EXTRALABORAL;
  } else if (surveyType === 'estres') {
    sections = [{ key: 'estres', titulo: '', instruccion: '', preguntas: estresQuestions }];
    options = LIKERT_OPTIONS_ESTRES;
  }

  return (
    <Document>
      <Page size="LETTER" style={styles.page} wrap>
        <Text style={styles.header}>{title}</Text>
        
        {sections.map(sec => (
          <SurveyTable 
            key={sec.key} 
            sectionKey={sec.key}
            sectionTitle={sec.titulo} 
            instruction={sec.instruccion} 
            questions={sec.preguntas} 
            options={options} 
            data={data} 
            isEstres={surveyType === 'estres'}
          />
        ))}

        <Text style={{ marginTop: 20, fontSize: 8, color: '#6b7280', textAlign: 'center' }}>
          Documento digital generado automáticamente equivalente a la copia física original.
        </Text>
      </Page>
    </Document>
  );
};

export async function generateCuestionarioPDF(
  title: string, 
  data: any, 
  surveyType: 'intralaboral_A' | 'intralaboral_B' | 'extralaboral' | 'estres'
): Promise<Uint8Array> {
  const stream = await renderToStream(<CuestionarioDocument title={title} data={data} surveyType={surveyType} />);
  
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(new Uint8Array(Buffer.concat(chunks))));
  });
}
