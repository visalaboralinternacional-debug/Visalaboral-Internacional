/**
 * @file types.ts
 * @description Definiciones de tipos e interfaces TypeScript para el sistema
 * Visa Laboral Internacional. Arquitectura tipada y robusta.
 */

export type TipoVisa = 'H-2A' | 'H-2B' | 'EB-3' | 'J-1' | 'B-1/B-2';

export type EstadoSolicitud = 
  | 'pendiente'
  | 'en_revision'
  | 'documentacion_pendiente'
  | 'contrato_emitido'
  | 'aprobada'
  | 'rechazada';

export type NivelIngles = 'ninguno' | 'basico' | 'intermedio' | 'avanzado' | 'nativo';

export type NivelEstudio = 'primaria' | 'secundaria' | 'tecnico' | 'universitario' | 'postgrado';

export type EstadoRequisito = 'pendiente' | 'recibido' | 'validado' | 'observado';

export interface ItemRequisito {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  obligatorio: boolean;
  estado: EstadoRequisito;
  archivoUrl?: string;
  fechaActualizacion?: string;
  observaciones?: string;
}

export interface CategoriaRequisito {
  categoria: string;
  descripcion: string;
  items: ItemRequisito[];
}

export interface NotaHistorial {
  id: string;
  autor: string;
  mensaje: string;
  fecha: string;
  tipo: 'sistema' | 'legal' | 'cliente';
}

export interface Solicitud {
  id: string;
  radicado: string; // Ej: VLI-2026-7821
  fechaCreacion: string;
  fechaActualizacion: string;
  estado: EstadoSolicitud;
  
  // Datos personales
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  paisNacimiento: string;
  nacionalidad: string;
  paisResidencia: string;
  fechaNacimiento: string;
  numeroPasaporte: string;
  vencimientoPasaporte: string;
  
  // Perfil laboral y habilidades
  tipoVisa: TipoVisa;
  profesionOficio: string;
  experienciaAnos: number;
  nivelIngles: NivelIngles;
  nivelEstudio: NivelEstudio;
  habilidadesClave: string[];
  tieneOfertaLaboral: boolean;
  empleadorPatrocinador?: string;
  
  // Historial migratorio
  visasPreviasEEUU: boolean;
  denegacionesPrevias: boolean;
  detallesHistorial?: string;
  
  // Gestión documental y seguimiento
  checklists: CategoriaRequisito[];
  porcentajeCompletado: number;
  contratoGenerado: boolean;
  fechaContrato?: string;
  guiaDescargada: boolean;
  
  // Bitácora
  historialNotas: NotaHistorial[];
  contactoEmergencia?: {
    nombre: string;
    parentesco: string;
    telefono: string;
  };
}

export interface FiltrosSolicitudes {
  busqueda: string;
  tipoVisa?: TipoVisa | 'todas';
  estado?: EstadoSolicitud | 'todos';
  ordenPor: 'fecha' | 'radicado' | 'nombre' | 'progreso';
  ordenDir: 'asc' | 'desc';
  pagina: number;
  porPagina: number;
}

export interface EstadisticasDashboard {
  total: number;
  pendientes: number;
  enRevision: number;
  documentacionPendiente: number;
  aprobadas: number;
  rechazadas: number;
  porTipoVisa: Record<TipoVisa, number>;
  promedioProgreso: number;
}

export interface SesionUsuario {
  autenticado: boolean;
  email: string;
  nombre: string;
  rol: 'administrador' | 'asistente_legal';
  token?: string;
  fechaLogin?: string;
}

export interface ResultadoTest {
  nombre: string;
  categoria: string;
  exitoso: boolean;
  duracionMs: number;
  detalles?: string;
  error?: string;
}
