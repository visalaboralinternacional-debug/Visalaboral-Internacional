/**
 * @file GraciasPage.tsx
 * @description Vista de confirmación de radicación exitosa de solicitud con
 * código de radicado único, descarga de Guía de Requisitos en DOCX y canal de WhatsApp.
 */

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  Search, 
  Share2, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { Solicitud } from '../types';
import { generarGuiaRequisitosDocx, descargarBlob } from '../lib/docx';

interface GraciasPageProps {
  solicitud: Solicitud;
  onRastrear: (radicado: string) => void;
  onVolverInicio: () => void;
}

export const GraciasPage: React.FC<GraciasPageProps> = ({
  solicitud,
  onRastrear,
  onVolverInicio
}) => {
  const [copiado, setCopiado] = useState(false);
  const [descargandoGuia, setDescargandoGuia] = useState(false);

  const copiarRadicado = () => {
    navigator.clipboard.writeText(solicitud.radicado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const handleDescargarGuia = async () => {
    setDescargandoGuia(true);
    try {
      const blob = await generarGuiaRequisitosDocx(solicitud);
      descargarBlob(blob, `Guia_Requisitos_${solicitud.radicado}_Visa_${solicitud.tipoVisa}.docx`);
    } catch (e) {
      console.error(e);
    } finally {
      setDescargandoGuia(false);
    }
  };

  const urlWhatsApp = `https://wa.me/?text=${encodeURIComponent(
    `He radicado mi solicitud de Visa ${solicitud.tipoVisa} en Visatrabajo Internacional con el radicado oficial ${solicitud.radicado}.`
  )}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-in fade-in zoom-in-95 duration-300">
      <div 
        id="card-confirmacion-radicado"
        className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl text-center space-y-8"
      >
        
        {/* Ícono de éxito */}
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 stroke-[2.2]" />
        </div>

        {/* Título */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Expediente Radicado Exitosamente
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            ¡Felicitaciones, {solicitud.nombres}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto font-medium">
            Su solicitud para el programa de <strong className="text-slate-800">Visa {solicitud.tipoVisa}</strong> ha sido ingresada satisfactoriamente en el sistema central de Visatrabajo Internacional.
          </p>
        </div>

        {/* Bloque destacado de Radicado Oficial */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white max-w-md mx-auto relative shadow-lg">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
            Su Código Único de Radicado
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-white">
              {solicitud.radicado}
            </span>
            <button
              onClick={copiarRadicado}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Copiar radicado"
            >
              {copiado ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Guarde este código para consultar el estado en vivo de su expediente
          </p>
        </div>

        {/* Descarga inmediata de Guía Maestra */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-500 text-slate-950">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">
                Guía de Requisitos Maestra (.docx)
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Descargue su lista de cotejo personalizada con las directrices consulares para Visa {solicitud.tipoVisa}.
              </p>
            </div>
          </div>

          <button
            id="btn-descargar-guia-gracias"
            onClick={handleDescargarGuia}
            disabled={descargandoGuia}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{descargandoGuia ? 'Generando DOCX...' : 'Descargar Guía (.docx)'}</span>
          </button>
        </div>

        {/* Próximos pasos */}
        <div className="text-left space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            ¿Qué sucede a continuación?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[11px] mb-2">1</span>
              <strong className="text-slate-900 block font-bold mb-1">Revisión Jurídica</strong>
              <p className="text-slate-500">Un abogado evaluará sus antecedentes y perfil profesional en las próximas 24 a 48 horas.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[11px] mb-2">2</span>
              <strong className="text-slate-900 block font-bold mb-1">Recepción de Documentos</strong>
              <p className="text-slate-500">Consignará los soportes indicados en su Guía Maestra (pasaporte, antecedentes y certificados).</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[11px] mb-2">3</span>
              <strong className="text-slate-900 block font-bold mb-1">Contrato & Cita Consular</strong>
              <p className="text-slate-500">Emisión del Contrato Maestro oficial, pago del arancel MRV y preparación para la entrevista.</p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onRastrear(solicitud.radicado)}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>Consultar Estado en Vivo</span>
          </button>

          <a
            href={urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir por WhatsApp</span>
          </a>

          <button
            onClick={onVolverInicio}
            className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
          >
            Volver al Inicio
          </button>
        </div>

      </div>
    </div>
  );
};
