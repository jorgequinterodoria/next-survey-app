'use client';

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';

// Tipos básicos para los datos que vienen del backend
interface ParticipantData {
  id: string;
  fichaData: any;
  results: any; // Record<string, { dimension: string, score: number, level: string }>
}

interface RiskDashboardProps {
  participants: ParticipantData[];
}

const RISK_COLORS = {
  'Sin Riesgo': '#22c55e', // Green-500
  'Riesgo Bajo': '#eab308', // Yellow-500
  'Riesgo Medio': '#f97316', // Orange-500
  'Riesgo Alto': '#ef4444', // Red-500
  'Riesgo Muy Alto': '#9333ea', // Purple-600
};

const RISK_ORDER = ['Sin Riesgo', 'Riesgo Bajo', 'Riesgo Medio', 'Riesgo Alto', 'Riesgo Muy Alto'];

export default function RiskDashboard({ participants }: RiskDashboardProps) {
  
  // 1. Distribución por Sexo
  const sexData = useMemo(() => {
    const counts: Record<string, number> = { 'Masculino': 0, 'Femenino': 0, 'No Binario': 0 };
    participants.forEach(p => {
      const sex = p.fichaData?.['ficha_2'];
      if (sex && counts[sex] !== undefined) {
        counts[sex]++;
      } else if (sex) {
          // Fallback or other
          counts[sex] = (counts[sex] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .filter(([_, val]) => val > 0)
      .map(([name, value]) => ({ name, value }));
  }, [participants]);

  // 2. Distribución por Edad
  const ageData = useMemo(() => {
    const ranges = {
      'Menores de 18': 0,
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46+': 0
    };
    const currentYear = new Date().getFullYear();

    participants.forEach(p => {
      const birthYear = parseInt(p.fichaData?.['ficha_3']);
      if (!isNaN(birthYear)) {
        const age = currentYear - birthYear;
        if (age < 18) ranges['Menores de 18']++;
        else if (age <= 25) ranges['18-25']++;
        else if (age <= 35) ranges['26-35']++;
        else if (age <= 45) ranges['36-45']++;
        else ranges['46+']++;
      }
    });

    return Object.entries(ranges).map(([name, value]) => ({ name, value }));
  }, [participants]);

  // 3. Nivel de Estudios
  const educationData = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => {
      const edu = p.fichaData?.['ficha_4'];
      if (edu) {
        counts[edu] = (counts[edu] || 0) + 1;
      }
    });
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1]) // Sort by count desc
        .map(([name, value]) => ({ name, value }));
  }, [participants]);

  // 4. Antigüedad
  const seniorityData = useMemo(() => {
      const counts: Record<string, number> = {};
      participants.forEach(p => {
          const sen = p.fichaData?.['ficha_11']; // Antigüedad en empresa
          if (sen) {
              counts[sen] = (counts[sen] || 0) + 1;
          }
      });
      return Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .map(([name, value]) => ({ name, value }));
  }, [participants]);


  // Helper para procesar riesgos apilados (100%)
  const processStackedRisk = (prefix: string) => {
    const dimensionCounts: Record<string, Record<string, number>> = {};
    
    // Inicializar contadores
    participants.forEach(p => {
        if (!p.results) return;
        Object.entries(p.results).forEach(([key, val]: [string, any]) => {
            if (key.startsWith(prefix)) {
                const dimName = val.dimension;
                if (!dimensionCounts[dimName]) {
                    dimensionCounts[dimName] = {
                        'Sin Riesgo': 0, 'Riesgo Bajo': 0, 'Riesgo Medio': 0, 'Riesgo Alto': 0, 'Riesgo Muy Alto': 0, total: 0
                    };
                }
                const level = val.level || 'Sin Riesgo';
                if (dimensionCounts[dimName][level] !== undefined) {
                    dimensionCounts[dimName][level]++;
                    dimensionCounts[dimName].total++;
                }
            }
        });
    });

    // Convertir a porcentajes para gráfico apilado
    return Object.entries(dimensionCounts).map(([name, counts]) => {
        const row: any = { name };
        RISK_ORDER.forEach(risk => {
            row[risk] = counts.total > 0 ? parseFloat(((counts[risk] / counts.total) * 100).toFixed(1)) : 0;
        });
        return row;
    });
  };

  const intralaboralChartData = useMemo(() => processStackedRisk('Intra -'), [participants]);

  // 6. Resumen General de Riesgo (Comparativo Intra vs Extra vs Estres)
  // Aquí agregamos TODOS los niveles de riesgo encontrados en todas las dimensiones de cada dominio
  const generalRiskData = useMemo(() => {
      const domains = ['Intra', 'Extra', 'Estrés'];
      const data: any[] = [];

      domains.forEach(domain => {
          const counts = { 'Sin Riesgo': 0, 'Riesgo Bajo': 0, 'Riesgo Medio': 0, 'Riesgo Alto': 0, 'Riesgo Muy Alto': 0, total: 0 };
          
          participants.forEach(p => {
              if (!p.results) return;
              Object.entries(p.results).forEach(([key, val]: [string, any]) => {
                  // key ej: "Intra - Liderazgo"
                  if (key.startsWith(domain)) {
                      const level = val.level || 'Sin Riesgo';
                      if (counts[level] !== undefined) {
                          counts[level]++;
                          counts.total++;
                      }
                  }
              });
          });

          // Normalizar a porcentaje del total de DATOS (no de personas, sino de "evaluaciones de dimensión")
          // Esto da una "densidad de riesgo" general
          const row: any = { name: domain === 'Intra' ? 'Intralaboral' : (domain === 'Extra' ? 'Extralaboral' : 'Estrés') };
          RISK_ORDER.forEach(risk => {
               row[risk] = counts.total > 0 ? parseFloat(((counts[risk] / counts.total) * 100).toFixed(1)) : 0;
          });
          data.push(row);
      });
      return data;
  }, [participants]);


  return (
    <div className="space-y-12 p-6 bg-slate-50 min-h-screen">
      
      {/* Sección Demográfica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChartCard title="Distribución por Sexo">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sexData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="value" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribución por Edad">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                 <LabelList dataKey="value" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ChartCard title="Nivel de Estudios">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={educationData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 11}} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]}>
                    <LabelList dataKey="value" position="right" />
                </Bar>
                </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Antigüedad en la Empresa">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={seniorityData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 11}} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]}>
                    <LabelList dataKey="value" position="right" />
                </Bar>
                </BarChart>
            </ResponsiveContainer>
          </ChartCard>
      </div>

      {/* Sección Riesgos */}
      <div className="space-y-8">
          <ChartCard title="Factores Intralaborales (Dimensiones) - Distribución de Riesgo (%)">
             <div className="h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={intralaboralChartData} layout="vertical" margin={{ left: 40, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={180} tick={{fontSize: 11}} />
                        <Tooltip />
                        <Legend />
                        {RISK_ORDER.map((risk) => (
                            <Bar key={risk} dataKey={risk} stackId="a" fill={RISK_COLORS[risk]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
             </div>
          </ChartCard>

          <ChartCard title="Resumen General de Riesgo (%)">
             <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generalRiskData} margin={{ top: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        {RISK_ORDER.map((risk) => (
                            <Bar key={risk} dataKey={risk} fill={RISK_COLORS[risk]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
             </div>
          </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">{title}</h3>
            {children}
        </div>
    );
}
