import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ParticipantListRow {
  index: number;
  nombresApellidos: string;
  cedula: string;
  forma: string;
  hasCompleted: boolean;
  completedAt: string | null;
}

export interface ParticipantListMeta {
  empresaName: string;
  campanaName: string;
  generatedAt: string;
  totalRegistrados: number;
  totalCompletados: number;
  totalPendientes: number;
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingTop: 35,
    paddingBottom: 50,
    fontSize: 9,
    fontFamily: 'Helvetica',
    lineHeight: 1.3,
  },
  // Header
  headerContainer: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#dc9222',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 3,
  },
  headerDate: {
    fontSize: 8,
    color: '#94a3b8',
    marginTop: 2,
  },
  // Stats row
  statsRow: {
    flexDirection: 'row',
    marginBottom: 14,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 7,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  // Table
  table: {
    width: '100%',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    minHeight: 22,
    backgroundColor: '#1e293b',
    alignItems: 'stretch',
  },
  tableHeaderCell: {
    padding: 5,
    justifyContent: 'center',
  },
  tableHeaderText: {
    fontSize: 8,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 20,
    alignItems: 'stretch',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
  },
  tableRowAlt: {
    backgroundColor: '#f8fafc',
  },
  tableCell: {
    padding: 5,
    justifyContent: 'center',
  },
  tableCellText: {
    fontSize: 8,
    color: '#334155',
  },
  tableCellTextBold: {
    fontSize: 8,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  // Status badges
  badgeCompleted: {
    backgroundColor: '#dcfce7',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  badgeCompletedText: {
    fontSize: 7,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: '#166534',
  },
  badgePending: {
    backgroundColor: '#fef3c7',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  badgePendingText: {
    fontSize: 7,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: '#92400e',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7,
    color: '#94a3b8',
  },
});

/* ------------------------------------------------------------------ */
/*  Column widths                                                      */
/* ------------------------------------------------------------------ */

const COL = {
  index: '6%',
  nombre: '34%',
  cedula: '16%',
  forma: '12%',
  estado: '12%',
  fecha: '20%',
} as const;

/* ------------------------------------------------------------------ */
/*  Document Component                                                 */
/* ------------------------------------------------------------------ */

const ParticipantListDocument = ({
  rows,
  meta,
}: {
  rows: ParticipantListRow[];
  meta: ParticipantListMeta;
}) => (
  <Document>
    <Page size="LETTER" style={styles.page} wrap>
      {/* Header */}
      <View style={styles.headerContainer} fixed>
        <Text style={styles.headerTitle}>Listado de Participantes</Text>
        <Text style={styles.headerSubtitle}>
          {meta.empresaName} — {meta.campanaName}
        </Text>
        <Text style={styles.headerDate}>
          Generado el {meta.generatedAt}
        </Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow} wrap={false}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Registrados</Text>
          <Text style={styles.statValue}>{meta.totalRegistrados}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Completados</Text>
          <Text style={styles.statValue}>{meta.totalCompletados}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Pendientes</Text>
          <Text style={styles.statValue}>{meta.totalPendientes}</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableHeaderRow} fixed>
          <View style={[styles.tableHeaderCell, { width: COL.index }]}>
            <Text style={styles.tableHeaderText}>#</Text>
          </View>
          <View style={[styles.tableHeaderCell, { width: COL.nombre }]}>
            <Text style={styles.tableHeaderText}>Nombres y Apellidos</Text>
          </View>
          <View style={[styles.tableHeaderCell, { width: COL.cedula }]}>
            <Text style={styles.tableHeaderText}>Identificación</Text>
          </View>
          <View style={[styles.tableHeaderCell, { width: COL.forma }]}>
            <Text style={styles.tableHeaderText}>Forma</Text>
          </View>
          <View style={[styles.tableHeaderCell, { width: COL.estado }]}>
            <Text style={styles.tableHeaderText}>Estado</Text>
          </View>
          <View style={[styles.tableHeaderCell, { width: COL.fecha }]}>
            <Text style={styles.tableHeaderText}>Fecha</Text>
          </View>
        </View>

        {/* Table Body */}
        {rows.map((row, idx) => (
          <View
            key={idx}
            style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
            wrap={false}
          >
            <View style={[styles.tableCell, { width: COL.index }]}>
              <Text style={styles.tableCellText}>{row.index}</Text>
            </View>
            <View style={[styles.tableCell, { width: COL.nombre }]}>
              <Text style={styles.tableCellTextBold}>{row.nombresApellidos}</Text>
            </View>
            <View style={[styles.tableCell, { width: COL.cedula }]}>
              <Text style={styles.tableCellText}>{row.cedula}</Text>
            </View>
            <View style={[styles.tableCell, { width: COL.forma }]}>
              <Text style={styles.tableCellText}>{row.forma}</Text>
            </View>
            <View style={[styles.tableCell, { width: COL.estado }]}>
              {row.hasCompleted ? (
                <View style={styles.badgeCompleted}>
                  <Text style={styles.badgeCompletedText}>Completado</Text>
                </View>
              ) : (
                <View style={styles.badgePending}>
                  <Text style={styles.badgePendingText}>Pendiente</Text>
                </View>
              )}
            </View>
            <View style={[styles.tableCell, { width: COL.fecha }]}>
              <Text style={styles.tableCellText}>
                {row.completedAt || '—'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Footer (fixed on every page) */}
      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>
          {meta.empresaName} — {meta.campanaName}
        </Text>
        <Text
          style={styles.footerText}
          render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
        />
      </View>
    </Page>
  </Document>
);

/* ------------------------------------------------------------------ */
/*  Generator function                                                 */
/* ------------------------------------------------------------------ */

export async function generateParticipantListPDF(
  rows: ParticipantListRow[],
  meta: ParticipantListMeta,
): Promise<Uint8Array> {
  const stream = await renderToStream(
    <ParticipantListDocument rows={rows} meta={meta} />,
  );

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(new Uint8Array(Buffer.concat(chunks))));
  });
}
