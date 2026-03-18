'use client';
import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  formaASections, 
  formaBSections, 
  extralaboralSections, 
  estresQuestions, 
  fichaQuestions,
  consentimientoFields,
  LIKERT_OPTIONS_INTRALABORAL,
  LIKERT_OPTIONS_ESTRES,
  LIKERT_OPTIONS_EXTRALABORAL
} from '../data/surveyData';

// Configuración del worker de PDF.js usando CDN compatible con la versión
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const forms = {
  formaA: { name: 'Forma A', data: formaASections, type: 'sections', options: LIKERT_OPTIONS_INTRALABORAL },
  formaB: { name: 'Forma B', data: formaBSections, type: 'sections', options: LIKERT_OPTIONS_INTRALABORAL },
  extralaboral: { name: 'Extralaboral', data: extralaboralSections, type: 'sections', options: LIKERT_OPTIONS_EXTRALABORAL },
  estres: { name: 'Estrés', data: estresQuestions, type: 'questions', options: LIKERT_OPTIONS_ESTRES },
  ficha: { name: 'Ficha de Datos', data: fichaQuestions, type: 'ficha' },
  consentimiento: { name: 'Consentimiento Informado', data: consentimientoFields, type: 'consentimiento' }
};

const PdfMapper = () => {
    const canvasRef = useRef(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [numPages, setNumPages] = useState(1);
    const [pdfSize, setPdfSize] = useState({ width: 0, height: 0 });

    // Local copy of all survey data so we can update and save it
    const [surveyData, setSurveyData] = useState({
        formaASections: JSON.parse(JSON.stringify(formaASections)),
        formaBSections: JSON.parse(JSON.stringify(formaBSections)),
        extralaboralSections: JSON.parse(JSON.stringify(extralaboralSections)),
        estresQuestions: JSON.parse(JSON.stringify(estresQuestions)),
        fichaQuestions: JSON.parse(JSON.stringify(fichaQuestions)),
        consentimientoFields: JSON.parse(JSON.stringify(consentimientoFields))
    });

    const [selectedFormKey, setSelectedFormKey] = useState('formaA');
    const [currentTargetIndex, setCurrentTargetIndex] = useState(0);

    // Generar la lista plana de "targets" (coordenadas a capturar) para el formulario seleccionado
    const targets = useMemo(() => {
        const list = [];
        const formInfo = forms[selectedFormKey];
        let data;
        
        if (formInfo.type === 'sections') {
            data = surveyData[selectedFormKey + 'Sections'];
        } else if (formInfo.type === 'questions') {
            data = surveyData[selectedFormKey + 'Questions'];
        } else if (formInfo.type === 'ficha') {
            data = surveyData['fichaQuestions'];
        } else if (formInfo.type === 'consentimiento') {
            data = surveyData['consentimientoFields'];
        }

        if (formInfo.type === 'sections') {
            data.forEach((section, sIdx) => {
                section.preguntas.forEach((q, qIdx) => {
                    formInfo.options.forEach((opt, oIdx) => {
                        list.push({
                            label: `Sec ${sIdx + 1}, Preg ${q.id}: "${(q.texto || '').substring(0, 30)}..." -> Opción: ${opt.label}`,
                            path: [sIdx, 'preguntas', qIdx, 'coords', oIdx],
                            qId: q.id,
                            existingCoord: q.coords ? q.coords[oIdx] : null
                        });
                    });
                });
            });
        } else if (formInfo.type === 'questions') {
            data.forEach((q, qIdx) => {
                formInfo.options.forEach((opt, oIdx) => {
                    list.push({
                        label: `Preg ${q.id}: "${(q.texto || '').substring(0, 30)}..." -> Opción: ${opt.label}`,
                        path: [qIdx, 'coords', oIdx],
                        qId: q.id,
                        existingCoord: q.coords ? q.coords[oIdx] : null
                    });
                });
            });
        } else if (formInfo.type === 'ficha') {
            data.forEach((q, qIdx) => {
                if (q.subfields) {
                    q.subfields.forEach((sub, oIdx) => {
                        list.push({
                            label: `Ficha ${q.id}: "${(q.texto || '').substring(0, 30)}..." -> Subcampo: ${sub.label}`,
                            path: [qIdx, 'coords', oIdx],
                            qId: q.id,
                            existingCoord: q.coords ? q.coords[oIdx] : null
                        });
                    });
                } else if (q.opciones) {
                    q.opciones.forEach((opt, oIdx) => {
                        list.push({
                            label: `Ficha ${q.id}: "${(q.texto || '').substring(0, 30)}..." -> Opción: ${opt}`,
                            path: [qIdx, 'coords', oIdx],
                            qId: q.id,
                            existingCoord: q.coords ? q.coords[oIdx] : null
                        });
                    });
                } else {
                    list.push({
                        label: `Ficha ${q.id}: "${(q.texto || '').substring(0, 30)}..." -> Campo de texto`,
                        path: [qIdx, 'coords', 0],
                        qId: q.id,
                        existingCoord: q.coords ? q.coords[0] : null
                    });
                }
            });
        } else if (formInfo.type === 'consentimiento') {
            data.forEach((q, qIdx) => {
                list.push({
                    label: `Consentimiento: ${q.label}`,
                    path: [qIdx, 'coords', 0],
                    qId: q.id,
                    existingCoord: q.coords ? q.coords[0] : null
                });
            });
        }
        return list;
    }, [selectedFormKey, surveyData]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = function() {
                const typedarray = new Uint8Array(this.result);
                setPdfFile(typedarray);
            };
            fileReader.readAsArrayBuffer(file);
        }
    };

    useEffect(() => {
        if (!pdfFile) return;
        const loadPdf = async () => {
            const loadingTask = pdfjsLib.getDocument(pdfFile);
            const pdf = await loadingTask.promise;
            setPdfDoc(pdf);
            setNumPages(pdf.numPages);
            setPaginaActual(1);
        };
        loadPdf();
    }, [pdfFile]);

    useEffect(() => {
        if (!pdfDoc) return;
        const renderPage = async () => {
            const page = await pdfDoc.getPage(paginaActual);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = canvasRef.current;
            if (!canvas) return;
            const context = canvas.getContext('2d');

            canvas.height = viewport.height;
            canvas.width = viewport.width;
            setPdfSize({ width: viewport.width, height: viewport.height });

            const renderContext = { canvasContext: context, viewport: viewport };
            await page.render(renderContext).promise;

            // Dibujar coordenadas existentes para la página actual
            targets.forEach(t => {
                if (t.existingCoord && t.existingCoord.page === paginaActual) {
                    context.beginPath();
                    context.arc(
                        t.existingCoord.x * 1.5, 
                        viewport.height - (t.existingCoord.y * 1.5), 
                        5, 0, 2 * Math.PI
                    );
                    context.fillStyle = 'rgba(255, 0, 0, 0.5)';
                    context.fill();
                    context.stroke();
                }
            });
        };
        renderPage();
    }, [pdfDoc, paginaActual, targets]);

    const manejarClic = (e) => {
        if (!pdfDoc) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const xClick = e.clientX - rect.left;
        const yClick = e.clientY - rect.top;

        const scaleFactor = 1.5;
        const pdfX = Math.round(xClick / scaleFactor);
        const pdfY = Math.round((pdfSize.height - yClick) / scaleFactor);

        const currentTarget = targets[currentTargetIndex];
        if (!currentTarget) return;

        // Actualizar state
        const newData = { ...surveyData };
        let formKeyMap;
        
        if (forms[selectedFormKey].type === 'sections') {
            formKeyMap = selectedFormKey + 'Sections';
        } else if (forms[selectedFormKey].type === 'questions') {
            formKeyMap = selectedFormKey + 'Questions';
        } else if (forms[selectedFormKey].type === 'ficha') {
            formKeyMap = 'fichaQuestions';
        } else if (forms[selectedFormKey].type === 'consentimiento') {
            formKeyMap = 'consentimientoFields';
        }

        let currentLevel = newData[formKeyMap];

        const path = currentTarget.path;
        // path ej: [0, 'preguntas', 0, 'coords', 0]
        for (let i = 0; i < path.length - 1; i++) {
            if (path[i] === 'coords') {
                if (!currentLevel['coords']) currentLevel['coords'] = [];
                currentLevel = currentLevel['coords'];
            } else {
                currentLevel = currentLevel[path[i]];
            }
        }
        
        const lastKey = path[path.length - 1];
        if (!currentLevel[lastKey] && path[path.length - 2] === 'coords') {
            // Asegurarse de que el array coords exista si llegamos aquí directamente
        }
        currentLevel[lastKey] = { x: pdfX, y: pdfY, page: paginaActual };

        setSurveyData(newData);

        // Avanzar al siguiente
        if (currentTargetIndex < targets.length - 1) {
            setCurrentTargetIndex(currentTargetIndex + 1);
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch('/api/dev/save-coords', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(surveyData)
            });
            const data = await res.json();
            if (data.success) {
                alert('¡Datos guardados correctamente en surveyData.ts!');
            } else {
                alert('Error al guardar: ' + data.error);
            }
        } catch (err) {
            alert('Error de red al guardar.');
            console.error(err);
        }
    };

    const skipTarget = () => {
        if (currentTargetIndex < targets.length - 1) {
            setCurrentTargetIndex(currentTargetIndex + 1);
        }
    };

    const prevTarget = () => {
        if (currentTargetIndex > 0) {
            setCurrentTargetIndex(currentTargetIndex - 1);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100 p-4 gap-4">
            {/* Panel Izquierdo: Controles */}
            <div className="w-full md:w-1/3 bg-white p-4 shadow-md rounded-lg flex flex-col overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">📍 Mapeador de PDF</h2>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">1. Selecciona el PDF:</label>
                    <input 
                        type="file" 
                        accept="application/pdf" 
                        onChange={handleFileChange} 
                        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">2. Selecciona el Formulario:</label>
                    <select 
                        value={selectedFormKey} 
                        onChange={(e) => {
                            setSelectedFormKey(e.target.value);
                            setCurrentTargetIndex(0);
                        }}
                        className="w-full border p-2 rounded"
                    >
                        {Object.entries(forms).map(([key, form]) => (
                            <option key={key} value={key}>{form.name}</option>
                        ))}
                    </select>
                </div>

                {targets.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <h3 className="font-semibold text-blue-800 mb-2">Objetivo Actual ({currentTargetIndex + 1} / {targets.length}):</h3>
                        <p className="text-sm font-medium">{targets[currentTargetIndex]?.label}</p>
                        <div className="flex gap-2 mt-3">
                            <button onClick={prevTarget} className="px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400">Anterior</button>
                            <button onClick={skipTarget} className="px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400">Saltar</button>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto border p-2 rounded text-xs text-gray-600">
                    <h4 className="font-bold mb-2">Progreso:</h4>
                    {targets.map((t, idx) => (
                        <div 
                            key={idx} 
                            className={`p-1 mb-1 rounded cursor-pointer ${idx === currentTargetIndex ? 'bg-yellow-200 font-bold' : (t.existingCoord ? 'bg-green-100' : '')}`}
                            onClick={() => setCurrentTargetIndex(idx)}
                        >
                            {idx + 1}. {t.label.split('->')[0]} {t.existingCoord ? '✅' : ''}
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                    <button 
                        onClick={handleSave}
                        className="w-full py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700"
                    >
                        Guardar Coordenadas en surveyData.ts
                    </button>
                </div>
            </div>

            {/* Panel Derecho: PDF */}
            <div className="w-full md:w-2/3 flex flex-col items-center bg-gray-200 p-4 rounded-lg overflow-y-auto relative">
                {pdfDoc ? (
                    <>
                        <div className="flex gap-4 mb-4 bg-white p-2 rounded shadow sticky top-0 z-10">
                            <button onClick={() => setPaginaActual(p => Math.max(1, p - 1))} className="px-4 py-1 bg-gray-200 rounded">Ant</button>
                            <span className="py-1">Página {paginaActual} de {numPages}</span>
                            <button onClick={() => setPaginaActual(p => Math.min(numPages, p + 1))} className="px-4 py-1 bg-gray-200 rounded">Sig</button>
                        </div>
                        <div className="relative border-4 border-dashed border-gray-400">
                            <canvas
                                ref={canvasRef}
                                onClick={manejarClic}
                                className="cursor-crosshair shadow-2xl bg-white"
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                        Carga un PDF para comenzar a mapear
                    </div>
                )}
            </div>
        </div>
    );
};

export default PdfMapper;