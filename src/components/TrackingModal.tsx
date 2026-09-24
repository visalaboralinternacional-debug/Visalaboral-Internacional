/**
 * @file TrackingModal.tsx
 * @description Modal interactivo para el rastreo público de trámites de visas
 * en tiempo real mediante el código de radicado o correo electrónico.
 */

import React, { useState } from 'react';
import { 
  X, 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Shield, 
  User, 
  Calendar,
  ChevronRight,
  ExternalLink,
  Share2
} from 'lucide-react';
import { solicitudStore } from '../lib/store';
import { Solicitud } from '../types';
import { generarGuiaRequisitosDocx, generarContratoMaestroDocx, descargarBlob } from '../lib/docx';

interface TrackingModalProps {
  abierto: boolean;
  onCerrar: () => void;
  radicadoInicial?: string;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({
  abierto,
  onCerrar,
  radicadoInicial = ''
}) => {
  const [consulta, setConsulta] = useState(radicadoInicial);
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [buscado, setBuscado] = useState(false);
  const [descargando, setDescargando] = useState<string | null>(null);

  if (!abierto) return null;

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    const query = consulta.trim();
    if (!query) return;

    // Buscar por radicado o por email
    let res = solicitudStore.obtenerPorRadicado(query);
    if (!res) {
      const todas = solicitudStore.obtenerSolicitudes({
        busqueda: query,
        ordenPor: 'fecha',
        ordenDir: 'desc',
        pagina: 1,
        porPagina: 10
      });
      if (todas.items.length > 0) {
        res = todas.items[0];
      }
    }

    setSolicitud(res);
    setBuscado(true);
  };

  const handleDescargarDoc = async (tipo: 'guia' | 'contrato') => {
    if (!solicitud) return;
    setDescargando(tipo);
    try {
      if (tipo === 'guia') {
        const blob = await generarGuiaRequisitosDocx(solicitud);
        descargarBlob(blob, `Guia_Requisitos_${solicitud.radicado}_${solicitud.tipoVisa}.docx`);
      } else {
        const blob = await generarContratoMaestroDocx(solicitud);
        descargarBlob(blob, `Contrato_Maestro_${solicitud.radicado}.docx`);
      }
    } catch (err) {
      console.error('Error al generar documento:', err);
    } finally {
      setDescargando(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        id="modal-tracking-container"
        className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Botón cerrar */}
        <button
          onClick={onCerrar}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          title="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado del modal */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Rastreo en Vivo de Expediente
            </h3>
            <p className="text-sm text-slate-500">
              Consulte el estado, checklist de requisitos y documentos oficiales de su trámite
            </p>
          </div>
        </div>

        {/* Formulario de búsqueda */}
        <form onSubmit={handleBuscar} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                id="input-tracking-query"
                type="text"
                value={consulta}
                onChange={(e) => setConsulta(e.target.value)}
                placeholder="Radicado (ej: VLI-2026-1042), correo o No. de Pasaporte / DPI"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                autoFocus
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              id="btn-buscar-tracking"
              type="submit"
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2"
            >
              Consultar
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Tip de prueba: Pruebe con <span className="font-mono text-amber-600 font-semibold cursor-pointer underline" onClick={() => setConsulta('VLI-2026-1042')}>VLI-2026-1042</span> o <span className="font-mono text-amber-600 font-semibold cursor-pointer underline" onClick={() => setConsulta('VLI-2026-1044')}>VLI-2026-1044</span>.
          </p>
        </form>

        {/* Resultado de la búsqueda */}
        {buscado && (
          <div>
            {solicitud ? (
              <div className="space-y-6">
                
                {/* Tarjeta principal de estado */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Radicado Oficial</span>
                      <p className="text-lg font-extrabold text-slate-900 font-mono">{solicitud.radicado}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Programa Migratorio</span>
                      <p className="text-sm font-bold text-amber-600">Visa {solicitud.tipoVisa}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm pt-3 border-t border-slate-200/80">
                    <div>
                      <span className="text-xs text-slate-500">Postulante:</span>
                      <p className="font-semibold text-slate-800">{solicitud.nombres} {solicitud.apellidos}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Identificación:</span>
                      <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                          {solicitud.tipoDocumento === 'dpi' ? 'DPI' : 'Pasaporte'}
                        </span>
                        <span className="font-mono text-xs">{solicitud.numeroPasaporte}</span>
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Oficio / Perfil:</span>
                      <p className="font-semibold text-slate-800">{solicitud.profesionOficio}</p>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div className="mt-4 pt-3 border-t border-slate-200/80">
                    <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                      <span className="text-slate-600">Avance de Expediente y Requisitos</span>
                      <span className="text-amber-600 font-bold">{solicitud.porcentajeCompletado}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${solicitud.porcentajeCompletado}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Estado del trámite */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-800">
                  <Clock className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                      Estado Actual: {solicitud.estado.replace('_', ' ').toUpperCase()}
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {solicitud.estado === 'aprobada' && 'Su expediente ha sido validado satisfactoriamente y está listo para la cita consular.'}
                      {solicitud.estado === 'en_revision' && 'Nuestros abogados están evaluando sus documentos y la certificación laboral patrocinadora.'}
                      {solicitud.estado === 'documentacion_pendiente' && 'Por favor revise los requisitos señalados como pendientes en su Guía Maestra.'}
                      {solicitud.estado === 'pendiente' && 'Su solicitud ha sido recibida y se encuentra en fila de revisión técnica inicial.'}
                    </p>
                  </div>
                </div>

                {/* Descarga de documentos oficiales en DOCX */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Documentos Oficiales Disponibles
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => handleDescargarDoc('guia')}
                      disabled={descargando !== null}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 flex items-center justify-between text-left transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-amber-700">
                            Guía de Requisitos (.docx)
                          </p>
                          <p className="text-[11px] text-slate-400">Instrucciones y cotejo oficial</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                    </button>

                    <button
                      onClick={() => handleDescargarDoc('contrato')}
                      disabled={descargando !== null}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 flex items-center justify-between text-left transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-amber-700">
                            Contrato Maestro (.docx)
                          </p>
                          <p className="text-[11px] text-slate-400">Servicios de asesoría legal</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                    </button>
                  </div>

                  {/* Botón directo a WhatsApp 40529385 con resultados */}
                  <a
                    href={`https://wa.me/50240529385?text=${encodeURIComponent(
                      `*RESULTADO DE RASTREO - VISATRABAJO INTERNACIONAL*\n\n` +
                      `Hola, consulto sobre el estado de mi expediente oficial:\n\n` +
                      `📌 *Radicado:* ${solicitud.radicado}\n` +
                      `👤 *Postulante:* ${solicitud.nombres} ${solicitud.apellidos}\n` +
                      `🪪 *${solicitud.tipoDocumento === 'dpi' ? 'DPI' : 'Pasaporte'}:* ${solicitud.numeroPasaporte}\n` +
                      `💼 *Programa:* Visa ${solicitud.tipoVisa} (${solicitud.profesionOficio})\n` +
                      `📊 *Progreso:* ${solicitud.porcentajeCompletado}%\n` +
                      `⚡ *Estado:* ${solicitud.estado.replace('_', ' ').toUpperCase()}\n\n` +
                      `Agradezco su atención y asesoría para mi trámite.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-3 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Enviar resultados a WhatsApp (40529385)</span>
                  </a>
                </div>

                {/* Última nota de la bitácora */}
                {solicitud.historialNotas.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">Última actualización de su asesor:</span>
                    <p className="text-slate-600 italic">"{solicitud.historialNotas[0].mensaje}"</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(solicitud.historialNotas[0].fecha).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}

              </div>
            ) : (
              <div className="p-8 text-center rounded-xl bg-slate-50 border border-slate-200">
                <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800">No se encontró ningún expediente</h4>
                <p className="text-sm text-slate-500 mt-1">
                  Verifique que el código de radicado coincida con el formato <strong>VLI-2026-XXXX</strong> o introduzca el correo suministrado.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
