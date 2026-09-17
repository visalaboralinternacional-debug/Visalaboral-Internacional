/**
 * @file Navbar.tsx
 * @description Barra de navegación superior con identidad corporativa, selector de vistas,
 * acceso a seguimiento de trámites, ejecución de tests y control de sesión.
 */

import React from 'react';
import { 
  Globe, 
  FileCheck2, 
  Search, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  CheckCircle2, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { SesionUsuario } from '../types';

interface NavbarProps {
  vistaActual: 'solicitar' | 'panel' | 'gracias';
  setVistaActual: (vista: 'solicitar' | 'panel' | 'gracias') => void;
  sesion: SesionUsuario;
  onLogout: () => void;
  onAbrirTracking: () => void;
  onAbrirTests: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  vistaActual,
  setVistaActual,
  sesion,
  onLogout,
  onAbrirTracking,
  onAbrirTests
}) => {
  return (
    <header id="header-navbar" className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo y Nombre de Marca */}
          <div 
            id="brand-logo-container"
            onClick={() => setVistaActual('solicitar')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Globe className="w-6 h-6 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg sm:text-xl text-white">
                  VISATRABAJO
                </span>
                <span className="text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 uppercase tracking-widest hidden sm:inline-block">
                  Internacional
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Portal de Gestión & Asesoría Migratoria Laboral
              </p>
            </div>
          </div>

          {/* Navegación central y utilidades */}
          <nav className="flex items-center gap-2 sm:gap-4">
            
            {/* Botón de Rastrear Trámite */}
            <button
              id="btn-rastrear-tramite"
              onClick={onAbrirTracking}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/60"
              title="Consulte el avance de su trámite con su código de radicado"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Rastrear</span> Trámite
            </button>

            {/* Selector: Solicitar Visa */}
            <button
              id="btn-nav-solicitar"
              onClick={() => setVistaActual('solicitar')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                vistaActual === 'solicitar'
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Solicitar Visa</span>
            </button>

            {/* Selector: Panel Administrativo */}
            <button
              id="btn-nav-panel"
              onClick={() => setVistaActual('panel')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                vistaActual === 'panel'
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Panel</span> Admin
              {sesion.autenticado && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
              )}
            </button>

            {/* Botón de Pruebas Unitarias QA */}
            <button
              id="btn-nav-tests"
              onClick={onAbrirTests}
              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
              title="Ejecutar suite de pruebas unitarias y cobertura de código"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Logout si está autenticado */}
            {sesion.autenticado && (
              <button
                id="btn-nav-logout"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 border border-rose-900/40 transition-colors"
                title="Cerrar sesión de administrador"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Salir</span>
              </button>
            )}

          </nav>
        </div>
      </div>
    </header>
  );
};
