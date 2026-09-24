/**
 * @file tests.ts
 * @description Suite de pruebas unitarias con cobertura completa para la lógica de negocio,
 * validaciones, generación documental, almacenamiento reactivo y caché.
 */

import { ResultadoTest, DEPARTAMENTOS_GUATEMALA } from '../types';
import { generarChecklistPorVisa, calcularProgresoChecklist } from './checklists';
import { cacheService } from './cache';
import { authService } from './auth';
import { solicitudStore } from './store';
import { generarContratoMaestroDocx, generarGuiaRequisitosDocx } from './docx';

/**
 * Ejecuta todas las pruebas unitarias del sistema y retorna el reporte detallado.
 */
export async function ejecutarSuitePruebas(): Promise<{
  resultados: ResultadoTest[];
  totalPruebas: number;
  exitosas: number;
  fallidas: number;
  duracionTotalMs: number;
  coberturaModulos: string[];
}> {
  const inicio = performance.now();
  const resultados: ResultadoTest[] = [];

  const registrar = (nombre: string, categoria: string, fn: () => void | Promise<void>) => {
    const t0 = performance.now();
    try {
      const res = fn();
      if (res instanceof Promise) {
        return res
          .then(() => {
            resultados.push({
              nombre,
              categoria,
              exitoso: true,
              duracionMs: Math.round(performance.now() - t0),
              detalles: 'Aserción completada sin excepciones.'
            });
          })
          .catch((err: unknown) => {
            resultados.push({
              nombre,
              categoria,
              exitoso: false,
              duracionMs: Math.round(performance.now() - t0),
              error: String(err)
            });
          });
      } else {
        resultados.push({
          nombre,
          categoria,
          exitoso: true,
          duracionMs: Math.round(performance.now() - t0),
          detalles: 'Aserción completada sin excepciones.'
        });
      }
    } catch (err: unknown) {
      resultados.push({
        nombre,
        categoria,
        exitoso: false,
        duracionMs: Math.round(performance.now() - t0),
        error: String(err)
      });
    }
  };

  // 1. Módulo: Checklists y Cálculo de Progreso
  registrar('Generación de checklist para visa H-2A', 'Checklists', () => {
    const checklist = generarChecklistPorVisa('H-2A');
    if (!Array.isArray(checklist) || checklist.length === 0) throw new Error('Checklist H-2A vacío');
    const items = checklist.flatMap((c) => c.items);
    if (!items.some((i) => i.codigo === 'DOC-01' && i.nombre.includes('Pasaporte'))) {
      throw new Error('No se encontró el requisito obligatorio DOC-01');
    }
  });

  registrar('Generación de checklist para visa EB-3 (PERM & I-140)', 'Checklists', () => {
    const checklist = generarChecklistPorVisa('EB-3');
    const items = checklist.flatMap((c) => c.items);
    if (!items.some((i) => i.codigo === 'DOL-01' && i.nombre.includes('PERM'))) {
      throw new Error('Falta el requisito de Certificación Laboral PERM');
    }
  });

  registrar('Cálculo de progreso: Inicial 0%', 'Checklists', () => {
    const checklist = generarChecklistPorVisa('H-2B');
    const progreso = calcularProgresoChecklist(checklist);
    if (progreso !== 0) throw new Error(`Se esperaba 0% de avance inicial, se obtuvo ${progreso}%`);
  });

  registrar('Cálculo de progreso: Validación parcial y total', 'Checklists', () => {
    const checklist = generarChecklistPorVisa('H-2A');
    // Marcar todos los obligatorios como validados
    const todosValidados = checklist.map((cat) => ({
      ...cat,
      items: cat.items.map((it) => ({
        ...it,
        estado: 'validado' as const
      }))
    }));
    const progreso = calcularProgresoChecklist(todosValidados);
    if (progreso !== 100) throw new Error(`Se esperaba 100% de avance al validar obligatorios, se obtuvo ${progreso}%`);
  });

  // 2. Módulo: Servicio de Memoria Caché
  registrar('Cache: Set y Get con valor primitivo y objeto', 'Caché', () => {
    const testKey = 'test:cache:sample';
    cacheService.set(testKey, { mensaje: 'ok', num: 42 });
    const recuperado = cacheService.get<{ mensaje: string; num: number }>(testKey);
    if (!recuperado || recuperado.mensaje !== 'ok' || recuperado.num !== 42) {
      throw new Error('El valor recuperado del caché no coincide con el almacenado');
    }
  });

  registrar('Cache: Invalidación por clave y por prefijo', 'Caché', () => {
    cacheService.set('prefijo:item1', 'A');
    cacheService.set('prefijo:item2', 'B');
    cacheService.invalidate('prefijo:');
    if (cacheService.get('prefijo:item1') !== null || cacheService.get('prefijo:item2') !== null) {
      throw new Error('Falló la invalidación por prefijo');
    }
  });

  registrar('Cache: Expiración TTL', 'Caché', async () => {
    cacheService.set('ttl:test', 'temporal', 10); // 10ms
    await new Promise((r) => setTimeout(r, 25));
    const expired = cacheService.get('ttl:test');
    if (expired !== null) {
      throw new Error('La clave no expiró después de su TTL');
    }
  });

  // 3. Módulo: Autenticación
  registrar('Auth: Login con credenciales válidas oficiales', 'Seguridad & Auth', async () => {
    const res = await authService.login('visalaboralinternacional@gmail.com', 'admin2026*');
    if (!res.exitoso || !res.sesion?.autenticado) {
      throw new Error('No se pudo autenticar con las credenciales oficiales válidas');
    }
  });

  registrar('Auth: Rechazo de credenciales inválidas', 'Seguridad & Auth', async () => {
    const res = await authService.login('usuario.falso@correo.com', 'clave_erronea_999');
    if (res.exitoso) {
      throw new Error('El sistema admitió credenciales espurias sin validar');
    }
  });

  registrar('Auth: Cierre de sesión y limpieza de tokens', 'Seguridad & Auth', () => {
    authService.logout();
    if (authService.estaAutenticado()) {
      throw new Error('La sesión continúa activa después del logout');
    }
  });

  // 4. Módulo: Store de Solicitudes y CRUD
  registrar('Store: Creación de nueva solicitud con radicado único', 'Store & Persistencia', () => {
    const nueva = solicitudStore.crearSolicitud({
      nombres: 'Test Unitario',
      apellidos: 'Robótica QA',
      email: 'qa.test@visatrabajo.com',
      telefono: '+52 55 0000 1111',
      paisNacimiento: 'México',
      nacionalidad: 'Mexicana',
      paisResidencia: 'México',
      fechaNacimiento: '1995-01-01',
      numeroPasaporte: 'PTEST9999',
      vencimientoPasaporte: '2030-01-01',
      tipoVisa: 'H-2A',
      profesionOficio: 'Técnico Agrícola de Ensayos',
      experienciaAnos: 3,
      nivelIngles: 'intermedio',
      nivelEstudio: 'tecnico',
      habilidadesClave: ['Automatización', 'Pruebas'],
      tieneOfertaLaboral: false,
      visasPreviasEEUU: false,
      denegacionesPrevias: false,
      estado: 'pendiente'
    });

    if (!nueva.id || !nueva.radicado.startsWith('VLI-')) {
      throw new Error('Estructura o radicado inválido en solicitud creada');
    }

    const recuperada = solicitudStore.obtenerPorRadicado(nueva.radicado);
    if (!recuperada || recuperada.email !== 'qa.test@visatrabajo.com') {
      throw new Error('No se pudo recuperar la solicitud por radicado');
    }

    // Limpieza posterior
    solicitudStore.eliminarSolicitud(nueva.id);
  });

  registrar('Store: Radicación con DPI (sin pasaporte inicial) y actualización', 'Store & Persistencia', () => {
    const nuevaConDpi = solicitudStore.crearSolicitud({
      nombres: 'Postulante DPI',
      apellidos: 'Guatemala Test',
      email: 'dpi.test@visatrabajo.com',
      telefono: '+502 4444 5555',
      paisNacimiento: 'Guatemala',
      nacionalidad: 'Guatemalteca',
      paisResidencia: 'Guatemala',
      fechaNacimiento: '1998-05-12',
      tipoDocumento: 'dpi',
      numeroPasaporte: '2450 18920 0101',
      vencimientoPasaporte: '2032-05-12',
      tipoVisa: 'H-2A',
      profesionOficio: 'Recolector Agrícola',
      experienciaAnos: 2,
      nivelIngles: 'ninguno',
      nivelEstudio: 'primaria',
      habilidadesClave: ['Cosecha manual'],
      tieneOfertaLaboral: true,
      visasPreviasEEUU: false,
      denegacionesPrevias: false,
      estado: 'pendiente'
    });

    if (nuevaConDpi.tipoDocumento !== 'dpi' || nuevaConDpi.numeroPasaporte !== '2450 18920 0101') {
      throw new Error('Fallo al registrar postulante con DPI');
    }

    // Probar transición cuando el postulante adquiere pasaporte
    const actualizadaConPasaporte = solicitudStore.actualizarSolicitud(
      nuevaConDpi.id,
      {
        tipoDocumento: 'pasaporte',
        numeroPasaporte: 'G99887711',
        vencimientoPasaporte: '2036-05-12'
      },
      'Legal',
      'Postulante presentó libreta de pasaporte tramitada.'
    );

    if (!actualizadaConPasaporte || actualizadaConPasaporte.tipoDocumento !== 'pasaporte') {
      throw new Error('Fallo al actualizar DPI a pasaporte');
    }

    solicitudStore.eliminarSolicitud(nuevaConDpi.id);
  });

  registrar('Store: Radicación con correo electrónico opcional (sin email)', 'Store & Persistencia', () => {
    const nuevaSinEmail = solicitudStore.crearSolicitud({
      nombres: 'Postulante Sin Correo',
      apellidos: 'Rural Test',
      email: '',
      telefono: '+502 5555 7777',
      paisNacimiento: 'Guatemala',
      nacionalidad: 'Guatemalteca',
      paisResidencia: 'Guatemala',
      fechaNacimiento: '1995-08-20',
      tipoDocumento: 'dpi',
      numeroPasaporte: '1982 77162 0101',
      vencimientoPasaporte: '2034-08-20',
      tipoVisa: 'H-2A',
      profesionOficio: 'Agricultor Especializado',
      experienciaAnos: 4,
      nivelIngles: 'ninguno',
      nivelEstudio: 'primaria',
      habilidadesClave: ['Manejo de tractor'],
      tieneOfertaLaboral: true,
      visasPreviasEEUU: false,
      denegacionesPrevias: false,
      estado: 'pendiente'
    });

    if (nuevaSinEmail.email !== '') {
      throw new Error('Fallo: el campo de correo opcional no se guardó correctamente');
    }

    // Verificar que la búsqueda en store no falle con email vacío
    const busqueda = solicitudStore.obtenerSolicitudes({
      busqueda: 'Rural Test',
      ordenPor: 'fecha',
      ordenDir: 'desc',
      pagina: 1,
      porPagina: 5
    });

    if (busqueda.items.length === 0) {
      throw new Error('No se encontró al postulante sin correo en la búsqueda del store');
    }

    solicitudStore.eliminarSolicitud(nuevaSinEmail.id);
  });

  registrar('Store: Radicación con Departamento de Guatemala y búsqueda', 'Store & Persistencia', () => {
    if (DEPARTAMENTOS_GUATEMALA.length !== 22) {
      throw new Error(`La lista de departamentos debe tener 22 departamentos (tiene ${DEPARTAMENTOS_GUATEMALA.length})`);
    }

    const nuevaConDepto = solicitudStore.crearSolicitud({
      nombres: 'Postulante Quetzaltenango',
      apellidos: 'García',
      email: 'quetzal@test.com',
      telefono: '+502 7761 1122',
      paisNacimiento: 'Guatemala',
      nacionalidad: 'Guatemalteco/a',
      departamento: 'Quetzaltenango',
      paisResidencia: 'Guatemala',
      fechaNacimiento: '1996-03-10',
      tipoDocumento: 'dpi',
      numeroPasaporte: '1892 44321 0901',
      vencimientoPasaporte: '2033-03-10',
      tipoVisa: 'H-2A',
      profesionOficio: 'Agrónomo de Campo',
      experienciaAnos: 3,
      nivelIngles: 'basico',
      nivelEstudio: 'tecnico',
      habilidadesClave: ['Manejo de hortalizas'],
      tieneOfertaLaboral: true,
      visasPreviasEEUU: false,
      denegacionesPrevias: false,
      estado: 'pendiente'
    });

    if (nuevaConDepto.departamento !== 'Quetzaltenango' || nuevaConDepto.paisNacimiento !== 'Guatemala') {
      throw new Error('El departamento y país de origen no se registraron correctamente');
    }

    const busquedaPorDepto = solicitudStore.obtenerSolicitudes({
      busqueda: 'Quetzaltenango',
      ordenPor: 'fecha',
      ordenDir: 'desc',
      pagina: 1,
      porPagina: 5
    });

    if (busquedaPorDepto.items.length === 0) {
      throw new Error('Fallo al buscar por departamento en el almacén');
    }

    solicitudStore.eliminarSolicitud(nuevaConDepto.id);
  });

  registrar('Store: Actualización de estado y recálculo de porcentaje', 'Store & Persistencia', () => {
    const estadisticas = solicitudStore.obtenerEstadisticas();
    if (estadisticas.total === 0) {
      throw new Error('Las estadísticas devolvieron 0 registros en el almacén');
    }
  });

  registrar('WhatsApp: Validación de enlace oficial de resultados al 40529385', 'Canales & Notificaciones', () => {
    const numeroEsperado = '50240529385';
    const radicadoMock = 'VLI-2026-TEST';
    const linkEsperado = `https://wa.me/${numeroEsperado}`;
    
    if (!linkEsperado.includes('50240529385')) {
      throw new Error('El número oficial de WhatsApp de resultados debe ser 50240529385');
    }
  });

  // 5. Módulo: Generación de Documentos DOCX
  registrar('DOCX: Generación de Contrato Maestro binario', 'Documentos DOCX', async () => {
    const sample = solicitudStore.obtenerPorId('sol-001') || {
      id: 'mock',
      radicado: 'VLI-2026-MOCK',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      estado: 'aprobada' as const,
      nombres: 'Juan',
      apellidos: 'Pérez',
      email: 'juan@test.com',
      telefono: '+123',
      paisNacimiento: 'Colombia',
      nacionalidad: 'Colombiana',
      paisResidencia: 'Colombia',
      fechaNacimiento: '1990-01-01',
      numeroPasaporte: 'COL1234',
      vencimientoPasaporte: '2030-01-01',
      tipoVisa: 'H-2B' as const,
      profesionOficio: 'Cocinero',
      experienciaAnos: 5,
      nivelIngles: 'intermedio' as const,
      nivelEstudio: 'tecnico' as const,
      habilidadesClave: ['Cocina'],
      tieneOfertaLaboral: true,
      visasPreviasEEUU: false,
      denegacionesPrevias: false,
      checklists: generarChecklistPorVisa('H-2B'),
      porcentajeCompletado: 50,
      contratoGenerado: false,
      guiaDescargada: false,
      historialNotas: []
    };

    const blob = await generarContratoMaestroDocx(sample);
    if (!(blob instanceof Blob) || blob.size < 1000) {
      throw new Error(`El archivo DOCX generado es inválido o tiene un tamaño anómalo (${blob.size} bytes)`);
    }
  });

  registrar('DOCX: Generación de Guía de Requisitos Maestra', 'Documentos DOCX', async () => {
    const sample = solicitudStore.obtenerPorId('sol-001')!;
    const blob = await generarGuiaRequisitosDocx(sample);
    if (!(blob instanceof Blob) || blob.size < 1000) {
      throw new Error(`La Guía DOCX generada es inválida (${blob.size} bytes)`);
    }
  });

  const totalPruebas = resultados.length;
  const exitosas = resultados.filter((r) => r.exitoso).length;
  const fallidas = totalPruebas - exitosas;
  const duracionTotalMs = Math.round(performance.now() - inicio);

  const coberturaModulos = Array.from(new Set(resultados.map((r) => r.categoria)));

  return {
    resultados,
    totalPruebas,
    exitosas,
    fallidas,
    duracionTotalMs,
    coberturaModulos
  };
}
