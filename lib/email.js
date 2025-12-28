import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  secure: process.env.EMAIL_SERVER_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationEmail(to, cedula) {
  const loginUrl = `${process.env.NEXTAUTH_URL}/login`;
  
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
    to,
    subject: 'Registro exitoso - CAPRES',
    html: `
      <h2>¡Bienvenido a CAPRES!</h2>
      <p>Su registro ha sido exitoso. Ahora puede iniciar sesión en nuestro portal.</p>
      <p>Sus credenciales son:</p>
      <ul>
        <li><strong>Cédula:</strong> ${cedula}</li>
        <li><strong>Correo electrónico:</strong> ${to}</li>
      </ul>
      <p>Haga clic en el siguiente enlace para ir a la página de inicio de sesión:</p>
      <p><a href="${loginUrl}">Iniciar sesión en CAPRES</a></p>
      <p>Si no solicitó este registro, por favor ignore este correo.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Error al enviar el correo de verificación');
  }
}
