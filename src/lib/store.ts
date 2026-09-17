/**
 * @file store.ts
 * @description Repositorio y capa de persistencia reactiva para Solicitudes
 * de Visas Laborales Internacionales. Integra caché en memoria, indexación y
 * almacenamiento persistente (localStorage).
 */

import { Solicitud, FiltrosSolicitudes, EstadisticasDashboard, TipoVisa, EstadoSolicitud, EstadoRequisito } from '../types';
import { generarChecklistPorVisa, calcularProgresoChecklist } from './checklists';
import { cacheService } from './cache';

const STORAGE_KEY_SOLICITUDES = 'vli_solicitudes_db_v1';

// Datos de semilla realistas para iniciar el proyecto con información relevante
const SEMILLA_SOLICITUDES: Solicitud[] = [
  {
    id: 'sol-001',
    radicado: 'VLI-2026-1042',
    fechaCreacion: '2026-03-10T14:32:00Z',
    fechaActualizacion: '2026-03-16T09:15:00Z',
    estado: 'en_revision',
    nombres: 'Carlos Andrés',
    apellidos: 'Mendoza Ruiz',
    email: 'carlos.mendoza92@gmail.com',
    telefono: '+52 55 4192 8831',
    paisNacimiento: 'México',
    nacionalidad: 'Mexicana',
    paisResidencia: 'México',
    fechaNacimiento: '1992-06-14',
    numeroPasaporte: 'G28194012',
    vencimientoPasaporte: '2029-11-20',
    tipoVisa: 'H-2A',
    profesionOficio: 'Operador de Maquinaria Agrícola y Riego',
    experienciaAnos: 6,
    nivelIngles: 'basico',
    nivelEstudio: 'secundaria',
    habilidadesClave: ['Manejo de tractor', 'Sistemas de riego por goteo', 'Cosecha de frutales'],
    tieneOfertaLaboral: true,
    empleadorPatrocinador: 'SunValley Farms LLC (California)',
    visasPreviasEEUU: true,
    denegacionesPrevias: false,
    checklists: generarChecklistPorVisa('H-2A'),
    porcentajeCompletado: 75,
    contratoGenerado: true,
    fechaContrato: '2026-03-12T16:00:00Z',
    guiaDescargada: true,
    historialNotas: [
      {
        id: 'n-1',
        autor: 'Sistema',
        mensaje: 'Solicitud radicada a través del portal público.',
        fecha: '2026-03-10T14:32:00Z',
        tipo: 'sistema'
      },
      {
        id: 'n-2',
        autor: 'Lic. Mariana Soto (Legal)',
        mensaje: 'Pasaporte y certificación ETA-9142A revisados y aprobados con éxito.',
        fecha: '2026-03-14T11:20:00Z',
        tipo: 'legal'
      }
    ]
  },
  {
    id: 'sol-002',
    radicado: 'VLI-2026-1043',
    fechaCreacion: '2026-03-12T10:10:00Z',
    fechaActualizacion: '2026-03-15T18:40:00Z',
    estado: 'documentacion_pendiente',
    nombres: 'Valeria Sofía',
    apellidos: 'Gómez Restrepo',
    email: 'valeria.gomez@outlook.com',
    telefono: '+57 310 882 1944',
    paisNacimiento: 'Colombia',
    nacionalidad: 'Colombiana',
    paisResidencia: 'Colombia',
    fechaNacimiento: '1996-09-22',
    numeroPasaporte: 'AA9102834',
    vencimientoPasaporte: '2030-05-18',
    tipoVisa: 'H-2B',
    profesionOficio: 'Supervisora de Hotelería y Servicios Gastronómicos',
    experienciaAnos: 4,
    nivelIngles: 'intermedio',
    nivelEstudio: 'tecnico',
    habilidadesClave: ['Gestión de habitaciones', 'Servicio al huésped', 'Normas sanitarias'],
    tieneOfertaLaboral: true,
    empleadorPatrocinador: 'Ocean Resort & Spa (Florida)',
    visasPreviasEEUU: false,
    denegacionesPrevias: false,
    checklists: generarChecklistPorVisa('H-2B'),
    porcentajeCompletado: 45,
    contratoGenerado: false,
    guiaDescargada: true,
    historialNotas: [
      {
        id: 'n-3',
        autor: 'Sistema',
        mensaje: 'Solicitud radicada con éxito.',
        fecha: '2026-03-12T10:10:00Z',
        tipo: 'sistema'
      },
      {
        id: 'n-4',
        autor: 'Coordinación Visatrabajo',
        mensaje: 'Pendiente recepción del certificado de antecedentes penales apostillado.',
        fecha: '2026-03-15T18:40:00Z',
        tipo: 'legal'
      }
    ]
  },
  {
    id: 'sol-003',
    radicado: 'VLI-2026-1044',
    fechaCreacion: '2026-03-08T08:00:00Z',
    fechaActualizacion: '2026-03-16T15:00:00Z',
    estado: 'aprobada',
    nombres: 'Esteban Rodrigo',
    apellidos: 'Silva Morales',
    email: 'esteban.silva@gmail.com',
    telefono: '+51 984 210 992',
    paisNacimiento: 'Perú',
    nacionalidad: 'Peruana',
    paisResidencia: 'Perú',
    fechaNacimiento: '1989-12-05',
    numeroPasaporte: 'PE7718290',
    vencimientoPasaporte: '2031-01-15',
    tipoVisa: 'EB-3',
    profesionOficio: 'Ingeniero Industrial / Supervisor de Procesamiento de Alimentos',
    experienciaAnos: 8,
    nivelIngles: 'avanzado',
    nivelEstudio: 'universitario',
    habilidadesClave: ['Certificación HACCP', 'Gestión de cadenas de frío', 'Optimización de líneas'],
    tieneOfertaLaboral: true,
    empleadorPatrocinador: 'Midwest Meat Packers Corp (Nebraska)',
    visasPreviasEEUU: true,
    denegacionesPrevias: false,
    checklists: generarChecklistPorVisa('EB-3'),
    porcentajeCompletado: 100,
    contratoGenerado: true,
    fechaContrato: '2026-03-09T14:00:00Z',
    guiaDescargada: true,
    historialNotas: [
      {
        id: 'n-5',
        autor: 'Sistema',
        mensaje: 'Expediente radicado.',
        fecha: '2026-03-08T08:00:00Z',
        tipo: 'sistema'
      },
      {
        id: 'n-6',
        autor: 'Dirección Legal',
        mensaje: 'Aprobación PERM y Formulario I-140 corroborados. Expediente calificado para cita consular.',
        fecha: '2026-03-16T15:00:00Z',
        tipo: 'legal'
      }
    ]
  },
  {
    id: 'sol-004',
    radicado: 'VLI-2026-1045',
    fechaCreacion: '2026-03-16T11:20:00Z',
    fechaActualizacion: '2026-03-16T11:20:00Z',
    estado: 'pendiente',
    nombres: 'Camila Andrea',
    apellidos: 'Pérez Domínguez',
    email: 'camila.perez@hotmail.com',
    telefono: '+502 4190 2811',
    paisNacimiento: 'Guatemala',
    nacionalidad: 'Guatemalteca',
    paisResidencia: 'Guatemala',
    fechaNacimiento: '2001-04-18',
    numeroPasaporte: 'GT1192841',
    vencimientoPasaporte: '2028-08-30',
    tipoVisa: 'J-1',
    profesionOficio: 'Estudiante de Gastronomía y Artes Culinarias (Trainee)',
    experienciaAnos: 2,
    nivelIngles: 'intermedio',
    nivelEstudio: 'universitario',
    habilidadesClave: ['Cocina internacional', 'Pastelería', 'Trabajo en brigada'],
    tieneOfertaLaboral: true,
    empleadorPatrocinador: 'Grand Mountain Lodge (Colorado)',
    visasPreviasEEUU: false,
    denegacionesPrevias: false,
    checklists: generarChecklistPorVisa('J-1'),
    porcentajeCompletado: 20,
    contratoGenerado: false,
    guiaDescargada: false,
    historialNotas: [
      {
        id: 'n-7',
        autor: 'Sistema',
        mensaje: 'Solicitud recién enviada por el formulario público.',
        fecha: '2026-03-16T11:20:00Z',
        tipo: 'sistema'
      }
    ]
  }
];

type Listener = () => void;

class SolicitudStore {
  private solicitudes: Solicitud[] = [];
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.inicializar();
  }

  /**
   * Inicializa los datos desde localStorage o semilla predeterminada.
   */
  private inicializar(): void {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY_SOLICITUDES);
      if (guardado) {
        const parsed = JSON.parse(guardado) as Solicitud[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.solicitudes = parsed;
          return;
        }
      }
    } catch {
      // Ignorar fallo de almacenamiento
    }

    // Si no hay datos guardados, cargar semilla
    this.solicitudes = [...SEMILLA_SOLICITUDES];
    this.guardarEnDisco();
  }

  private guardarEnDisco(): void {
    try {
      localStorage.setItem(STORAGE_KEY_SOLICITUDES, JSON.stringify(this.solicitudes));
    } catch {
      // noop
    }
  }

  private notificar(): void {
    cacheService.invalidate('solicitudes:');
    this.guardarEnDisco();
    this.listeners.forEach((fn) => fn());
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Obtiene todas las solicitudes aplicando filtros, búsqueda, ordenación y paginación.
   */
  obtenerSolicitudes(filtros: FiltrosSolicitudes): { items: Solicitud[]; total: number; totalPaginas: number } {
    const cacheKey = `solicitudes:list:${JSON.stringify(filtros)}`;
    const cached = cacheService.get<{ items: Solicitud[]; total: number; totalPaginas: number }>(cacheKey);
    if (cached) return cached;

    let resultado = [...this.solicitudes];

    // Filtro por término de búsqueda (nombre, apellidos, email, pasaporte, radicado)
    if (filtros.busqueda && filtros.busqueda.trim() !== '') {
      const q = filtros.busqueda.trim().toLowerCase();
      resultado = resultado.filter((s) => {
        const nombreCompleto = `${s.nombres} ${s.apellidos}`.toLowerCase();
        return (
          nombreCompleto.includes(q) ||
          s.radicado.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.numeroPasaporte.toLowerCase().includes(q) ||
          s.profesionOficio.toLowerCase().includes(q) ||
          s.nacionalidad.toLowerCase().includes(q)
        );
      });
    }

    // Filtro por tipo de visa
    if (filtros.tipoVisa && filtros.tipoVisa !== 'todas') {
      resultado = resultado.filter((s) => s.tipoVisa === filtros.tipoVisa);
    }

    // Filtro por estado
    if (filtros.estado && filtros.estado !== 'todos') {
      resultado = resultado.filter((s) => s.estado === filtros.estado);
    }

    // Ordenación
    resultado.sort((a, b) => {
      let comp = 0;
      if (filtros.ordenPor === 'fecha') {
        comp = new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
      } else if (filtros.ordenPor === 'radicado') {
        comp = a.radicado.localeCompare(b.radicado);
      } else if (filtros.ordenPor === 'nombre') {
        comp = `${a.nombres} ${a.apellidos}`.localeCompare(`${b.nombres} ${b.apellidos}`);
      } else if (filtros.ordenPor === 'progreso') {
        comp = b.porcentajeCompletado - a.porcentajeCompletado;
      }
      return filtros.ordenDir === 'asc' ? -comp : comp;
    });

    const total = resultado.length;
    const totalPaginas = Math.ceil(total / filtros.porPagina) || 1;
    const inicio = (filtros.pagina - 1) * filtros.porPagina;
    const items = resultado.slice(inicio, inicio + filtros.porPagina);

    const respuesta = { items, total, totalPaginas };
    cacheService.set(cacheKey, respuesta, 30 * 1000); // 30s cache para listas
    return respuesta;
  }

  /**
   * Obtiene una solicitud por su identificador único.
   */
  obtenerPorId(id: string): Solicitud | null {
    const cacheKey = `solicitudes:id:${id}`;
    const cached = cacheService.get<Solicitud>(cacheKey);
    if (cached) return cached;

    const encontrada = this.solicitudes.find((s) => s.id === id) || null;
    if (encontrada) {
      cacheService.set(cacheKey, encontrada, 60 * 1000);
    }
    return encontrada;
  }

  /**
   * Obtiene una solicitud por su código de radicado (ej: VLI-2026-1042).
   */
  obtenerPorRadicado(radicado: string): Solicitud | null {
    const q = radicado.trim().toUpperCase();
    const cacheKey = `solicitudes:radicado:${q}`;
    const cached = cacheService.get<Solicitud>(cacheKey);
    if (cached) return cached;

    const encontrada = this.solicitudes.find((s) => s.radicado.toUpperCase() === q) || null;
    if (encontrada) {
      cacheService.set(cacheKey, encontrada, 60 * 1000);
    }
    return encontrada;
  }

  /**
   * Crea una nueva solicitud desde el formulario público o panel administrativo.
   */
  crearSolicitud(datos: Omit<Solicitud, 'id' | 'radicado' | 'fechaCreacion' | 'fechaActualizacion' | 'checklists' | 'porcentajeCompletado' | 'contratoGenerado' | 'guiaDescargada' | 'historialNotas'>): Solicitud {
    const anio = new Date().getFullYear();
    const numeroConsecutivo = Math.floor(1000 + Math.random() * 9000);
    const radicado = `VLI-${anio}-${numeroConsecutivo}`;
    const id = `sol-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const fechaActual = new Date().toISOString();

    const checklists = generarChecklistPorVisa(datos.tipoVisa);
    const porcentaje = calcularProgresoChecklist(checklists);

    const nueva: Solicitud = {
      ...datos,
      id,
      radicado,
      fechaCreacion: fechaActual,
      fechaActualizacion: fechaActual,
      checklists,
      porcentajeCompletado: porcentaje,
      contratoGenerado: false,
      guiaDescargada: false,
      historialNotas: [
        {
          id: `n-${Date.now()}`,
          autor: 'Sistema',
          mensaje: `Expediente generado exitosamente con radicado ${radicado}. Categoría solicitada: Visa ${datos.tipoVisa}.`,
          fecha: fechaActual,
          tipo: 'sistema'
        }
      ]
    };

    this.solicitudes.unshift(nueva);
    this.notificar();
    return nueva;
  }

  /**
   * Actualiza propiedades de una solicitud existente.
   */
  actualizarSolicitud(id: string, actualizacion: Partial<Solicitud>, autorNota?: string, textoNota?: string): Solicitud | null {
    const indice = this.solicitudes.findIndex((s) => s.id === id);
    if (indice === -1) return null;

    const actual = this.solicitudes[indice];
    const fechaActual = new Date().toISOString();

    const notas = [...actual.historialNotas];
    if (textoNota) {
      notas.unshift({
        id: `n-${Date.now()}`,
        autor: autorNota || 'Administración',
        mensaje: textoNota,
        fecha: fechaActual,
        tipo: 'legal'
      });
    }

    let checklists = actualizacion.checklists || actual.checklists;
    // Si cambió el tipo de visa, recalcula checklists
    if (actualizacion.tipoVisa && actualizacion.tipoVisa !== actual.tipoVisa) {
      checklists = generarChecklistPorVisa(actualizacion.tipoVisa);
    }
    const porcentaje = calcularProgresoChecklist(checklists);

    const actualizada: Solicitud = {
      ...actual,
      ...actualizacion,
      checklists,
      porcentajeCompletado: porcentaje,
      historialNotas: notas,
      fechaActualizacion: fechaActual
    };

    this.solicitudes[indice] = actualizada;
    this.notificar();
    return actualizada;
  }

  /**
   * Actualiza el estado de un ítem de checklist en una solicitud.
   */
  actualizarItemChecklist(solicitudId: string, itemId: string, nuevoEstado: EstadoRequisito, observaciones?: string): Solicitud | null {
    const solicitud = this.obtenerPorId(solicitudId);
    if (!solicitud) return null;

    const categoriasClonadas = solicitud.checklists.map((cat) => ({
      ...cat,
      items: cat.items.map((it) => {
        if (it.id === itemId) {
          return {
            ...it,
            estado: nuevoEstado,
            observaciones: observaciones !== undefined ? observaciones : it.observaciones,
            fechaActualizacion: new Date().toISOString()
          };
        }
        return it;
      })
    }));

    return this.actualizarSolicitud(
      solicitudId,
      { checklists: categoriasClonadas },
      'Coordinación de Documentación',
      `Ítem de requisito actualizado a estado: ${nuevoEstado.toUpperCase()}.`
    );
  }

  /**
   * Elimina una solicitud del almacén.
   */
  eliminarSolicitud(id: string): boolean {
    const longitudPrevia = this.solicitudes.length;
    this.solicitudes = this.solicitudes.filter((s) => s.id !== id);
    if (this.solicitudes.length !== longitudPrevia) {
      this.notificar();
      return true;
    }
    return false;
  }

  /**
   * Calcula estadísticas ejecutivas del dashboard.
   */
  obtenerEstadisticas(): EstadisticasDashboard {
    const cacheKey = 'solicitudes:estadisticas';
    const cached = cacheService.get<EstadisticasDashboard>(cacheKey);
    if (cached) return cached;

    const stats: EstadisticasDashboard = {
      total: this.solicitudes.length,
      pendientes: 0,
      enRevision: 0,
      documentacionPendiente: 0,
      aprobadas: 0,
      rechazadas: 0,
      porTipoVisa: {
        'H-2A': 0,
        'H-2B': 0,
        'EB-3': 0,
        'J-1': 0,
        'B-1/B-2': 0
      },
      promedioProgreso: 0
    };

    let sumaProgreso = 0;

    for (const s of this.solicitudes) {
      if (s.estado === 'pendiente') stats.pendientes++;
      else if (s.estado === 'en_revision') stats.enRevision++;
      else if (s.estado === 'documentacion_pendiente') stats.documentacionPendiente++;
      else if (s.estado === 'aprobada') stats.aprobadas++;
      else if (s.estado === 'rechazada') stats.rechazadas++;

      if (stats.porTipoVisa[s.tipoVisa] !== undefined) {
        stats.porTipoVisa[s.tipoVisa]++;
      }

      sumaProgreso += s.porcentajeCompletado;
    }

    stats.promedioProgreso = stats.total > 0 ? Math.round(sumaProgreso / stats.total) : 0;

    cacheService.set(cacheKey, stats, 60 * 1000);
    return stats;
  }

  /**
   * Restablece los datos de fábrica a la semilla original.
   */
  restablecerSemilla(): void {
    this.solicitudes = [...SEMILLA_SOLICITUDES];
    this.notificar();
  }
}

export const solicitudStore = new SolicitudStore();
