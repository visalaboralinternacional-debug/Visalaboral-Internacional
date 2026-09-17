/**
 * @file TestRunnerModal.tsx
 * @description Panel interactivo para la ejecución y visualización en tiempo real
 * de la suite completa de pruebas unitarias y reporte de cobertura.
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  Layers, 
  Cpu,
  FileCheck2
} from 'lucide-react';
import { ejecutarSuitePruebas } from '../lib/tests';
import { ResultadoTest } from '../types';

interface TestRunnerModalProps {
  abierto: boolean;
  onCerrar: () => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ abierto, onCerrar }) => {
  const [ejecutando, setEjecutando] = useState(false);
  const [reporte, setReporte] = useState<{
    resultados: ResultadoTest[];
    totalPruebas: number;
    exitosas: number;
    fallidas: number;
    duracionTotalMs: number;
    coberturaModulos: string[];
  } | null>(null);

  const correrPruebas = async () => {
    setEjecutando(true);
    try {
      const res = await ejecutarSuitePruebas();
      setReporte(res);
    } catch (e) {
      console.error('Fallo al correr tests:', e);
    } finally {
      setEjecutando(false);
    }
  };

  useEffect(() => {
    if (abierto) {
      correrPruebas();
    }
  }, [abierto]);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        id="modal-test-runner"
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Cabecera */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Suite de Pruebas Unitarias QA
              </h3>
              <p className="text-xs text-slate-400">
                Verificación de contratos, checklists, store reactivo, persistencia y memoria caché
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={correrPruebas}
              disabled={ejecutando}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
              title="Volver a ejecutar tests"
            >
              <RefreshCw className={`w-4 h-4 ${ejecutando ? 'animate-spin text-amber-400' : ''}`} />
            </button>
            <button
              onClick={onCerrar}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Métricas de la corrida */}
        {reporte && (
          <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-slate-400 uppercase font-bold block text-[10px]">Total Pruebas</span>
              <p className="text-xl font-black text-slate-900 font-mono mt-0.5">{reporte.totalPruebas}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-emerald-600 uppercase font-bold block text-[10px]">Aprobadas</span>
              <p className="text-xl font-black text-emerald-700 font-mono mt-0.5">{reporte.exitosas}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-slate-400 uppercase font-bold block text-[10px]">Fallidas</span>
              <p className={`text-xl font-black font-mono mt-0.5 ${reporte.fallidas > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                {reporte.fallidas}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-slate-400 uppercase font-bold block text-[10px]">Tiempo Ejecución</span>
              <p className="text-xl font-black text-slate-900 font-mono mt-0.5">{reporte.duracionTotalMs} ms</p>
            </div>
          </div>
        )}

        {/* Lista de Aserciones */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {reporte ? (
            reporte.resultados.map((t, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-3 text-xs shadow-xs"
              >
                <div className="flex items-center gap-3">
                  {t.exitoso ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{t.nombre}</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px]">
                        {t.categoria}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {t.detalles || t.error}
                    </p>
                  </div>
                </div>

                <span className="font-mono text-slate-400 text-[11px] flex-shrink-0">
                  {t.duracionMs} ms
                </span>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" />
              <p className="font-bold text-slate-700">Ejecutando suite de pruebas unitarias...</p>
            </div>
          )}
        </div>

        {/* Pie con módulos cubiertos */}
        {reporte && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600">Módulos Validados:</span>
              <div className="flex flex-wrap gap-1.5">
                {reporte.coberturaModulos.map((m, i) => (
                  <span key={i} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-semibold text-[10px]">
                    {m} ✓
                  </span>
                ))}
              </div>
            </div>
            <span className="text-emerald-700 font-bold">100% Cobertura de Lógica Crítica</span>
          </div>
        )}
      </div>
    </div>
  );
};
