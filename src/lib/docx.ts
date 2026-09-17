/**
 * @file docx.ts
 * @description Generador nativo de documentos DOCX oficiales para:
 * 1. Contrato Maestro de Prestación de Servicios de Visatrabajo Internacional
 * 2. Guía de Requisitos Maestra Personalizada
 * Utiliza la biblioteca oficial 'docx' para crear archivos compatibles con Microsoft Word,
 * Google Docs y suites ofimáticas.
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import { Solicitud } from '../types';

/**
 * Descarga en el navegador un archivo binario Blob con el nombre especificado.
 */
export function descargarBlob(blob: Blob, nombreArchivo: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Genera el Contrato Maestro de Visatrabajo Internacional en formato DOCX.
 */
export async function generarContratoMaestroDocx(solicitud: Solicitud): Promise<Blob> {
  const fechaHoy = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const doc = new Document({
    title: `Contrato Maestro - ${solicitud.nombres} ${solicitud.apellidos}`,
    description: `Contrato de servicios migratorios y gestión de visa ${solicitud.tipoVisa}`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 pulgada
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children: [
          new Paragraph({
            text: 'VISATRABAJO INTERNACIONAL',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'DIVISIÓN DE GESTIÓN MIGRATORIA Y MOVILIDAD LABORAL',
                bold: true,
                size: 20,
                color: '4A5568'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: 'CONTRATO MAESTRO DE PRESTACIÓN DE SERVICIOS PROFESIONALES DE ASESORÍA Y GESTIÓN DE VISA LABORAL',
                bold: true,
                size: 24,
                color: '1A365D'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `RADICADO OFICIAL: `,
                bold: true
              }),
              new TextRun({
                text: `${solicitud.radicado}   |   FECHA DE EMISIÓN: ${fechaHoy}`,
                color: '2B6CB0'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: 'Conste por el presente documento el Contrato de Prestación de Servicios de Asesoría Migratoria y Tramitación de Expediente Laboral que celebran de una parte ',
              }),
              new TextRun({
                text: 'VISATRABAJO INTERNACIONAL S.A.S. / GLOBAL VISA SERVICES',
                bold: true
              }),
              new TextRun({
                text: ', en adelante "LA CONSULTORA", y de otra parte el/la ciudadano/a: '
              })
            ]
          }),

          // Tabla con datos del solicitante
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Nombre del Postulante:', bold: true })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: `${solicitud.nombres} ${solicitud.apellidos}` })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Pasaporte No.:', bold: true })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: `${solicitud.numeroPasaporte} (Nacionalidad: ${solicitud.nacionalidad})` })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Categoría de Visa Solicitada:', bold: true })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: `Visa ${solicitud.tipoVisa} (${solicitud.profesionOficio})`, bold: true, color: '1A365D' })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Correo y Contacto:', bold: true })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: `${solicitud.email} | ${solicitud.telefono}` })]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 300, after: 150 }, text: '' }),

          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: 'CLÁUSULA PRIMERA - OBJETO DEL CONTRATO: ', bold: true }),
              new TextRun({
                text: `LA CONSULTORA asume la obligación de prestar servicios de consultoría técnica, revisión jurídica, integración de expediente consular y asistencia personalizada para el proceso de obtención de visa de trabajo categoría ${solicitud.tipoVisa} ante las autoridades laborales y consulares pertinentes.`
              })
            ]
          }),

          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: 'CLÁUSULA SEGUNDA - OBLIGACIONES DE LA CONSULTORA: ', bold: true }),
              new TextRun({
                text: 'LA CONSULTORA se compromete a: a) Evaluar exhaustivamente el perfil profesional del solicitante; b) Estructurar el expediente con estricta adherencia a los estándares de USCIS y el Departamento de Estado; c) Proveer la Guía de Requisitos Maestra actualizada; d) Asesorar en el correcto diligenciamiento del formulario consular DS-160 o DS-260; e) Realizar simulacros de entrevista consular para optimizar la comparecencia del solicitante.'
              })
            ]
          }),

          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: 'CLÁUSULA TERCERA - OBLIGACIONES DEL SOLICITANTE: ', bold: true }),
              new TextRun({
                text: 'EL SOLICITANTE declara bajo juramento que toda la información suministrada (antecedentes penales, pasaportes, historial migratorio, constancias laborales) es verídica, legítima y comprobable. Se compromete a consignar oportunamente los documentos solicitados dentro de los plazos establecidos en el cronograma de trabajo.'
              })
            ]
          }),

          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: 'CLÁUSULA CUARTA - CONFIDENCIALIDAD Y PROTECCIÓN DE DATOS: ', bold: true }),
              new TextRun({
                text: 'Toda la documentación personal, biométrica y financiera proporcionada será resguardada bajo estrictos protocolos de confidencialidad conforme a las leyes de protección de datos personales aplicables, siendo utilizada exclusivamente para fines del trámite migratorio pactado.'
              })
            ]
          }),

          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: 'CLÁUSULA QUINTA - ALCANCE Y AUTORIDAD CONSULAR: ', bold: true }),
              new TextRun({
                text: 'Ambas partes reconocen expresamente que la facultad soberana e inapelable de otorgar o denegar visados corresponde única y exclusivamente al Oficial Consular del Gobierno de los Estados Unidos o del país de destino. LA CONSULTORA garantiza la excelencia técnica del expediente pero no garantiza el resultado final que depende de la autoridad gubernamental.'
              })
            ]
          }),

          new Paragraph({
            spacing: { before: 400, after: 100 },
            text: 'En señal de conformidad y plena aceptación de todas y cada una de las cláusulas, se suscribe el presente contrato en dos ejemplares del mismo tenor.',
            alignment: AlignmentType.CENTER
          }),

          // Firmas
          new Paragraph({ spacing: { before: 600, after: 100 }, text: '' }),
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 6, color: '718096' },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'POR LA CONSULTORA\n', bold: true }),
                          new TextRun({ text: 'Dirección Jurídica y Operaciones\nVisatrabajo Internacional' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 6, color: '718096' },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'EL SOLICITANTE\n', bold: true }),
                          new TextRun({ text: `${solicitud.nombres} ${solicitud.apellidos}\nPasaporte: ${solicitud.numeroPasaporte}` })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }
    ]
  });

  return await Packer.toBlob(doc);
}

/**
 * Genera la Guía de Requisitos Maestra en formato DOCX.
 */
export async function generarGuiaRequisitosDocx(solicitud: Solicitud): Promise<Blob> {
  const fechaHoy = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const parrafosRequisitos: Paragraph[] = [];

  solicitud.checklists.forEach((cat) => {
    parrafosRequisitos.push(
      new Paragraph({
        text: `SECCIÓN: ${cat.categoria.toUpperCase()}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: cat.descripcion,
            italics: true,
            color: '718096'
          })
        ],
        spacing: { after: 160 }
      })
    );

    cat.items.forEach((item, idx) => {
      parrafosRequisitos.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: `[  ] ${idx + 1}. ${item.nombre} `,
              bold: true
            }),
            new TextRun({
              text: item.obligatorio ? '(OBLIGATORIO) - ' : '(OPCIONAL / SEGÚN CASO) - ',
              color: item.obligatorio ? 'C53030' : '718096',
              bold: true
            }),
            new TextRun({
              text: `Código: ${item.codigo}. `
            }),
            new TextRun({
              text: item.descripcion
            })
          ]
        })
      );
    });
  });

  const doc = new Document({
    title: `Guía de Requisitos - Visa ${solicitud.tipoVisa}`,
    description: `Guía Maestra para el trámite de ${solicitud.nombres} ${solicitud.apellidos}`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children: [
          new Paragraph({
            text: 'VISATRABAJO INTERNACIONAL',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `GUÍA MAESTRA DE REQUISITOS Y PREPARACIÓN CONSULAR`,
                bold: true,
                size: 24,
                color: '1A365D'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `PROGRAMA DE VISA ${solicitud.tipoVisa}  |  EXPEDIENTE: ${solicitud.radicado}`,
                bold: true,
                size: 20,
                color: '2B6CB0'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Titular del Expediente: ', bold: true }),
              new TextRun({ text: `${solicitud.nombres} ${solicitud.apellidos}  |  Fecha: ${fechaHoy}` })
            ]
          }),
          new Paragraph({
            spacing: { after: 300 },
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: 'Esta guía contiene las directrices oficiales para la presentación de su expediente laboral. Cada ítem debe ser consignado en formato digital nítido (PDF o JPG de alta resolución) y, el día de su entrevista consular, en original físico acompañado de copias legibles.'
              })
            ]
          }),
          ...parrafosRequisitos,
          new Paragraph({
            spacing: { before: 400, after: 120 },
            text: 'CONSEJOS CLAVE PARA LA ENTREVISTA CONSULAR:',
            heading: HeadingLevel.HEADING_2
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '1. Puntualidad: ', bold: true }),
              new TextRun({ text: 'Llegue 30 minutos antes de la hora indicada en su confirmación de cita.' })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '2. Coherencia: ', bold: true }),
              new TextRun({ text: 'Sus respuestas verbales deben coincidir exactamente con los datos consignados en el formulario DS-160 y en su contrato.' })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '3. Actitud y Claridad: ', bold: true }),
              new TextRun({ text: 'Responda únicamente lo que el oficial pregunte con amabilidad y seguridad.' })
            ]
          }),
          new Paragraph({
            spacing: { before: 300 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Soporte y Atención al Postulante: visalaboralinternacional@gmail.com',
                bold: true,
                color: '4A5568'
              })
            ]
          })
        ]
      }
    ]
  });

  return await Packer.toBlob(doc);
}
