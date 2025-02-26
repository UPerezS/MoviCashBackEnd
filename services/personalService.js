const Personal = require("../models/personal.js");

// Crear un nuevo usuario
exports.createPersonal = async (personalData) => {
  const newPersonal = new Personal(personalData);
  return await newPersonal.save();
};

// Obtener un usuario por correo electrónico
exports.getUserByEmail = async (email) => {
  console.log("Buscando usuario con correo:", email.trim());

  const user = await Personal.findOne({
    CorreoElectronico: { $regex: new RegExp("^" + email.trim() + "$", "i") } //Ignora mayúsculas/minúsculas
  });

  console.log("Usuario encontrado:", user);
  return user;
};
