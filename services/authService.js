const jwt = require("jsonwebtoken");
const VerificarCodigo = require("../models/VerificarCodigo");
const emailService = require("./emailService");

// Generar JWT (solo con ID y Rol)
const generarToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario._id,
      rol: usuario.Rol,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Generar código de verificación
const generarCodigoVerificacion = async (userId) => {
  const codigo = Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos

  // Guardar en la base de datos
  await VerificarCodigo.create({ userId, code: codigo, expiresAt: Date.now() + 10 * 60 * 1000 }); // Expira en 10 minutos

  return codigo;
};

// Verificar código de autenticación
const verificarCodigo = async (userId, codigo) => {
  const registro = await VerificarCodigo.findOne({ userId, code: codigo });
  return !!registro;
};

module.exports = { generarToken, generarCodigoVerificacion, verificarCodigo };