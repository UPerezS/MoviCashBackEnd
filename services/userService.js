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
        throw error;
    }
};

// Obtener un usuario por correo electrónico
exports.getUserByEmail = async (email) => {

    const user = await Personal.findOne({ CorreoElectronico: { $eq: email }});
  
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

  exports.obtenerInfoPersonal = async(userId) => {
    try{
      const nombreUsuario = await Personal.find({_id: {$eq: userId}},{_id:0, NombrePersonal:1});
      console.log(nombreUsuario);
      return nombreUsuario;
    }catch(error){
      throw new Error("Error en obtener el nombre del usuario"+ error.message);
    }
  }