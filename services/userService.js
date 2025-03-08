const Personal = require("../models/personal");

// Crea un nuevo usuario:  operador/administrador

exports.registerUser = async (userData) => {
    try {
        // Verificar si el operador ya existe
        const existingUser = await Personal.findOne({ RFC: userData.RFC });
        const emailUsed = await Personal.findOne({CorreoElectronico: userData.CorreoElectronico})
        if (existingUser) {
            throw new Error("El operador ya está registrado.");
        }else if(emailUsed){
            throw new Error("El correo ya esta siendo usado");
        }

        const newUsuario = new Personal(userData);
        return await newUsuario.save();
    } catch (error) {
        throw new Error(`Error al registrar ${userData.Rol}: ` + error.message);
    }
};

// Obtener un usuario por correo electrónico
exports.getUserByEmail = async (email) => {

    const user = await Personal.findOne({
      CorreoElectronico: { $regex: new RegExp("^" + email.trim() + "$", "i") } //Ignora mayúsculas/minúsculas
    });
  
    return user;
  };
  
 // Actualizar la contraseña del usuario
exports.updateUserPassword = async (email, newPassword) => {
    try {
      const result = await Personal.updateOne(
        { CorreoElectronico: email },
        { $set: { Password: newPassword, Estado: "Activo" } }
      );
  
      return result;
    } catch (error) {
      throw new Error("Error al actualizar la contraseña: " + error.message);
    }
  };