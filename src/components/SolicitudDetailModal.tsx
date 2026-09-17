/**
 * @file SolicitudDetailModal.tsx
 * @description Expediente integral del postulante con checklist interactivo,
 * generador de Contrato Maestro y Guía de Requisitos en DOCX, bitácora y mensajería.
 */

import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Send, 
  User, 
  Briefcase, 
  Mail, 
  Phone, 
  Globe, 
  Calendar,
  MessageSquare,
  Share2,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { Solicitud, EstadoSolicitud, EstadoRequisito } from '../types';
import { solicitudStore } from '../lib/store';
import { generarContratoMaestroDocx, generarGuiaRequisitosDocx, descargarBlob } from '../lib/docx';

interface SolicitudDetailModalProps {
  solicitud: Solicitud | null;
  onCerrar: () => void;
  onActualizado: (actualizada: Solicitud) => void;
}

export const SolicitudDetailModal: React.FC<SolicitudDetailModalProps> = ({
  solicitud,
  onCerrar,
  onActualizado
}) => {
  if (!solicitud) return null;

  const [estadoActual, setEstadoActual] = useState<EstadoSolicitud>(solicitud.estado);
  const [nuevaNota, setNuevaNota] = useState('');
  const [generandoDoc, setGenerandoDoc] = useState<string | null>(null);
  const [pestanaActiva, setPestanaActiva] = useState<'checklist' | 'perfil' | 'notas'>('checklist');

  const handleCambiarEstadoRequisito = (itemId: string, nuevoEstado: EstadoRequisito) => {
    const actualizada = solicitudStore.actualizarItemChecklist(solicitud.id, itemId, nuevoEstado);
    if (actualizada) {
      onActualizado(actualizada);
    }
  };

  const handleGuardarEstado = () => {
    const actualizada = solicitudStore.actualizarSolicitud(
      solicitud.id,
      { estado: estadoActual },
      'Coordinación Legal',
      `Estado del expediente actualizado a: ${estadoActual.replace('_', ' ').toUpperCase()}`
    );
    if (actualizada) {
      onActualizado(actualizada);
    }
  };

  const handleAgregarNota = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaNota.trim()) return;

    const actualizada = solicitudStore.actualizarSolicitud(
      solicitud.id,
      {},
      'Asesor Legal',
      nuevaNota.trim()
    );
    if (actualizada) {
      onActualizado(actualizada);
      setNuevaNota('');
    }
  };

  const handleDescargarContrato = async () => {
    setGenerandoDoc('contrato');
    try {
      const blob = await generarContratoMaestroDocx(solicitud);
      descargarBlob(blob, `Contrato_Maestro_${solicitud.radicado}_${solicitud.nombres}_${solicitud.apellidos}.docx`);
      // Marcar contrato como generado
      const actualizada = solicitudStore.actualizarSolicitud(
        solicitud.id,
        { contratoGenerado: true, fechaContrato: new Date().toISOString() },
        'Sistema',
        'Contrato Maestro oficial generado y descargado en formato DOCX.'
      );
      if (actualizada) onActualizado(actualizada);
    } catch (err) {
      console.error('Error al generar contrato:', err);
    } finally {
      setGenerandoDoc(null);
    }
  };

  const handleDescargarGuia = async () => {
    setGenerandoDoc('guia');
    try {
      const blob = await generarGuiaRequisitosDocx(solicitud);
      descargarBlob(blob, `Guia_Requisitos_${solicitud.radicado}_Visa_${solicitud.tipoVisa}.docx`);
      const actualizada = solicitudStore.actualizarSolicitud(
        solicitud.id,
        { guiaDescargada: true },
        'Sistema',
        'Guía de Requisitos Maestra generada y descargada en formato DOCX.'
      );
      if (actualizada) onActualizado(actualizada);
    } catch (err) {
      console.error('Error al generar guía:', err);
    } finally {
      setGenerandoDoc(null);
    }
  };

  // Enlace directo a WhatsApp para notificar al postulante
  const generarEnlaceWhatsApp = () => {
    const telefonoLimpio = solicitud.telefono.replace(/[^0-9]/g, '');
    const mensaje = encodeURIComponent(
      `Hola ${solicitud.nombres}, le saludamos de Visatrabajo Internacional. Le informamos que su expediente de Visa ${solicitud.tipoVisa} (Radicado: ${solicitud.radicado}) presenta un avance de requisitos del ${solicitud.porcentajeCompletado}%. Estado actual: ${solicitud.estado.replace('_', ' ').toUpperCase()}. Puede consultar su expediente en cualquier momento en nuestro portal.`
    );
    return `https://wa.me/${telefonoLimpio}?text=${mensaje}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        id="modal-expediente-container"
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Cabecera del expediente */}
        <div className="p-6 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 font-mono font-bold text-xs border border-amber-400/30">
                {solicitud.radicado}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700">
                Visa {solicitud.tipoVisa}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
              {solicitud.nombres} {solicitud.apellidos}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {solicitud.profesionOficio} • Pasaporte: {solicitud.numeroPasaporte} • {solicitud.nacionalidad}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* WhatsApp Link */}
            <a
              href={generarEnlaceWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
              title="Notificar avance al postulante por WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Notificar</span> WhatsApp
            </a>

            {/* Cerrar modal */}
            <button
              onClick={onCerrar}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Barra superior de pestañas y métrica de avance */}
        <div className="px-6 py-3 bg-slate-100/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setPestanaActiva('checklist')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                pestanaActiva === 'checklist'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Checklist Requisitos
            </button>
            <button
              onClick={() => setPestanaActiva('perfil')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                pestanaActiva === 'perfil'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ficha del Postulante
            </button>
            <button
              onClick={() => setPestanaActiva('notas')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                pestanaActiva === 'notas'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bitácora ({solicitud.historialNotas.length})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Progreso Documental</span>
              <p className="text-xs font-black text-slate-800">{solicitud.porcentajeCompletado}% completado</p>
            </div>
            <div className="w-24 bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-amber-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${solicitud.porcentajeCompletado}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cuerpo del modal scrolleable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Pestaña: Checklist Interactivo */}
          {pestanaActiva === 'checklist' && (
            <div className="space-y-6">
              
              {/* Bloque de Generadores DOCX Oficiales */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-slate-50 to-amber-50/50 border border-amber-200/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-amber-600" />
                    Generación de Documentación Oficial (.docx)
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Genere con un clic los archivos oficiales con membrete, variables del cliente y cláusulas listas para firma.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleDescargarContrato}
                    disabled={generandoDoc !== null}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Contrato Maestro (.docx)</span>
                  </button>

                  <button
                    onClick={handleDescargarGuia}
                    disabled={generandoDoc !== null}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Guía Requisitos (.docx)</span>
                  </button>
                </div>
              </div>

              {/* Categorías de requisitos */}
              {solicitud.checklists.map((cat, idx) => (
                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      {cat.categoria}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {cat.descripcion}
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {cat.items.map((it) => (
                      <div key={it.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-slate-400">
                              {it.codigo}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {it.nombre}
                            </span>
                            {it.obligatorio ? (
                              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                Obligatorio
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                Opcional
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {it.descripcion}
                          </p>
                        </div>

                        {/* Botones de acción del requisito */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            onClick={() => handleCambiarEstadoRequisito(it.id, 'validado')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              it.estado === 'validado'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                            title="Marcar como validado"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Validado</span>
                          </button>

                          <button
                            onClick={() => handleCambiarEstadoRequisito(it.id, 'recibido')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              it.estado === 'recibido'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                            }`}
                            title="Marcar como recibido pendiente de revisión"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Recibido</span>
                          </button>

                          <button
                            onClick={() => handleCambiarEstadoRequisito(it.id, 'observado')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              it.estado === 'observado'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                            }`}
                            title="Marcar con observaciones / subsanar"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Observado</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pestaña: Perfil y Datos */}
          {pestanaActiva === 'perfil' && (
            <div className="space-y-6">
              
              {/* Información Personal */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-600" /> Datos de Identificación
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Nombres y Apellidos:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{solicitud.nombres} {solicitud.apellidos}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Pasaporte:</span>
                    <p className="font-mono font-bold text-slate-900 mt-0.5">{solicitud.numeroPasaporte} (Vence: {solicitud.vencimientoPasaporte})</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Nacionalidad / Nacimiento:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{solicitud.nacionalidad} ({solicitud.paisNacimiento})</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Correo Electrónico:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{solicitud.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Teléfono / WhatsApp:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{solicitud.telefono}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Fecha de Nacimiento:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{solicitud.fechaNacimiento}</p>
                  </div>
                </div>
              </div>

              {/* Información Laboral */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-600" /> Perfil Profesional y Patrocinador
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Profesión u Oficio:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{solicitud.profesionOficio}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Años de Experiencia:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{solicitud.experienciaAnos} años</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Nivel de Inglés:</span>
                    <p className="font-bold text-amber-700 capitalize mt-0.5">{solicitud.nivelIngles}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Nivel Académico:</span>
                    <p className="font-bold text-slate-900 capitalize mt-0.5">{solicitud.nivelEstudio}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Empleador Patrocinador:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{solicitud.empleadorPatrocinador || 'Asignación en curso'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Historial de Visas Previas:</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {solicitud.visasPreviasEEUU ? 'Sí ha tenido visa previa' : 'Primera solicitud'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  <span className="text-slate-400 text-xs font-medium block mb-1">Habilidades Clave Declaradas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {solicitud.habilidadesClave.map((h, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-[11px] font-semibold">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Pestaña: Bitácora y Notas Legales */}
          {pestanaActiva === 'notas' && (
            <div className="space-y-6">
              {/* Formulario para nueva nota */}
              <form onSubmit={handleAgregarNota} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Agregar Nota u Observación Jurídica al Expediente
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nuevaNota}
                    onChange={(e) => setNuevaNota(e.target.value)}
                    placeholder="Escriba aquí los detalles de la revisión o instrucción..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Registrar</span>
                  </button>
                </div>
              </form>

              {/* Lista cronológica de notas */}
              <div className="space-y-3">
                {solicitud.historialNotas.map((nota) => (
                  <div key={nota.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800">{nota.autor}</span>
                      <span className="text-slate-400 font-mono">
                        {new Date(nota.fecha).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{nota.mensaje}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Pie del modal con actualizador de estado */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Estado del Trámite:
            </span>
            <select
              value={estadoActual}
              onChange={(e) => setEstadoActual(e.target.value as EstadoSolicitud)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en_revision">En Revisión</option>
              <option value="documentacion_pendiente">Documentación Pendiente</option>
              <option value="contrato_emitido">Contrato Emitido</option>
              <option value="aprobada">Aprobada para Consulado</option>
              <option value="rechazada">Rechazada</option>
            </select>
            <button
              onClick={handleGuardarEstado}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-xs"
            >
              Actualizar Estado
            </button>
          </div>

          <div className="text-xs text-slate-400">
            Última actualización: {new Date(solicitud.fechaActualizacion).toLocaleString('es-ES')}
          </div>
        </div>

      </div>
    </div>
  );
};
