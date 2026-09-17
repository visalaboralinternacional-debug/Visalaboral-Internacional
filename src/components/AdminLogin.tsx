/**
 * @file AdminLogin.tsx
 * @description Formulario de acceso administrativo con validación y atajos para
 * el equipo de Visatrabajo Internacional (visalaboralinternacional@gmail.com).
 */

import React, { useState } from 'react';
import { Lock, Mail, Key, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { authService } from '../lib/auth';
import { SesionUsuario } from '../types';

interface AdminLoginProps {
  onLoginExitoso: (sesion: SesionUsuario) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginExitoso }) => {
  const [email, setEmail] = useState('visalaboralinternacional@gmail.com');
  const [password, setPassword] = useState('admin2026*');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      const res = await authService.login(email, password);
      if (res.exitoso && res.sesion) {
        onLoginExitoso(res.sesion);
      } else {
        setError(res.mensaje);
      }
    } catch {
      setError('Error al procesar la autenticación. Intente nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  const aplicarCredencialesDemo = () => {
    setEmail('visalaboralinternacional@gmail.com');
    setPassword('admin2026*');
    setError(null);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div 
        id="card-admin-login"
        className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/80 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Cabecera */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold mb-4 shadow-inner">
            <Lock className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Portal Administrativo
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
            Acceso exclusivo para el equipo legal y consultores autorizados de Visatrabajo Internacional
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                id="input-login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                placeholder="visalaboralinternacional@gmail.com"
              />
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <input
                id="input-login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-sm font-medium outline-none transition-all placeholder:text-slate-400 font-mono"
                placeholder="••••••••••••"
              />
              <Key className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            id="btn-login-submit"
            type="submit"
            disabled={cargando}
            className="w-full mt-2 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {cargando ? (
              <span>Verificando credenciales...</span>
            ) : (
              <>
                <span>Iniciar Sesión Segura</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Tarjeta de ayuda rápida para revisores */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Credenciales Oficiales
              </span>
              <button
                type="button"
                onClick={aplicarCredencialesDemo}
                className="text-xs text-amber-600 hover:text-amber-700 font-semibold underline cursor-pointer"
              >
                Autocompletar
              </button>
            </div>
            <p className="text-xs text-slate-700 font-mono mt-1">
              Usuario: <span className="font-semibold">visalaboralinternacional@gmail.com</span>
            </p>
            <p className="text-xs text-slate-700 font-mono">
              Clave: <span className="font-semibold">admin2026*</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
