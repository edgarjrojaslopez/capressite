import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { socios, usuarios } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  // Declarar variables al inicio de la función
  let cedula, email, password;
  
  try {
    // Extraer datos del cuerpo de la solicitud
    const requestData = await request.json();
    
    // Asignar valores y validar campos obligatorios
    cedula = requestData.cedula?.trim();
    email = requestData.email?.trim().toLowerCase();
    password = requestData.password;

    // Validate required fields
    if (!cedula || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    // Check if socio exists
    const [socio] = await db
      .select()
      .from(socios)
      .where(eq(socios.CodSocio, cedula))
      .limit(1);

    if (!socio) {
      return NextResponse.json(
        { error: 'Cédula no encontrada en nuestros registros' },
        { status: 404 }
      );
    }

    // Check if email is already registered
    const [existingUser] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.cedula, cedula))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Esta cédula ya está registrada' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar email y contraseña en la tabla socios
    // Asegurarse de que solo actualizamos los campos que existen en la tabla
    const socioUpdates = {};
    
    // Actualizar email si es diferente y el campo existe en la tabla
    if (socio.Email !== email && socios.Email) {
      socioUpdates.Email = email;
    }
    
    // Actualizar contraseña hasheada en socios si el campo existe
    if (socios.password) {
      socioUpdates.password = hashedPassword;
    }
    
    // Solo intentar actualizar si hay campos para actualizar
    if (Object.keys(socioUpdates).length > 0) {
      await db
        .update(socios)
        .set(socioUpdates)
        .where(eq(socios.CodSocio, cedula));
    }


    // Crear registro de usuario en una transacción
    await db.transaction(async (tx) => {
      try {
        // Verificar nuevamente que el usuario no exista (race condition)
        const [existingUser] = await tx
          .select()
          .from(usuarios)
          .where(eq(usuarios.cedula, cedula))
          .limit(1);

        if (existingUser) {
          throw new Error('Esta cédula ya está registrada');
        }

        // Crear usuario con contraseña hasheada
        // Solo incluir los campos que existen en el esquema
        const userData = {
          cedula,
          correo: email,
          password: hashedPassword,
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Filtrar campos undefined
        const filteredUserData = Object.fromEntries(
          Object.entries(userData).filter(([_, v]) => v !== undefined)
        );

        await tx.insert(usuarios).values(filteredUserData);

        // Actualizar la fecha de actualización del socio si el campo existe
        if (socios.updatedAt) {
          await tx
            .update(socios)
            .set({ updatedAt: new Date() })
            .where(eq(socios.CodSocio, cedula));
        }
      } catch (error) {
        console.error('Error en transacción de registro:', error);
        throw error; // Re-lanzar el error para manejarlo en el catch principal
      }
    });

    // Send verification email using existing email service
    const emailResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: 'Registro exitoso - CAPRES',
        userData: {
          nombre: socio.NombreCompleto,
          cedula: cedula,
          email: email
        },
        tipoSolicitud: 'registro',
      }),
    });

    if (!emailResponse.ok) {
      console.error('Error sending welcome email:', await emailResponse.text());
      // Don't fail registration if email fails, just log it
    }

    return NextResponse.json(
      { 
        message: 'Registro exitoso. Por favor revisa tu correo para continuar.',
        emailSent: emailResponse.ok
      },
      { status: 201 }
    );
  } catch (error) {
    // Datos para el log
    const errorData = {
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      requestData: {
        cedula: cedula || 'not-provided',
        email: email || 'not-provided',
        hasPassword: !!password
      }
    };
    
    console.error('Registration error:', errorData);
    
    // Mensajes de error más específicos
    let errorMessage = 'Error en el registro. Por favor intente nuevamente.';
    let statusCode = 500;
    
    if (error.message.includes('ya está registrad')) {
      errorMessage = error.message;
      statusCode = 400;
    } else if (error.message.includes('no encontrad')) {
      errorMessage = 'Cédula no encontrada en nuestros registros';
      statusCode = 404;
    } else if (error.message.includes('validation') || error.message.includes('validación')) {
      errorMessage = `Datos inválidos: ${error.message}`;
      statusCode = 400;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
