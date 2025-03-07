const nodemailer = require("nodemailer");

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Correo del remitente
    pass: process.env.EMAIL_PASS, // Contraseña del correo
  },
});

// Función para enviar código de verificación
const enviarCodigo = async (correo, codigo) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: correo,
    subject: "Código de verificación",
    text: `Tu código de verificación es: ${codigo}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { enviarCodigo };
