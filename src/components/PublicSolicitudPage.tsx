/**
 * @file PublicSolicitudPage.tsx
 * @description Portal público de radicación de visas laborales internacionales con
 * asistente guiado paso a paso, validación en tiempo real y selector de programas.
 */

import React, { useState } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileCheck2, 
  Briefcase, 
  User, 
  Award, 
  Clock, 
  AlertCircle,
  HelpCircle,
  Building2,
  Calendar,
  Sparkles,
  Search
} from 'lucide-react';
import { TipoVisa, NivelIngles, NivelEstudio, Solicitud, TipoDocumentoIdentidad } from '../types';
import { solicitudStore } from '../lib/store';

interface PublicSolicitudPageProps {
  onSolicitudEnviada: (solicitud: Solicitud) => void;
  onAbrirTracking: () => void;
}

export const PublicSolicitudPage: React.FC<PublicSolicitudPageProps> = ({
  onSolicitudEnviada,
  onAbrirTracking
}) => {
  const [paso, setPaso] = useState<1 | 2 | 3 | 4>(1);
  const [enviando, setEnviando] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    paisNacimiento: 'México',
    nacionalidad: 'Mexicana',
    paisResidencia: 'México',
    fechaNacimiento: '',
    tipoDocumento: 'pasaporte' as TipoDocumentoIdentidad,
    numeroPasaporte: '',
    vencimientoPasaporte: '',
    
    tipoVisa: 'H-2A' as TipoVisa,
    profesionOficio: '',
    experienciaAnos: 2,
    nivelIngles: 'basico' as NivelIngles,
    nivelEstudio: 'secundaria' as NivelEstudio,
    habilidadesClaveTexto: '',
    tieneOfertaLaboral: false,
    empleadorPatrocinador: '',
    
    visasPreviasEEUU: false,
    denegacionesPrevias: false,
    aceptoTerminos: false
  });

  const validarPasoActual = (): boolean => {
    setErrorValidacion(null);

    if (paso === 1) {
      if (!formData.nombres.trim() || !formData.apellidos.trim()) {
        setErrorValidacion('Por favor ingrese sus nombres y apellidos completos.');
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setErrorValidacion('Ingrese un correo electrónico válido para enviarle su número de radicado.');
        return false;
      }
      if (!formData.telefono.trim() || formData.telefono.length < 7) {
        setErrorValidacion('Ingrese un número de teléfono o WhatsApp de contacto válido.');
        return false;
      }
      if (!formData.numeroPasaporte.trim()) {
        setErrorValidacion(
          formData.tipoDocumento === 'dpi'
            ? 'El número de DPI es obligatorio para la radicación del expediente.'
            : 'El número de pasaporte (o DPI si no tiene pasaporte) es obligatorio para la radicación del expediente.'
        );
        return false;
      }
      if (!formData.fechaNacimiento) {
        setErrorValidacion('Indique su fecha de nacimiento.');
        return false;
      }
    } else if (paso === 2) {
      if (!formData.profesionOficio.trim()) {
        setErrorValidacion('Indique su oficio o profesión principal (ej: Operador de Maquinaria, Soldador, Cocinero).');
        return false;
      }
    } else if (paso === 3) {
      if (formData.denegacionesPrevias && !formData.tieneOfertaLaboral) {
        // Alerta suave pero permitida
      }
    } else if (paso === 4) {
      if (!formData.aceptoTerminos) {
        setErrorValidacion('Debe aceptar la declaración de veracidad de datos y los términos de asesoría.');
        return false;
      }
    }

    return true;
  };

  const avanzarPaso = () => {
    if (validarPasoActual()) {
      setPaso((prev) => Math.min(4, prev + 1) as any);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  const retrocederPaso = () => {
    setErrorValidacion(null);
    setPaso((prev) => Math.max(1, prev - 1) as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarPasoActual()) return;

    setEnviando(true);
    try {
      // Simula proceso de validación en servidor
      await new Promise((r) => setTimeout(r, 600));

      const habilidades = formData.habilidadesClaveTexto
        ? formData.habilidadesClaveTexto.split(',').map((h) => h.trim()).filter(Boolean)
        : ['Disponibilidad inmediata', 'Trabajo en equipo'];

      const nueva = solicitudStore.crearSolicitud({
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        email: formData.email.trim().toLowerCase(),
        telefono: formData.telefono.trim(),
        paisNacimiento: formData.paisNacimiento,
        nacionalidad: formData.nacionalidad,
        paisResidencia: formData.paisResidencia,
        fechaNacimiento: formData.fechaNacimiento,
        tipoDocumento: formData.tipoDocumento,
        numeroPasaporte: formData.numeroPasaporte.trim().toUpperCase(),
        vencimientoPasaporte: formData.vencimientoPasaporte || '2030-12-31',
        tipoVisa: formData.tipoVisa,
        profesionOficio: formData.profesionOficio.trim(),
        experienciaAnos: Number(formData.experienciaAnos) || 1,
        nivelIngles: formData.nivelIngles,
        nivelEstudio: formData.nivelEstudio,
        habilidadesClave: habilidades,
        tieneOfertaLaboral: formData.tieneOfertaLaboral,
        empleadorPatrocinador: formData.empleadorPatrocinador.trim() || undefined,
        visasPreviasEEUU: formData.visasPreviasEEUU,
        denegacionesPrevias: formData.denegacionesPrevias,
        estado: 'pendiente'
      });

      onSolicitudEnviada(nueva);
    } catch (err) {
      setErrorValidacion('Ocurrió un error inesperado al radicar su solicitud. Intente nuevamente.');
      setEnviando(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Convocatorias de Visas de Trabajo Internacional 2026
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            Gestión Integral & Asesoría para <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200">
              Visas Laborales Internacionales
            </span>
          </h1>

          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base font-normal leading-relaxed">
            Tramitación estructurada de programas temporales y permanentes (<strong className="text-white">H-2A Agrícola</strong>, <strong className="text-white">H-2B Servicios</strong>, <strong className="text-white">EB-3 Residencia</strong> y <strong className="text-white">J-1</strong>). Verificación documental legal, contratos maestros y expedientes consulares.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a 
              href="#formulario-solicitud" 
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2"
            >
              <span>Iniciar Radicación de Solicitud</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={onAbrirTracking}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all border border-slate-700 flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Ya tengo radicado: Rastrear</span>
            </button>
          </div>

          {/* Sellos de confianza */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-xs text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Contratos Oficiales DOCX</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Checklists Homologados</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Conexión Empleadores</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Seguimiento en Vivo 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Programas Disponibles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Categorías Disponibles</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            Seleccione su Programa de Interés
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cada visa cuenta con requisitos específicos y procedimientos de patrocinio certificados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div 
            onClick={() => setFormData({ ...formData, tipoVisa: 'H-2A' })}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              formData.tipoVisa === 'H-2A' 
                ? 'border-amber-500 bg-amber-500/5 shadow-md ring-2 ring-amber-500/20' 
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-3">
              H-2A
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Trabajadores Agrícolas</h3>
            <p className="text-xs text-slate-500 mt-1">
              Siembra, cosecha, empacado y operación de maquinaria en campos y fincas.
            </p>
            <span className="inline-block mt-3 text-[11px] font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-md">
              Alta Demanda • Temporadas 6-10 meses
            </span>
          </div>

          <div 
            onClick={() => setFormData({ ...formData, tipoVisa: 'H-2B' })}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              formData.tipoVisa === 'H-2B' 
                ? 'border-amber-500 bg-amber-500/5 shadow-md ring-2 ring-amber-500/20' 
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm mb-3">
              H-2B
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Servicios y Construcción</h3>
            <p className="text-xs text-slate-500 mt-1">
              Hotelería, cocina, limpieza, jardinería/paisajismo y obra civil.
            </p>
            <span className="inline-block mt-3 text-[11px] font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-md">
              No Agrícola • Certificación DOL
            </span>
          </div>

          <div 
            onClick={() => setFormData({ ...formData, tipoVisa: 'EB-3' })}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              formData.tipoVisa === 'EB-3' 
                ? 'border-amber-500 bg-amber-500/5 shadow-md ring-2 ring-amber-500/20' 
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">
              EB-3
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Residencia Permanente</h3>
            <p className="text-xs text-slate-500 mt-1">
              Green Card por empleo para trabajadores calificados y no calificados.
            </p>
            <span className="inline-block mt-3 text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
              Residencia • Proceso PERM Laboral
            </span>
          </div>

          <div 
            onClick={() => setFormData({ ...formData, tipoVisa: 'J-1' })}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              formData.tipoVisa === 'J-1' 
                ? 'border-amber-500 bg-amber-500/5 shadow-md ring-2 ring-amber-500/20' 
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm mb-3">
              J-1
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Intercambio y Trainee</h3>
            <p className="text-xs text-slate-500 mt-1">
              Pasantías formativas y entrenamiento profesional remunerado en EE.UU.
            </p>
            <span className="inline-block mt-3 text-[11px] font-bold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-md">
              Formato DS-2019 • Estudiantes / Graduados
            </span>
          </div>

        </div>
      </section>

      {/* Formulario Interactivo Paso a Paso */}
      <section id="formulario-solicitud" className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          
          {/* Indicador de pasos */}
          <div className="px-6 sm:px-10 pt-8 pb-6 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              {[
                { num: 1, label: 'Personales' },
                { num: 2, label: 'Perfil Laboral' },
                { num: 3, label: 'Visa y Empleo' },
                { num: 4, label: 'Confirmación' }
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-2">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                      paso === s.num
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : paso > s.num
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {paso > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-xs font-bold hidden sm:inline ${paso === s.num ? 'text-slate-900' : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mensaje de error de validación */}
          {errorValidacion && (
            <div className="mx-6 sm:mx-10 mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorValidacion}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
            
            {/* PASO 1: Identificación y Datos Personales */}
            {paso === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-lg font-black text-slate-900">Paso 1: Datos Personales y de Identificación</h3>
                  <p className="text-xs text-slate-500">Debe coincidir con la información de su pasaporte oficial</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Nombres Completos *
                    </label>
                    <input
                      type="text"
                      value={formData.nombres}
                      onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                      placeholder="Ej: Carlos Andrés"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Apellidos Completos *
                    </label>
                    <input
                      type="text"
                      value={formData.apellidos}
                      onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                      placeholder="Ej: Mendoza Ruiz"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Teléfono / WhatsApp (con código de país) *
                    </label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="+52 55 1234 5678"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />
                  </div>

                  {/* Selector de Documento: Pasaporte o DPI */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Tipo de Documento de Identificación *
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      Si aún no tiene pasaporte vigente, puede seleccionar la opción <strong>DPI</strong> para iniciar el trámite de su expediente.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        id="btn-doc-pasaporte"
                        onClick={() => setFormData({ ...formData, tipoDocumento: 'pasaporte' })}
                        className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                          formData.tipoDocumento === 'pasaporte'
                            ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20 text-slate-900 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                          formData.tipoDocumento === 'pasaporte' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-500'
                        }`}>
                          📘
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold">Pasaporte Oficial</span>
                            {formData.tipoDocumento === 'pasaporte' && (
                              <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black">ACTIVO</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            Tengo pasaporte emitido por mi país de origen
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        id="btn-doc-dpi"
                        onClick={() => setFormData({ ...formData, tipoDocumento: 'dpi' })}
                        className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                          formData.tipoDocumento === 'dpi'
                            ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20 text-slate-900 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                          formData.tipoDocumento === 'dpi' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-500'
                        }`}>
                          🪪
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold">DPI (No tengo pasaporte)</span>
                            {formData.tipoDocumento === 'dpi' && (
                              <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black">ACTIVO</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            Documento Personal de Identificación nacional
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      {formData.tipoDocumento === 'dpi' ? 'Número de DPI *' : 'Número de Pasaporte *'}
                    </label>
                    <input
                      id="input-numero-documento"
                      type="text"
                      value={formData.numeroPasaporte}
                      onChange={(e) => setFormData({ ...formData, numeroPasaporte: e.target.value })}
                      placeholder={formData.tipoDocumento === 'dpi' ? 'Ej: 2450 12345 0101' : 'Ej: G12345678'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium font-mono focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none uppercase"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      {formData.tipoDocumento === 'dpi'
                        ? 'Podrá tramitar o presentar su pasaporte antes de su cita consular.'
                        : 'Consigne el número tal como aparece en su libreta de pasaporte.'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Fecha de Nacimiento *
                    </label>
                    <input
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Nacionalidad
                    </label>
                    <input
                      type="text"
                      value={formData.nacionalidad}
                      onChange={(e) => setFormData({ ...formData, nacionalidad: e.target.value })}
                      placeholder="Mexicana, Colombiana, Peruana, etc."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      País de Residencia Actual
                    </label>
                    <input
                      type="text"
                      value={formData.paisResidencia}
                      onChange={(e) => setFormData({ ...formData, paisResidencia: e.target.value })}
                      placeholder="México, Colombia, etc."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PASO 2: Perfil Laboral y Formación */}
            {paso === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-lg font-black text-slate-900">Paso 2: Perfil Laboral y Experiencia</h3>
                  <p className="text-xs text-slate-500">Datos relevantes para validar su aptitud en el puesto solicitado</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Profesión u Oficio Principal *
                    </label>
                    <input
                      type="text"
                      value={formData.profesionOficio}
                      onChange={(e) => setFormData({ ...formData, profesionOficio: e.target.value })}
                      placeholder="Ej: Operador de Maquinaria Agrícola, Cocinero, Albañil, etc."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Años de Experiencia Comprobable
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={formData.experienciaAnos}
                      onChange={(e) => setFormData({ ...formData, experienciaAnos: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Nivel de Idioma Inglés
                    </label>
                    <select
                      value={formData.nivelIngles}
                      onChange={(e) => setFormData({ ...formData, nivelIngles: e.target.value as NivelIngles })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white"
                    >
                      <option value="ninguno">Ninguno / Nulo</option>
                      <option value="basico">Básico (A1 - A2)</option>
                      <option value="intermedio">Intermedio (B1 - B2)</option>
                      <option value="avanzado">Avanzado (C1 - C2)</option>
                      <option value="nativo">Nativo o Bilingüe</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Nivel Máximo de Estudios
                    </label>
                    <select
                      value={formData.nivelEstudio}
                      onChange={(e) => setFormData({ ...formData, nivelEstudio: e.target.value as NivelEstudio })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white"
                    >
                      <option value="primaria">Educación Primaria</option>
                      <option value="secundaria">Educación Secundaria / Bachillerato</option>
                      <option value="tecnico">Técnico o Vocacional</option>
                      <option value="universitario">Universitario Completo</option>
                      <option value="postgrado">Postgrado / Maestría</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Habilidades Clave (separadas por comas)
                    </label>
                    <input
                      type="text"
                      value={formData.habilidadesClaveTexto}
                      onChange={(e) => setFormData({ ...formData, habilidadesClaveTexto: e.target.value })}
                      placeholder="Ej: Manejo de tractor, soldadura MIG, inglés técnico, certificación sanitaria..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PASO 3: Programa de Visa y Antecedentes */}
            {paso === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-lg font-black text-slate-900">Paso 3: Categoría de Visa y Situación Migratoria</h3>
                  <p className="text-xs text-slate-500">Configuración del programa al que postula</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Tipo de Visa Solicitada
                  </label>
                  <select
                    value={formData.tipoVisa}
                    onChange={(e) => setFormData({ ...formData, tipoVisa: e.target.value as TipoVisa })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white"
                  >
                    <option value="H-2A">Visa H-2A - Trabajadores Agrícolas Temporales</option>
                    <option value="H-2B">Visa H-2B - Servicios, Construcción, Hotelería</option>
                    <option value="EB-3">Visa EB-3 - Residencia Permanente por Empleo (Green Card)</option>
                    <option value="J-1">Visa J-1 - Intercambio Cultural y Pasantías Remuneradas</option>
                    <option value="B-1/B-2">Visa B-1/B-2 - Negocios y Evaluación Previa</option>
                  </select>
                </div>

                <div className="pt-2 space-y-3">
                  <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.tieneOfertaLaboral}
                      onChange={(e) => setFormData({ ...formData, tieneOfertaLaboral: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">¿Ya cuenta con una empresa o empleador patrocinador?</span>
                      <span className="text-slate-500">Marque si una empresa en el extranjero ya le extendió una oferta certificada.</span>
                    </div>
                  </label>

                  {formData.tieneOfertaLaboral && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Nombre de la Empresa Patrocinadora
                      </label>
                      <input
                        type="text"
                        value={formData.empleadorPatrocinador}
                        onChange={(e) => setFormData({ ...formData, empleadorPatrocinador: e.target.value })}
                        placeholder="Ej: SunValley Farms LLC o Grand Mountain Lodge"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.visasPreviasEEUU}
                      onChange={(e) => setFormData({ ...formData, visasPreviasEEUU: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">¿Ha tenido visas estadounidenses otorgadas con anterioridad?</span>
                      <span className="text-slate-500">Turismo, visas de trabajo anteriores o intercambio.</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* PASO 4: Resumen y Consentimiento */}
            {paso === 4 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-lg font-black text-slate-900">Paso 4: Resumen de su Expediente y Consentimiento</h3>
                  <p className="text-xs text-slate-500">Verifique los datos antes de emitir su código de radicado oficial</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
                  <div className="flex justify-between pb-2 border-b border-slate-200/80">
                    <span className="text-slate-500">Postulante:</span>
                    <strong className="text-slate-900">{formData.nombres} {formData.apellidos}</strong>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200/80 items-center">
                    <span className="text-slate-500">Documento:</span>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider mr-2 bg-amber-100 text-amber-900 border border-amber-300">
                        {formData.tipoDocumento === 'dpi' ? 'DPI' : 'Pasaporte'}
                      </span>
                      <strong className="font-mono text-slate-900">{formData.numeroPasaporte} ({formData.nacionalidad})</strong>
                    </div>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200/80">
                    <span className="text-slate-500">Contacto:</span>
                    <span className="text-slate-900">{formData.email} • {formData.telefono}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200/80">
                    <span className="text-slate-500">Programa:</span>
                    <strong className="text-amber-700 font-bold">Visa {formData.tipoVisa} ({formData.profesionOficio})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Experiencia / Inglés:</span>
                    <span className="text-slate-900">{formData.experienciaAnos} años de exp. • Inglés {formData.nivelIngles}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-700">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.aceptoTerminos}
                      onChange={(e) => setFormData({ ...formData, aceptoTerminos: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500 mt-0.5"
                    />
                    <span>
                      Declaro bajo gravedad de juramento que todos los datos consignados son fidedignos, autorizo el tratamiento de mis datos personales para la gestión de mi expediente migratorio y acepto los términos de servicio de <strong>Visatrabajo Internacional</strong>.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Botones de navegación del asistente */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              {paso > 1 ? (
                <button
                  type="button"
                  onClick={retrocederPaso}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
              ) : (
                <div />
              )}

              {paso < 4 ? (
                <button
                  type="button"
                  onClick={avanzarPaso}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={enviando}
                  className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {enviando ? (
                    <span>Radicando Expediente...</span>
                  ) : (
                    <>
                      <FileCheck2 className="w-4 h-4" />
                      <span>Radicar Solicitud Oficial</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </form>

        </div>
      </section>

    </div>
  );
};
