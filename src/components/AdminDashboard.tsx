/**
 * @file AdminDashboard.tsx
 * @description Panel de control administrativo ejecutivo para la gestión
 * de expedientes de visas laborales, filtrado reactivo, métricas y exportaciones.
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Plus, 
  RefreshCw,
  Sparkles,
  Layers,
  BarChart3,
  CheckCircle,
  FileSpreadsheet,
  ArrowUpDown
} from 'lucide-react';
import { Solicitud, FiltrosSolicitudes, EstadisticasDashboard, TipoVisa, EstadoSolicitud } from '../types';
import { solicitudStore } from '../lib/store';
import { cacheService } from '../lib/cache';
import { generarContratoMaestroDocx, generarGuiaRequisitosDocx, descargarBlob } from '../lib/docx';

interface AdminDashboardProps {
  onVerSolicitud: (solicitud: Solicitud) => void;
  onNuevaSolicitud: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onVerSolicitud,
  onNuevaSolicitud
}) => {
  const [filtros, setFiltros] = useState<FiltrosSolicitudes>({
    busqueda: '',
    tipoVisa: 'todas',
    estado: 'todos',
    ordenPor: 'fecha',
    ordenDir: 'desc',
    pagina: 1,
    porPagina: 8
  });

  const [datos, setDatos] = useState<{ items: Solicitud[]; total: number; totalPaginas: number }>({
    items: [],
    total: 0,
    totalPaginas: 1
  });

  const [estadisticas, setEstadisticas] = useState<EstadisticasDashboard>({
    total: 0,
    pendientes: 0,
    enRevision: 0,
    documentacionPendiente: 0,
    aprobadas: 0,
    rechazadas: 0,
    porTipoVisa: { 'H-2A': 0, 'H-2B': 0, 'EB-3': 0, 'J-1': 0, 'B-1/B-2': 0 },
    promedioProgreso: 0
  });

  const [metricasCache, setMetricasCache] = useState(cacheService.getMetricas());
  const [descargandoId, setDescargandoId] = useState<string | null>(null);

  // Recarga datos desde el store
  const recargar = () => {
    const res = solicitudStore.obtenerSolicitudes(filtros);
    setDatos(res);
    setEstadisticas(solicitudStore.obtenerEstadisticas());
    setMetricasCache(cacheService.getMetricas());
  };

  useEffect(() => {
    recargar();
    const unsub = solicitudStore.subscribe(recargar);
    return () => unsub();
  }, [filtros]);

  const handleDescargaRapida = async (sol: Solicitud, tipo: 'contrato' | 'guia') => {
    setDescargandoId(`${sol.id}-${tipo}`);
    try {
      if (tipo === 'contrato') {
        const blob = await generarContratoMaestroDocx(sol);
        descargarBlob(blob, `Contrato_Maestro_${sol.radicado}.docx`);
      } else {
        const blob = await generarGuiaRequisitosDocx(sol);
        descargarBlob(blob, `Guia_Requisitos_${sol.radicado}.docx`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDescargandoId(null);
    }
  };

  const handleExportarCSV = () => {
    const todas = solicitudStore.obtenerSolicitudes({
      busqueda: '',
      ordenPor: 'fecha',
      ordenDir: 'desc',
      pagina: 1,
      porPagina: 1000
    }).items;

    const encabezados = ['Radicado', 'Nombres', 'Apellidos', 'Email', 'Telefono', 'TipoDocumento', 'NumeroDocumento', 'Nacionalidad', 'TipoVisa', 'Profesion', 'Estado', 'ProgresoPct', 'FechaCreacion'];
    const filas = todas.map((s) => [
      s.radicado,
      `"${s.nombres}"`,
      `"${s.apellidos}"`,
      s.email,
      `"${s.telefono}"`,
      s.tipoDocumento === 'dpi' ? 'DPI' : 'Pasaporte',
      `"${s.numeroPasaporte}"`,
      s.nacionalidad,
      s.tipoVisa,
      `"${s.profesionOficio}"`,
      s.estado,
      s.porcentajeCompletado,
      s.fechaCreacion
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [encabezados.join(','), ...filas.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Expedientes_Visatrabajo_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const obtenerBadgeEstado = (estado: EstadoSolicitud) => {
    switch (estado) {
      case 'aprobada':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Aprobada</span>;
      case 'en_revision':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">En Revisión</span>;
      case 'documentacion_pendiente':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Doc. Pendiente</span>;
      case 'contrato_emitido':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Contrato Emitido</span>;
      case 'rechazada':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Rechazada</span>;
      case 'pendiente':
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Pendiente</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Cabecera del panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Control de Gestión Migratoria
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Panel de Expedientes y Visas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Seguimiento de postulantes, verificación de requisitos y emisión de contratos oficiales
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-exportar-csv"
            onClick={handleExportarCSV}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors flex items-center gap-2"
            title="Exportar base de datos a archivo CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>

          <button
            id="btn-nuevo-expediente"
            onClick={onNuevaSolicitud}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Nueva Solicitud</span>
          </button>
        </div>
      </div>

      {/* Tarjetas KPI de Resumen */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Expedientes</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{estadisticas.total}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Postulantes registrados</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">En Revisión</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-blue-700 font-mono">{estadisticas.enRevision}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Evaluación legal activa</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Doc. Pendiente</span>
            <AlertCircle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-amber-700 font-mono">{estadisticas.documentacionPendiente}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Por completar requisitos</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Aprobadas</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-emerald-700 font-mono">{estadisticas.aprobadas}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Listas para consulado</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avance Promedio</span>
            <BarChart3 className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{estadisticas.promedioProgreso}%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Completitud documental</span>
        </div>

      </div>

      {/* Indicador de Optimización de Rendimiento y Memoria Caché */}
      <div className="px-5 py-3 rounded-xl bg-slate-900 text-slate-300 text-xs flex flex-wrap items-center justify-between gap-3 border border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-white">Motor de Caché & Consultas Indexadas Activo</span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">
            Aciertos en Memoria: <strong className="text-amber-400 font-mono">{metricasCache.ratioAciertosPct}%</strong> ({metricasCache.hits} hits / {metricasCache.totalConsultas} queries)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              solicitudStore.restablecerSemilla();
              recargar();
            }}
            className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
            title="Recargar datos de prueba de fábrica"
          >
            Restablecer Datos de Demostración
          </button>
          <button
            onClick={recargar}
            className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
            title="Refrescar vista"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Búsqueda en vivo */}
          <div className="relative flex-1">
            <input
              type="text"
              value={filtros.busqueda}
              onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value, pagina: 1 })}
              placeholder="Buscar por nombre, radicado, pasaporte, oficio, nacionalidad..."
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* Filtro por Visa */}
          <select
            value={filtros.tipoVisa}
            onChange={(e) => setFiltros({ ...filtros, tipoVisa: e.target.value as TipoVisa | 'todas', pagina: 1 })}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
          >
            <option value="todas">Todas las Visas</option>
            <option value="H-2A">Visa H-2A (Agrícola)</option>
            <option value="H-2B">Visa H-2B (No Agrícola)</option>
            <option value="EB-3">Visa EB-3 (Residencia)</option>
            <option value="J-1">Visa J-1 (Trainee/Pasantía)</option>
            <option value="B-1/B-2">Visa B-1/B-2</option>
          </select>

          {/* Filtro por Estado */}
          <select
            value={filtros.estado}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value as EstadoSolicitud | 'todos', pagina: 1 })}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
          >
            <option value="todos">Todos los Estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_revision">En Revisión</option>
            <option value="documentacion_pendiente">Doc. Pendiente</option>
            <option value="contrato_emitido">Contrato Emitido</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
          </select>

          {/* Orden */}
          <select
            value={`${filtros.ordenPor}-${filtros.ordenDir}`}
            onChange={(e) => {
              const [campo, dir] = e.target.value.split('-');
              setFiltros({ ...filtros, ordenPor: campo as any, ordenDir: dir as any });
            }}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
          >
            <option value="fecha-desc">Más recientes primero</option>
            <option value="fecha-asc">Más antiguos primero</option>
            <option value="progreso-desc">Mayor progreso primero</option>
            <option value="progreso-asc">Menor progreso primero</option>
            <option value="nombre-asc">Nombre (A - Z)</option>
          </select>

        </div>

      </div>

      {/* Tabla de Expedientes */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="p-4 pl-6">Postulante & Radicado</th>
                <th className="p-4">Programa</th>
                <th className="p-4">Oficio / Perfil</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Avance Requisitos</th>
                <th className="p-4 pr-6 text-right">Acciones Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {datos.items.length > 0 ? (
                datos.items.map((sol) => (
                  <tr key={sol.id} className="hover:bg-slate-50/60 transition-colors group">
                    
                    {/* Postulante */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-xs">
                          {sol.nombres.charAt(0)}{sol.apellidos.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                            {sol.nombres} {sol.apellidos}
                          </p>
                          <p className="font-mono text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>{sol.radicado}</span>
                            <span>•</span>
                            <span className="uppercase text-[9px] font-extrabold px-1 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                              {sol.tipoDocumento === 'dpi' ? 'DPI' : 'PAS'}
                            </span>
                            <span>{sol.numeroPasaporte}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Visa */}
                    <td className="p-4">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 text-[11px]">
                        Visa {sol.tipoVisa}
                      </span>
                    </td>

                    {/* Oficio */}
                    <td className="p-4">
                      <p className="font-medium text-slate-800 line-clamp-1 max-w-[200px]" title={sol.profesionOficio}>
                        {sol.profesionOficio}
                      </p>
                      <span className="text-[11px] text-slate-400 capitalize">
                        {sol.nacionalidad}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="p-4">
                      {obtenerBadgeEstado(sol.estado)}
                    </td>

                    {/* Avance */}
                    <td className="p-4">
                      <div className="w-28">
                        <div className="flex justify-between items-center text-[11px] font-bold mb-1">
                          <span className="text-slate-600">{sol.porcentajeCompletado}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-amber-500 h-1.5 rounded-full"
                            style={{ width: `${sol.porcentajeCompletado}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Ver Expediente */}
                        <button
                          onClick={() => onVerSolicitud(sol)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 shadow-xs"
                          title="Abrir expediente completo y checklist"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Expediente</span>
                        </button>

                        {/* Descarga Contrato DOCX */}
                        <button
                          onClick={() => handleDescargaRapida(sol, 'contrato')}
                          disabled={descargandoId === `${sol.id}-contrato`}
                          className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors border border-slate-200"
                          title="Descargar Contrato Maestro (.docx)"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {/* Descarga Guía DOCX */}
                        <button
                          onClick={() => handleDescargaRapida(sol, 'guia')}
                          disabled={descargandoId === `${sol.id}-guia`}
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200"
                          title="Descargar Guía de Requisitos (.docx)"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-600">No se encontraron expedientes con los filtros aplicados.</p>
                    <button
                      onClick={() => setFiltros({ busqueda: '', tipoVisa: 'todas', estado: 'todos', ordenPor: 'fecha', ordenDir: 'desc', pagina: 1, porPagina: 8 })}
                      className="text-xs text-amber-600 font-bold underline mt-2 inline-block cursor-pointer"
                    >
                      Limpiar filtros de búsqueda
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {datos.totalPaginas > 1 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Mostrando {datos.items.length} de {datos.total} expedientes
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setFiltros({ ...filtros, pagina: Math.max(1, filtros.pagina - 1) })}
                disabled={filtros.pagina === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 font-bold"
              >
                Anterior
              </button>
              <span className="px-3 py-1.5 font-bold text-slate-800">
                {filtros.pagina} de {datos.totalPaginas}
              </span>
              <button
                onClick={() => setFiltros({ ...filtros, pagina: Math.min(datos.totalPaginas, filtros.pagina + 1) })}
                disabled={filtros.pagina === datos.totalPaginas}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 font-bold"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
