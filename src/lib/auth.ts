/**
 * @file auth.ts
 * @description Gestión de autenticación, control de sesiones y roles para el
 * panel administrativo de Visa Laboral Internacional.
 */

import { SesionUsuario } from '../types';

const STORAGE_KEY_AUTH = 'vli_auth_session';

// Credenciales administrativas oficiales por defecto
const ADMIN_DEFAULT_EMAIL = 'visalaboralinternacional@gmail.com';
const ADMIN_DEFAULT_PASS = 'admin2026*';

/**
 * Servicio de autenticación con persistencia en localStorage/sessionStorage.
 */
class AuthService {
  private sesionActual: SesionUsuario = {
    autenticado: false,
    email: '',
    nombre: '',
    rol: 'administrador'
  };

  constructor() {
    this.cargarSesion();
  }

  /**
   * Carga la sesión guardada desde el almacenamiento local.
   */
  private cargarSesion(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY_AUTH);
      if (data) {
        const parsed = JSON.parse(data) as SesionUsuario;
        if (parsed && parsed.autenticado) {
          this.sesionActual = parsed;
        }
      }
    } catch {
      // Ignorar fallos de parseo
    }
  }

  /**
   * Intenta iniciar sesión con correo y contraseña.
   */
  async login(email: string, pass: string): Promise<{ exitoso: boolean; mensaje: string; sesion?: SesionUsuario }> {
    // Simula una pequeña latencia de red para realismo
    await new Promise((res) => setTimeout(res, 250));

    const emailNormalizado = email.trim().toLowerCase();

    // Verificación flexible para permitir acceso con la cuenta oficial o acceso de demostración
    const esEmailValido = emailNormalizado === ADMIN_DEFAULT_EMAIL || emailNormalizado === 'admin@visatrabajo.com';
    const esPassValida = pass === ADMIN_DEFAULT_PASS || pass === 'admin123' || pass === 'admin';

    if (esEmailValido && esPassValida) {
      const nuevaSesion: SesionUsuario = {
        autenticado: true,
        email: emailNormalizado,
        nombre: emailNormalizado === ADMIN_DEFAULT_EMAIL ? 'Coordinación Visatrabajo' : 'Administrador Legal',
        rol: 'administrador',
        token: 'vli_tk_' + Math.random().toString(36).substring(2) + Date.now(),
        fechaLogin: new Date().toISOString()
      };

      this.sesionActual = nuevaSesion;
      try {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(nuevaSesion));
      } catch {
        // Fallback en memoria
      }

      return {
        exitoso: true,
        mensaje: 'Bienvenido al panel de gestión de Visatrabajo Internacional',
        sesion: nuevaSesion
      };
    }

    return {
      exitoso: false,
      mensaje: 'Credenciales inválidas. Compruebe el correo y la contraseña.'
    };
  }

  /**
   * Cierra la sesión activa.
   */
  logout(): void {
    this.sesionActual = {
      autenticado: false,
      email: '',
      nombre: '',
      rol: 'administrador'
    };
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {
      // noop
    }
  }

  /**
   * Obtiene la sesión actual.
   */
  getSesion(): SesionUsuario {
    return { ...this.sesionActual };
  }

  /**
   * Comprueba si el usuario tiene una sesión activa.
   */
  estaAutenticado(): boolean {
    return this.sesionActual.autenticado;
  }
}

export const authService = new AuthService();
