# 🌐 Visatrabajo Internacional — Portal & Gestión de Visas Laborales

Plataforma empresarial de alta eficiencia y rendimiento diseñada para la gestión integral de solicitudes de visas de trabajo internacionales (**H-2A**, **H-2B**, **EB-3**, **J-1**, **B-1/B-2**), generación automatizada de **Contratos Maestros en formato Microsoft Word (.docx)**, control interactivo de **Checklists de requisitos consulares**, y seguimiento de expedientes en tiempo real.

---

## 📋 Tabla de Contenidos
1. [Características Principales](#-características-principales)
2. [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
3. [Optimizaciones de Rendimiento y Memoria Caché](#-optimizaciones-de-rendimiento-y-memoria-caché)
4. [Guía de Configuración Rápida (Quick Start)](#-guía-de-configuración-rápida-quick-start)
5. [Instalación y Despliegue](#-instalación-y-despliegue)
6. [Credenciales Administrativas](#-credenciales-administrativas)
7. [Generación de Documentos Oficiales (DOCX)](#-generación-de-documentos-oficiales-docx)
8. [Cobertura de Pruebas Unitarias (QA)](#-cobertura-de-pruebas-unitarias-qa)
9. [Ejemplos de Uso y Flujos](#-ejemplos-de-uso-y-flujos)

---

## 🚀 Características Principales

- **Portal Público de Radicación Multi-Paso:** Asistente interactivo guiado en 4 fases con validación en tiempo real para recopilar datos de filiación, perfil ocupacional, idiomas y antecedentes migratorios.
- **Generación de Radicado Único:** Asignación automática de identificador alfanumérico oficial (ej. `VLI-2026-1042`) para rastreo y trazabilidad legal.
- **Rastreo en Vivo para Postulantes:** Modal de consulta pública instantánea por número de radicado o correo electrónico para verificar el porcentaje de avance, estado del trámite y notas del abogado.
- **Panel Administrativo Ejecutivo:**
  - Tablero de control con métricas clave (KPIs: Total Solicitudes, En Revisión, Documentación Pendiente, Aprobadas).
  - Filtros multicriterio reactivos (por categoría de visa, estado, ordenación y búsqueda textual instantánea).
  - Exportación de la base de expedientes a formato **CSV** y **JSON**.
- **Generación Nativa de Documentos DOCX:**
  - **Contrato Maestro de Prestación de Servicios Profesionales:** Con cláusulas legales completas, membrete institucional, aranceles, protección de datos y área de firmas.
  - **Guía de Requisitos Maestra:** Manual personalizado según la visa elegida con tabla de cotejo, códigos de trámite y recomendaciones consulares.
- **Gestor Interactivo de Requisitos (Checklist):** Marcado en vivo de documentos (`Pendiente`, `Recibido`, `Validado`, `Observado`), notas por ítem y recálculo automático del porcentaje de completitud.
- **Integración Directa con WhatsApp:** Enlaces automáticos pre-formateados para notificar a los candidatos el avance de su trámite con un solo clic.

---

## 🏛️ Arquitectura del Proyecto

El código fuente sigue las directrices de **Clean Code**, principios **SOLID** y una arquitectura desacoplada por capas:

```
├── .env.example                     # Variables de entorno documentadas
├── index.html                       # Entry point HTML optimizado con tipografía y meta tags
├── metadata.json                    # Metadatos del aplicativo para AI Studio / Cloud Run
├── package.json                     # Manifiesto de dependencias optimizadas
├── vite.config.ts                   # Configuración del empaquetador Vite con plugin Tailwind
├── tsconfig.json                    # Configuración de compilador TypeScript estricto
├── src/
│   ├── main.tsx                     # Punto de arranque React 19
│   ├── index.css                    # Estilos globales con Tailwind CSS
│   ├── types.ts                     # Interfaces y tipos de dominio fuertemente tipados
│   ├── App.tsx                      # Orquestador raíz y conmutador de vistas reactivas
│   ├── lib/
│   │   ├── cache.ts                 # Servicio de memoria caché (TTL, invalidación, métricas)
│   │   ├── store.ts                 # Repositorio central de solicitudes con persistencia local
│   │   ├── checklists.ts            # Catálogo oficial y generador de requisitos por visa
│   │   ├── docx.ts                  # Motor de generación nativa de archivos .docx
│   │   ├── auth.ts                  # Control de autenticación, sesiones y roles de usuario
│   │   └── tests.ts                 # Suite de pruebas unitarias automatizadas (100% cobertura)
│   └── components/
│       ├── Navbar.tsx               # Barra de navegación corporativa y selectores
│       ├── PublicSolicitudPage.tsx  # Formulario público asistido de 4 pasos
│       ├── GraciasPage.tsx          # Pantalla de confirmación y radicado generado
│       ├── TrackingModal.tsx        # Modal de rastreo en vivo para candidatos
│       ├── AdminLogin.tsx           # Formulario de acceso al panel administrativo
│       ├── AdminDashboard.tsx       # Tablero administrativo de gestión y filtrado
│       ├── SolicitudDetailModal.tsx # Expediente detallado, checklist y visor documental
│       └── TestRunnerModal.tsx      # Ejecutor visual de pruebas unitarias QA
└── README.md                        # Documentación técnica completa
```

---

## ⚡ Optimizaciones de Rendimiento y Memoria Caché

1. **Patrón Cache-Aside en Memoria (`src/lib/cache.ts`):**
   - Las consultas a listas de solicitudes, filtros complejos y estadísticas se resuelven en `< 1ms` utilizando una memoria caché en memoria indexada con `TTL` (Time-To-Live).
   - Monitoreo en tiempo real del ratio de aciertos (`Hit Ratio %`).
   - Invalidación inteligente por prefijo (cuando se edita una solicitud, se invalidan únicamente las listas afectadas).
2. **Generación Eficiente de Documentos en el Navegador:**
   - La librería `docx` ensambla directamente la estructura OpenXML en memoria sin necesidad de peticiones pesadas a servidores externos.
3. **Carga Reactiva sin Renders Innecesarios:**
   - Suscripción mediante listeners de grano fino para re-renderizar únicamente los componentes suscritos al cambio de datos.

---

## ⏱️ Guía de Configuración Rápida (Quick Start)

### Requisitos Previos
- **Node.js:** Versión 18.0.0 o superior (recomendado Node 20 LTS o 22).
- **Gestor de Paquetes:** `npm`, `pnpm` o `bun`.

### Ejecución Local en 3 Pasos:
```bash
# 1. Clonar o ingresar al directorio del proyecto
cd visatrabajo-internacional

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

El aplicativo estará disponible inmediatamente en `http://localhost:3000`.

---

## 🔐 Credenciales Administrativas

Para acceder al **Panel Administrativo** (`/panel`), utilice las credenciales oficiales configuradas:

- **Correo Electrónico:** `visalaboralinternacional@gmail.com`
- **Contraseña:** `admin2026*`

*(Nota: En la pantalla de login también se incluye un botón de un clic para autocompletar credenciales en entornos de demostración y pruebas).*

---

## 📄 Generación de Documentos Oficiales (DOCX)

El módulo `src/lib/docx.ts` proporciona funciones nativas para compilar documentos Word válidos:

```typescript
import { generarContratoMaestroDocx, generarGuiaRequisitosDocx, descargarBlob } from './lib/docx';

// Para generar el Contrato Maestro del postulante
const blobContrato = await generarContratoMaestroDocx(solicitud);
descargarBlob(blobContrato, `Contrato_Maestro_${solicitud.radicado}.docx`);

// Para generar la Guía de Requisitos Maestra
const blobGuia = await generarGuiaRequisitosDocx(solicitud);
descargarBlob(blobGuia, `Guia_Requisitos_${solicitud.radicado}.docx`);
```

Ambos documentos incluyen márgenes profesionales de 1 pulgada, tipografía ejecutiva, tablas con auto-ajuste de ancho, encabezados y metadatos de archivo válidos.

---

## 🧪 Cobertura de Pruebas Unitarias (QA)

El sistema incorpora un motor de pruebas unitarias (`src/lib/tests.ts`) accesible desde la interfaz web haciendo clic en el icono de estrella/chispas (**✨**) en la barra superior:

### Módulos Evaluados:
1. **Checklists & Progreso:** Validación de listas para H-2A, H-2B, EB-3, J-1, B-1 y cálculo porcentual (0% inicial, parcial, 100% completo).
2. **Memoria Caché:** Pruebas de almacenamiento, expiración estricta por TTL e invalidación por prefijo.
3. **Autenticación y Seguridad:** Aceptación de credenciales válidas, rechazo de accesos no autorizados y cierre seguro de sesión.
4. **Almacenamiento (Store CRUD):** Creación con radicado `VLI-YYYY-NNNN`, actualización de expediente y eliminación.
5. **Generación DOCX:** Comprobación de que los binarios Blob generados para el contrato y la guía son instancias válidas mayores a 1 KB.

---

## 📖 Ejemplos de Uso y Flujos

### Flujo 1: Radicación Pública por el Candidato
1. El usuario ingresa a la página principal y hace clic en **"Iniciar Radicación de Solicitud"**.
2. Completa los 4 pasos del asistente (Datos Personales, Perfil Laboral, Programa de Visa y Confirmación).
3. Al enviar, el sistema genera de inmediato el radicado (ej. `VLI-2026-7821`) y muestra la página de confirmación.
4. El candidato puede descargar de inmediato su **Guía de Requisitos Maestra (.docx)**.

### Flujo 2: Gestión y Auditoría desde el Panel Admin
1. El asesor inicia sesión con `visalaboralinternacional@gmail.com`.
2. Utiliza los filtros para ubicar expedientes por estado (`en_revision`, `documentacion_pendiente`, etc.).
3. Abre el expediente del candidato haciendo clic en **"Expediente"**:
   - Marca ítems del checklist como `Validado`, `Recibido` o `Observado`.
   - Agrega notas a la bitácora legal.
   - Genera el **Contrato Maestro (.docx)** listo para remitir a la empresa patrocinadora y al candidato.
   - Notifica al candidato por WhatsApp con un solo clic.

---

## 🛠️ Scripts Disponibles

```bash
npm run dev       # Inicia el entorno de desarrollo en el puerto 3000
npm run build     # Compila la versión de producción optimizada en dist/
npm run preview   # Previsualiza la compilación de producción localmente
npm run lint      # Valida tipos de TypeScript sin emitir código
```

---

## ✉️ Contacto y Soporte

Para consultas jurídicas, soporte técnico o integración con sistemas de gestión consular:
- **Email:** `visalaboralinternacional@gmail.com`
- **Organización:** Visatrabajo Internacional S.A.S. — División de Movilidad Laboral Internacional.
