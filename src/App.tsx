/**
 * @file App.tsx
 * @description Componente raíz de la aplicación Visa Laboral Internacional.
 * Coordina navegación reactiva, autenticación, modales de seguimiento y suite de pruebas.
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PublicSolicitudPage } from './components/PublicSolicitudPage';
import { GraciasPage } from './components/GraciasPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { SolicitudDetailModal } from './components/SolicitudDetailModal';
import { TrackingModal } from './components/TrackingModal';
import { TestRunnerModal } from './components/TestRunnerModal';
import { authService } from './lib/auth';
import { Solicitud, SesionUsuario } from './types';
import { Globe, Shield, Mail, Phone, Heart } from 'lucide-react';

export default function App() {
  const [vistaActual, setVistaActual] = useState<'solicitar' | 'panel' | 'gracias'>('solicitar');
  const [sesion, setSesion] = useState<SesionUsuario>(authService.getSesion());
  
  // Solicitud recién creada para la pantalla de Gracias
  const [solicitudCreada, setSolicitudCreada] = useState<Solicitud | null>(null);

  // Solicitud seleccionada en el panel administrativo para ver expediente
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<Solicitud | null>(null);

  // Control de modales
  const [trackingAbierto, setTrackingAbierto] = useState(false);
  const [radicadoTracking, setRadicadoTracking] = useState('');
  const [testsAbierto, setTestsAbierto] = useState(false);

  // Sincroniza sesión
  useEffect(() => {
    setSesion(authService.getSesion());
  }, []);

  const handleLogout = () => {
    authService.logout();
    setSesion(authService.getSesion());
    setVistaActual('solicitar');
  };

  const handleSolicitudEnviada = (nueva: Solicitud) => {
    setSolicitudCreada(nueva);
    setVistaActual('gracias');
  };

  const handleRastrearDesdeGracias = (radicado: string) => {
    setRadicadoTracking(radicado);
    setTrackingAbierto(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Barra de navegación principal */}
      <Navbar
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        sesion={sesion}
        onLogout={handleLogout}
        onAbrirTracking={() => {
          setRadicadoTracking('');
          setTrackingAbierto(true);
        }}
        onAbrirTests={() => setTestsAbierto(true)}
      />

      {/* Contenedor de Vistas */}
      <main className="flex-1">
        {vistaActual === 'solicitar' && (
          <PublicSolicitudPage
            onSolicitudEnviada={handleSolicitudEnviada}
            onAbrirTracking={() => {
              setRadicadoTracking('');
              setTrackingAbierto(true);
            }}
          />
        )}

        {vistaActual === 'gracias' && solicitudCreada && (
          <GraciasPage
            solicitud={solicitudCreada}
            onRastrear={handleRastrearDesdeGracias}
            onVolverInicio={() => setVistaActual('solicitar')}
          />
        )}

        {vistaActual === 'panel' && (
          sesion.autenticado ? (
            <AdminDashboard
              onVerSolicitud={(s) => setSolicitudSeleccionada(s)}
              onNuevaSolicitud={() => setVistaActual('solicitar')}
            />
          ) : (
            <AdminLogin
              onLoginExitoso={(s) => setSesion(s)}
            />
          )
        )}
      </main>

      {/* Modal de Expediente y Checklist de Candidato */}
      <SolicitudDetailModal
        solicitud={solicitudSeleccionada}
        onCerrar={() => setSolicitudSeleccionada(null)}
        onActualizado={(act) => setSolicitudSeleccionada(act)}
      />

      {/* Modal de Rastreo Público */}
      <TrackingModal
        abierto={trackingAbierto}
        onCerrar={() => setTrackingAbierto(false)}
        radicadoInicial={radicadoTracking}
      />

      {/* Modal de Ejecución de Pruebas Unitarias */}
      <TestRunnerModal
        abierto={testsAbierto}
        onCerrar={() => setTestsAbierto(false)}
      />

      {/* Pie de Página Oficial */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Globe className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                VISATRABAJO INTERNACIONAL
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Plataforma tecnológica para la gestión, emisión de contratos y asesoría integral de trámites consulares de visas de trabajo (H-2A, H-2B, EB-3, J-1).
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Programas de Visa
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer" onClick={() => setVistaActual('solicitar')}>Visa H-2A: Agrícola Temporal</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer" onClick={() => setVistaActual('solicitar')}>Visa H-2B: Servicios & Construcción</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer" onClick={() => setVistaActual('solicitar')}>Visa EB-3: Residencia Permanente</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer" onClick={() => setVistaActual('solicitar')}>Visa J-1: Intercambio & Trainee</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Herramientas y Canales
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setTrackingAbierto(true)} className="hover:text-amber-400 transition-colors">
                  Rastrear mi Expediente en Vivo
                </button>
              </li>
              <li>
                <button onClick={() => setVistaActual('panel')} className="hover:text-amber-400 transition-colors">
                  Acceso al Panel Administrativo
                </button>
              </li>
              <li>
                <button onClick={() => setTestsAbierto(true)} className="hover:text-amber-400 transition-colors">
                  Ejecutar Pruebas Unitarias QA
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Contacto y Soporte
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-slate-300">visalaboralinternacional@gmail.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Protocolo de Protección de Datos Personales</span>
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                Atención jurídica y seguimiento de lunes a viernes de 8:00 a 18:00 (EST).
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 Visatrabajo Internacional S.A.S. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Sistema optimizado con arquitectura limpia y generación nativa de documentos DOCX.
          </p>
        </div>
      </footer>

    </div>
  );
}
