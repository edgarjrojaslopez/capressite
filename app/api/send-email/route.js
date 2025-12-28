// app/api/send-email/route.js

import nodemailer from 'nodemailer';
import { generateTrackingId } from '@/lib/generateTrackingId';
import { db } from '@/lib/db';
import { solicitudes, solicitudes_haberes } from '@/lib/db/schema';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const DEFAULT_FROM = process.env.EMAIL_USER;

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      to,
      subject,
      userData,
      // Préstamo
      selectedLoanType,
      loanForm,
      // Retiro
      tipoSolicitud,
      tipoRetiro,
      montoSolicitado,
      razon,
    } = body;

    // === VALIDACIÓN BÁSICA ===
    if (!to || !subject || !userData || !tipoSolicitud) {
      return Response.json(
        { error: 'Campos esenciales faltantes: to, subject, userData o tipoSolicitud' },
        { status: 400 }
      );
    }

    let numeroSeguimiento;
    let html;

    // === PROCESAR SEGÚN TIPO DE SOLICITUD ===
    if (tipoSolicitud === 'retiro') {
      // --- Lógica de Retiro ---
      if (!tipoRetiro || !razon || montoSolicitado == null) {
        return Response.json({ error: 'Faltan campos requeridos para retiro' }, { status: 400 });
      }
      numeroSeguimiento = generateTrackingId(userData.CodSocio);
      await db.insert(solicitudes_haberes).values({
        socioId: userData.CodSocio,
        nombreSocio: userData.NombreCompleto,
        emailSocio: userData.Email,
        telefonoSocio: userData.Telefonos,
        tipoRetiro,
        montoSolicitado: parseFloat(montoSolicitado),
        razon,
        numeroSeguimiento,
      });
      console.log('✅ Solicitud de retiro guardada en DB:', numeroSeguimiento);
      // (Aquí iría la plantilla HTML de retiro que ya tienes)
      html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Solicitud de Retiro</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
        .detail { margin-bottom: 15px; }
        .label { font-weight: bold; color: #4b5563; }
        .footer { margin-top: 20px; font-size: 12px; color: #6b7280; text-align: center; }
        .tracking { background-color: #e0f2fe; padding: 10px; border-radius: 4px; margin: 15px 0; text-align: center; font-weight: bold; }
      </style>
    </head>
        <body>      <div class="container">
        <div class="header">
          <h1>Solicitud de Retiro de Haberes</h1>
        </div>
        <div class="content">
          <p>Se ha recibido una nueva solicitud de retiro de haberes con los siguientes detalles:</p>

          <div class="tracking">
            Número de Seguimiento: ${numeroSeguimiento}
          </div>

          <div class="detail">
            <span class="label">Socio:</span> ${userData.NombreCompleto}
          </div>
          <div class="detail">
            <span class="label">Cédula:</span> ${userData.CodSocio}
          </div>
          <div class="detail">
            <span class="label">Tipo de Retiro:</span> ${tipoRetiro}
          </div>
          <div class="detail">
            <span class="label">Monto Solicitado:</span> Bs. ${parseFloat(montoSolicitado).toFixed(2)}
          </div>
          <div class="detail">
            <span class="label">Razón del Retiro:</span><br>
            ${razon}
          </div>
          <div class="detail">
            <span class="label">Correo Electrónico:</span> ${userData.Email}
          </div>
          <div class="detail">
            <span class="label">Teléfono:</span> ${userData.Telefonos || 'No especificado'}
          </div>

          <div class="footer">
            <p>Este es un correo automático, por favor no responder a este mensaje.</p>
            <p>© ${new Date().getFullYear()} CAPRES - Caja de Ahorro de los Profesores</p>
          </div>
        </div>
      </div></body>
        </html>
      `; // Simplificado por brevedad

    } else if (tipoSolicitud === 'prestamo') {
      // --- VALIDACIÓN PARA PRÉSTAMO ---
      if (!selectedLoanType || !loanForm?.amount || !loanForm?.reason) {
        return Response.json({ error: 'Faltan campos requeridos para préstamo' }, { status: 400 });
      }
      const monto = parseFloat(loanForm.amount);
      if (isNaN(monto) || monto <= 0) {
        return Response.json({ error: 'Monto de préstamo inválido' }, { status: 400 });
      }

      // --- GENERAR ID DE SEGUIMIENTO ---
      numeroSeguimiento = generateTrackingId(userData.CodSocio);

      // --- GUARDAR EN BASE DE DATOS ---
      await db.insert(solicitudes).values({
        socioId: userData.CodSocio,
        nombreSocio: userData.NombreCompleto,
        emailSocio: userData.Email,
        telefonoSocio: userData.Telefonos,
        tipoPrestamo: selectedLoanType.name,
        montoSolicitado: monto,
        razon: loanForm.reason,
        numeroSeguimiento,
      });
      console.log('✅ Solicitud de préstamo guardada en DB:', numeroSeguimiento);

      // --- PLANTILLA DE CORREO PARA PRÉSTAMO ---
      html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <title>Solicitud de Préstamo</title>
        </head>
        <body style="margin:0; padding:0; background:#f4f6f9; font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:700px; margin:30px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
            <!-- CABECERA -->
            <tr>
              <td bgcolor="#1e40af" style="padding:30px 40px; text-align:center; color:white;">
                <div style="font-size:28px; margin-bottom:8px;">📄</div>
                <h1 style="margin:0; font-size:20px; color:white;">Solicitud de Préstamo Recibida</h1>
                <p style="margin:8px 0 0; color:#e0e7ff; font-size:14px;">N°: ${numeroSeguimiento}</p>
              </td>
            </tr>
            <!-- CUERPO -->
            <tr>
              <td style="padding:40px;">
                <h2 style="color:#1e293b; font-size:18px; border-bottom:2px solid #e2e8f0; display:inline-block; margin-bottom:16px;">👤 Solicitante</h2>
                <table width="100%" style="font-size:14px; color:#1e293b;">
                  <tr><td width="30%"><strong>Nombre:</strong></td><td>${userData.NombreCompleto}</td></tr>
                  <tr><td><strong>Cédula:</strong></td><td>${userData.CodSocio}</td></tr>
                  <tr><td><strong>Email:</strong></td><td>${userData.Email || 'N/A'}</td></tr>
                  <tr><td><strong>Teléfono:</strong></td><td>${userData.Telefonos || 'N/A'}</td></tr>
                </table>
                <h2 style="color:#1e293b; font-size:18px; border-bottom:2px solid #e2e8f0; display:inline-block; margin:24px 0 16px;">💰 Detalles</h2>
                <table width="100%" style="font-size:14px; color:#1e293b;">
                  <tr><td width="30%"><strong>Tipo:</strong></td><td>${selectedLoanType.name}</td></tr>
                  <tr><td><strong>Monto:</strong></td><td>Bs. ${new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2 }).format(monto)}</td></tr>
                  <tr><td><strong>Fecha:</strong></td><td>${new Date().toLocaleDateString('es-VE')}</td></tr>
                </table>
                <h2 style="color:#1e293b; font-size:18px; border-bottom:2px solid #e2e8f0; display:inline-block; margin:24px 0 16px;">📝 Razón</h2>
                <div style="background:#f8fafc; padding:16px; border-radius:8px; border-left:4px solid #3b82f6; font-style:italic;">
                  ${loanForm.reason.replace(/\n/g, '<br>')}
                </div>
              </td>
            </tr>
            <!-- PIE -->
            <tr>
              <td style="text-align:center; padding:20px; background:#f8fafc; color:#64748b; font-size:12px; border-top:1px solid #e2e8f0;">
                Este mensaje fue generado automáticamente.<br>
                &copy; ${new Date().getFullYear()} CAPRES. Todos los derechos reservados.
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
    } else if (tipoSolicitud === 'registro') {
      // --- Lógica de Registro ---
      // No se requiere número de seguimiento ni guardar en DB (ya se hizo en /api/register)
      numeroSeguimiento = null;

      // --- PLANTILLA DE CORREO PARA REGISTRO ---
      html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido a CAPRES</title>
        </head>
        <body style="margin:0; padding:0; background:#f4f6f9; font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:700px; margin:30px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
            <!-- CABECERA -->
            <tr>
              <td bgcolor="#10b981" style="padding:30px 40px; text-align:center; color:white;">
                <div style="font-size:28px; margin-bottom:8px;">🎉</div>
                <h1 style="margin:0; font-size:24px; color:white;">¡Bienvenido a CAPRES!</h1>
                <p style="margin:8px 0 0; color:#d1fae5; font-size:14px;">Registro Exitoso</p>
              </td>
            </tr>
            <!-- CUERPO -->
            <tr>
              <td style="padding:40px;">
                <p style="font-size:16px; color:#1e293b; margin-bottom:20px;">
                  Hola <strong>${userData.nombre}</strong>,
                </p>
                <p style="font-size:14px; color:#475569; line-height:1.6; margin-bottom:20px;">
                  Tu registro en el sistema de CAPRES se ha completado exitosamente. A partir de ahora podrás acceder a tu cuenta y gestionar tus solicitudes de préstamos y retiros.
                </p>

                <div style="background:#f0fdf4; padding:20px; border-radius:8px; border-left:4px solid #10b981; margin:20px 0;">
                  <h2 style="color:#166534; font-size:16px; margin:0 0 12px;">📋 Datos de tu cuenta</h2>
                  <table width="100%" style="font-size:14px; color:#1e293b;">
                    <tr><td width="30%"><strong>Cédula:</strong></td><td>${userData.cedula}</td></tr>
                    <tr><td><strong>Email:</strong></td><td>${userData.email}</td></tr>
                  </table>
                </div>

                <p style="font-size:14px; color:#475569; line-height:1.6; margin:20px 0;">
                  Ya puedes iniciar sesión en el sistema utilizando tu cédula y la contraseña que creaste durante el registro.
                </p>

                <div style="text-align:center; margin:30px 0;">
                  <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login"
                     style="display:inline-block; background:#1e40af; color:white; padding:12px 30px; text-decoration:none; border-radius:6px; font-weight:bold;">
                    Iniciar Sesión
                  </a>
                </div>

                <div style="background:#fef3c7; padding:15px; border-radius:6px; border-left:4px solid #f59e0b; margin-top:20px;">
                  <p style="margin:0; font-size:13px; color:#92400e;">
                    <strong>⚠️ Importante:</strong> Si no solicitaste este registro, por favor contacta inmediatamente con la administración de CAPRES.
                  </p>
                </div>
              </td>
            </tr>
            <!-- PIE -->
            <tr>
              <td style="text-align:center; padding:20px; background:#f8fafc; color:#64748b; font-size:12px; border-top:1px solid #e2e8f0;">
                <p style="margin:0 0 8px;">Este mensaje fue generado automáticamente.</p>
                <p style="margin:0;">&copy; ${new Date().getFullYear()} CAPRES - Caja de Ahorro y prestaciones de los trabajadores del SENIAT. Todos los derechos reservados.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
    } else {
      // Si el tipo de solicitud no es reconocido
      return Response.json({ error: 'Tipo de solicitud no reconocido' }, { status: 400 });
    }

    // === ENVIAR CORREO CON NODEMAILER ===
    const mailOptions = {
      from: DEFAULT_FROM,
      to: Array.isArray(to) ? to : [to],
      subject: numeroSeguimiento ? `${subject} [${numeroSeguimiento}]` : subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado con Nodemailer:', info);

    // === RESPUESTA EXITOSA ===
    return Response.json({
      success: true,
      message: 'Solicitud procesada y correo enviado',
      data: { numeroSeguimiento, email: info },
    });
  } catch (err) {
    console.error('Error en /api/send-email:', err);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}