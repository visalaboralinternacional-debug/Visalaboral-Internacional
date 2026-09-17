/**
 * @file checklists.ts
 * @description Catálogo oficial y generador de listas de chequeo de requisitos
 * por tipo de visa (H-2A, H-2B, EB-3, J-1, B-1/B-2).
 */

import { CategoriaRequisito, ItemRequisito, TipoVisa } from '../types';

/**
 * Genera la estructura de requisitos según la visa solicitada.
 */
export function generarChecklistPorVisa(tipoVisa: TipoVisa): CategoriaRequisito[] {
  switch (tipoVisa) {
    case 'H-2A':
      return [
        {
          categoria: 'Identificación y Antecedentes',
          descripcion: 'Documentos personales básicos y verificación legal del solicitante',
          items: [
            {
              id: 'h2a-pasaporte',
              codigo: 'DOC-01',
              nombre: 'Pasaporte Vigente',
              descripcion: 'Pasaporte con al menos 6 meses de vigencia posterior al periodo de estadía laboral previsto.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'h2a-antecedentes',
              codigo: 'DOC-02',
              nombre: 'Certificado de Antecedentes Penales/Policiales',
              descripcion: 'Certificado oficial emitido por la policía nacional del país de origen, debidamente legalizado.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'h2a-nacimiento',
              codigo: 'DOC-03',
              nombre: 'Partida o Acta de Nacimiento',
              descripcion: 'Copia oficial legible y traducida al inglés si aplica.',
              obligatorio: true,
              estado: 'pendiente'
            }
          ]
        },
        {
          categoria: 'Perfil Agrícola y Aptitud',
          descripcion: 'Demostración de capacidades físicas y laborales en el campo',
          items: [
            {
              id: 'h2a-cv',
              codigo: 'AGR-01',
              nombre: 'Currículum Laboral / Hoja de Vida',
              descripcion: 'Detalle cronológico de labores en siembra, cosecha, riego o manejo de maquinaria agrícola.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'h2a-medico',
              codigo: 'AGR-02',
              nombre: 'Certificado Médico de Aptitud Física',
              descripcion: 'Examen de salud ocupacional acreditando capacidad para trabajo físico intensivo a la intemperie.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'h2a-referencias',
              codigo: 'AGR-03',
              nombre: 'Cartas de Recomendación Laboral',
              descripcion: 'Mínimo una referencia de patrón o empresa agrícola previa con datos de contacto verificables.',
              obligatorio: false,
              estado: 'pendiente'
            }
          ]
        },
        {
          categoria: 'Documentación Consular y Patrocinio',
          descripcion: 'Formatos del empleador estadounidense y confirmaciones consulares',
          items: [
            {
              id: 'h2a-eta9142',
              codigo: 'CON-01',
              nombre: 'Certificación Laboral ETA-9142A',
              descripcion: 'Aprobación del Departamento de Trabajo de EE.UU. gestionada por el empleador patrocinador.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'h2a-i129',
              codigo: 'CON-02',
              nombre: 'Petición I-129 Aprobada (Formulario I-797)',
              descripcion: 'Notificación de acción de USCIS certificando la petición de trabajadores extranjeros.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'h2a-ds160',
              codigo: 'CON-03',
              nombre: 'Formulario Consular DS-160',
              descripcion: 'Hoja de confirmación con código de barras de la solicitud electrónica de visa de no inmigrante.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'h2a-mrv',
              codigo: 'CON-04',
              nombre: 'Comprobante de Pago Consular (MRV)',
              descripcion: 'Recibo oficial del arancel consular emitido por la embajada o centro de citas.',
              obligatorio: true,
              estado: 'pendiente'
            }
          ]
        }
      ];

    case 'H-2B':
      return [
        {
          categoria: 'Identificación y Certificados',
          descripcion: 'Documentos civiles y certificados de antecedentes oficiales',
          items: [
            {
              id: 'h2b-pasaporte',
              codigo: 'DOC-01',
              nombre: 'Pasaporte Vigente',
              descripcion: 'Pasaporte con vigencia superior a 6 meses con páginas libres para estampado.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'h2b-antecedentes',
              codigo: 'DOC-02',
              nombre: 'Récord Policial / Antecedentes Penales',
              descripcion: 'Documento original apostillado o legalizado sin antecedentes graves.',
              obligatorio: true,
              estado: 'pendiente'
            }
          ]
        },
        {
          categoria: 'Experiencia No Agrícola (Servicios / Construcción)',
          descripcion: 'Acreditación de experiencia en oficios específicos',
          items: [
            {
              id: 'h2b-cv',
              codigo: 'EXP-01',
              nombre: 'Currículum Vitae Estandarizado',
              descripcion: 'Experiencia demostrada en hotelería, gastronomía, construcción, paisajismo o limpieza.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'h2b-certificados',
              codigo: 'EXP-02',
              nombre: 'Constancias Laborales o Diplomas',
              descripcion: 'Certificados de cursos técnicos o cartas de antiguos empleadores.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'h2b-medico',
              codigo: 'EXP-03',
              nombre: 'Certificado de Salud General',
              descripcion: 'Evaluación clínica que certifique estado óptimo de salud.',
              obligatorio: true,
              estado: 'pendiente'
            }
          ]
        },
        {
          categoria: 'Fase Consular y Patrocinador',
          descripcion: 'Aprobaciones legales de USCIS y Departamento de Trabajo',
          items: [
            {
              id: 'h2b-eta9142b',
              codigo: 'CON-01',
              nombre: 'Certificación Laboral ETA-9142B',
              descripcion: 'Aprobación laboral no agrícola emitida por el DOL.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'h2b-i797',
              codigo: 'CON-02',
              nombre: 'Aprobación Petición I-797 (I-129)',
              descripcion: 'Resolución aprobatoria emitida por el Servicio de Inmigración y Ciudadanía.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'h2b-ds160',
              codigo: 'CON-03',
              nombre: 'Confirmación DS-160 y Pago MRV',
              descripcion: 'Trámite consular y programación de huellas y entrevista.',
              obligatorio: true,
              estado: 'pendiente'
            }
          ]
        }
      ];

    case 'EB-3':
      return [
        {
          categoria: 'Documentos Civiles y Titulación',
          descripcion: 'Sustentos académicos y de identidad para residencia permanente',
          items: [
            {
              id: 'eb3-pasaporte',
              codigo: 'CIV-01',
              nombre: 'Pasaporte Vigente y Registro Civil',
              descripcion: 'Pasaporte, acta de nacimiento y acta de matrimonio si incluye cónyuge.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'eb3-titulos',
              codigo: 'ACA-01',
              nombre: 'Títulos Académicos y Homologación',
              descripcion: 'Título universitario o técnico con equivalencia de credenciales para EE.UU. (WES o ECE).',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'eb3-experiencia',
              codigo: 'EXP-01',
              nombre: 'Cartas de Experiencia Demostrable (Mínimo 2 años)',
              descripcion: 'Cartas con membrete detallando cargo, funciones y periodo exacto de servicio.',
              obligatorio: true,
              estado: 'pendiente'
            }
          ]
        },
        {
          categoria: 'Proceso Laboral Permanente (PERM) y USCIS',
          descripcion: 'Etapas rigurosas de certificación ante el DOL y USCIS',
          items: [
            {
              id: 'eb3-perm',
              codigo: 'DOL-01',
              nombre: 'Certificación Laboral PERM (ETA 9089)',
              descripcion: 'Certificación de que no existen trabajadores estadounidenses calificados para la vacante.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'eb3-i140',
              codigo: 'USCIS-01',
              nombre: 'Petición de Inmigrante I-140 Aprobada',
              descripcion: 'Petición formal de residencia permanente patrocinada por la empresa empleadora.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'eb3-ds260',
              codigo: 'NVC-01',
              nombre: 'Procesamiento Consular NVC (Formulario DS-260)',
              descripcion: 'Expediente del Centro Nacional de Visas y tarifa de visa de inmigrante.',
              obligatorio: true,
              estado: 'pendiente'
            }
          ]
        }
      ];

    case 'J-1':
      return [
        {
          categoria: 'Programa de Intercambio y Patrocinador',
          descripcion: 'Acreditación universitaria y formularios de la entidad patrocinadora (Designated Sponsor)',
          items: [
            {
              id: 'j1-ds2019',
              codigo: 'SPN-01',
              nombre: 'Certificado de Elegibilidad Formulario DS-2019',
              descripcion: 'Documento base emitido por la organización patrocinadora oficial del Departamento de Estado.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'j1-ds7002',
              codigo: 'SPN-02',
              nombre: 'Plan de Pasantía / Entrenamiento DS-7002',
              descripcion: 'Plan detallado de objetivos y fases de capacitación firmado por la empresa y el sponsor.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'j1-sevis',
              codigo: 'SEV-01',
              nombre: 'Comprobante de Pago Tarifa SEVIS I-901',
              descripcion: 'Recibo oficial del sistema de información de estudiantes y visitantes de intercambio.',
              obligatorio: true,
              estado: 'pendiente'
            }
          ]
        },
        {
          categoria: 'Requisitos Consulares y Académicos',
          descripcion: 'Perfil del participante y trámites ante la embajada',
          items: [
            {
              id: 'j1-pasaporte',
              codigo: 'DOC-01',
              nombre: 'Pasaporte Vigente',
              descripcion: 'Pasaporte con validez mínima durante todo el programa de intercambio.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'j1-ingles',
              codigo: 'ING-01',
              nombre: 'Certificado o Evaluación de Inglés',
              descripcion: 'Entrevista o examen que certifique nivel suficiente para desenvolverse en el entorno laboral.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'j1-ds160',
              codigo: 'CON-01',
              nombre: 'Formulario DS-160 y Cita Consular',
              descripcion: 'Confirmación electrónica y agendamiento de entrevista para visa J-1.',
              obligatorio: true,
              estado: 'pendiente'
            }
          ]
        }
      ];

    case 'B-1/B-2':
    default:
      return [
        {
          categoria: 'Identificación y Arraigo',
          descripcion: 'Comprobación de lazos económicos, familiares y de residencia en el país de origen',
          items: [
            {
              id: 'b1-pasaporte',
              codigo: 'DOC-01',
              nombre: 'Pasaporte Vigente',
              descripcion: 'Vigencia de al menos 6 meses con páginas en blanco.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'b1-arraigo',
              codigo: 'ARR-01',
              nombre: 'Comprobantes de Arraigo (Trabajo / Bienes)',
              descripcion: 'Carta laboral actual, escrituras de propiedad o constancias de estudio vigentes.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'b1-bancario',
              codigo: 'FIN-01',
              nombre: 'Extractos Bancarios (Últimos 3 a 6 meses)',
              descripcion: 'Demostración de solvencia económica para costear la estadía temporal.',
              obligatorio: true,
              estado: 'pendiente'
            },
            {
              id: 'b1-ds160',
              codigo: 'CON-01',
              nombre: 'Formulario DS-160 y Arancel MRV',
              descripcion: 'Llenado del formulario consular y pago de derechos de entrevista.',
              obligatorio: true,
              estado: 'pendiente'
            }
          ]
        }
      ];
  }
}

/**
 * Calcula el porcentaje de avance de un checklist.
 * Solo los ítems obligatorios cuentan para el 100% de cumplimiento formal.
 */
export function calcularProgresoChecklist(categorias: CategoriaRequisito[]): number {
  let totalObligatorios = 0;
  let validadosObligatorios = 0;

  for (const cat of categorias) {
    for (const item of cat.items) {
      if (item.obligatorio) {
        totalObligatorios++;
        if (item.estado === 'validado') {
          validadosObligatorios++;
        } else if (item.estado === 'recibido') {
          validadosObligatorios += 0.5; // progreso parcial
        }
      }
    }
  }

  if (totalObligatorios === 0) return 0;
  return Math.min(100, Math.round((validadosObligatorios / totalObligatorios) * 100));
}

/**
 * Retorna el conteo total de items por estado.
 */
export function contarEstadosChecklist(categorias: CategoriaRequisito[]): Record<string, number> {
  const conteo: Record<string, number> = {
    total: 0,
    pendientes: 0,
    recibidos: 0,
    validados: 0,
    observados: 0
  };

  for (const cat of categorias) {
    for (const item of cat.items) {
      conteo.total++;
      if (item.estado === 'pendiente') conteo.pendientes++;
      if (item.estado === 'recibido') conteo.recibidos++;
      if (item.estado === 'validado') conteo.validados++;
      if (item.estado === 'observado') conteo.observados++;
    }
  }

  return conteo;
}
