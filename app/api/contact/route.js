

// app/api/contact/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Verificar que todas las variables de entorno estén definidas
if (
  !process.env.EMAIL_HOST ||
  !process.env.EMAIL_PORT ||
  !process.env.EMAIL_USER ||
  !process.env.EMAIL_PASS ||
  !process.env.NEXT_PUBLIC_EMAIL_TO
) {
  console.error('❌ Faltan variables de entorno para el correo');
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, email, asunto, mensaje } = body;

    // ✅ Validaciones
    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El correo electrónico no es válido' },
        { status: 400 }
      );
    }

    // ✅ Configuración del transporte con Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: true, // true para puerto 465 (requiere SSL)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Opcional: para servidores internos o con certificados personalizados
      tls: {
        rejectUnauthorized: false, // ⚠️ Solo si tienes problemas de certificado
      },
    });

    // ✅ 1. Enviar al administrador (CAPRES)
    await transporter.sendMail({
      from: `"Formulario de Contacto" <${process.env.EMAIL_USER}>`,
      to: process.env.NEXT_PUBLIC_EMAIL_TO,
      subject: `Nuevo mensaje: ${asunto}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>📧 Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Asunto:</strong> ${asunto}</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
            <p><strong>Mensaje:</strong></p>
            <p>${mensaje}</p>
          </div>
        </div>
      `,
    });

    // ✅ 2. Enviar correo de confirmación al usuario
    await transporter.sendMail({
      from: `"CAPRES" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✅ Tu mensaje fue recibido',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>✅ Hemos recibido tu mensaje</h2>
          <p>Hola <strong>${nombre}</strong>,</p>
          <p>Gracias por contactarnos. Hemos recibido tu consulta sobre: <strong>"${asunto}"</strong>.</p>
          <p>Nos pondremos en contacto contigo pronto.</p>
          <p><strong>Horario:</strong> Lunes a Viernes, 8:00 AM - 4:00 PM</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">Este es un mensaje automático. Por favor, no respondas a este correo.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado exitosamente',
    });
  } catch (error) {
    console.error('❌ Error en /api/contact:', error);

    // Mejorar el mensaje de error según el tipo
    if (error.code === 'ECONNECTION') {
      return NextResponse.json(
        {
          error:
            'No se pudo conectar al servidor de correo. Revisa la configuración SMTP.',
        },
        { status: 500 }
      );
    }
    if (error.responseCode === 535) {
      return NextResponse.json(
        {
          error:
            'Error de autenticación SMTP. Usuario o contraseña incorrectos.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'No se pudo enviar el mensaje. Inténtalo más tarde.' },
      { status: 500 }
    );
  }
}
