import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { fichaQuestions } from '../../data/surveyData';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
  header: { fontSize: 11, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', backgroundColor: '#e5e7eb', padding: 8 },
  table: { width: '100%', borderTop: 1, borderLeft: 1, borderColor: '#000' },
  row: { flexDirection: 'row', width: '100%' },
  label: { width: '50%', borderBottom: 1, borderRight: 1, borderColor: '#000', backgroundColor: '#f3f4f6', padding: 6, fontWeight: 'bold' },
  value: { width: '50%', borderBottom: 1, borderRight: 1, borderColor: '#000', padding: 6, color: '#111827' },
  subLabel: { width: '50%', borderBottom: 1, borderRight: 1, borderColor: '#000', backgroundColor: '#f9fafb', padding: 6, paddingLeft: 20, fontStyle: 'italic' },
});

const FichaDocument = ({ data }: { data: any }) => {
  const ficha = data.surveyResponse?.fichaData || {};
  
  return (
    <Document>
      <Page size="LETTER" style={styles.page} wrap>
        <Text style={styles.header}>FICHA DE DATOS GENERALES (SOCIODEMOGRÁFICOS Y OCUPACIONALES)</Text>
        
        <View style={styles.table}>
          {fichaQuestions.map(q => {
            if (q.subfields) {
               return (
                 <View key={q.id} wrap={false} style={{ width: '100%' }}>
                   <View style={styles.row}>
                     <Text style={[styles.label, { width: '100%' }]}>{q.id}. {q.texto}</Text>
                   </View>
                   {q.subfields.map(sf => (
                     <View style={styles.row} key={sf.key}>
                       <Text style={styles.subLabel}>{sf.label}</Text>
                       <Text style={styles.value}>{String(ficha[sf.key] || '')}</Text>
                     </View>
                   ))}
                 </View>
               )
            } else {
              return (
                <View style={styles.row} key={q.id} wrap={false}>
                  <Text style={styles.label}>{q.id}. {q.texto}</Text>
                  <Text style={styles.value}>{String(ficha[`ficha_${q.id}`] || '')}</Text>
                </View>
              )
            }
          })}
        </View>

        <Text style={{ marginTop: 30, fontSize: 8, color: '#6b7280', textAlign: 'center' }}>
          Documento digital generado automáticamente equivalente a la copia física original.
        </Text>
      </Page>
    </Document>
  );
};

export async function generateFichaPDF(participantData: any): Promise<Uint8Array> {
  const stream = await renderToStream(<FichaDocument data={participantData} />);
  
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(new Uint8Array(Buffer.concat(chunks))));
  });
}
