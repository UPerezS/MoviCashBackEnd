const Personal = require("../models/personal");

// Obtener todos los administradores
const getAllAdministrators = async () => {
    try {
        return await Personal.find({ Rol: "Administrador" });
    } catch (error) {
        throw new Error("Error al obtener administradores: " + error.message);
    }
};

// Eliminar un administrador por RFC
const deleteAdmin = async (RFC) => {
    try {
        const exist = await Personal.findOne({ RFC });
        if (!exist) {
            return null;
        }
        await Personal.deleteOne({ RFC });
        return exist; // Devuelve el empleado eliminado
    } catch (error) {
        throw new Error("Error al eliminar el administrador: " + error.message);
    }
};

// Actualizar un administrador por RFC
const updateAdmin = async (RFC, updateData) => {
    try {
      // Verifica si el usuario existe
      const exist = await Personal.findOne({ RFC });
      if (!exist) {
        throw new Error(`Empleado con RFC ${RFC} no encontrado.`);
      }
  
      // Asegura que la FechaUltimaModificacion se actualice
      updateData.FechaActualizacion = new Date();
  
      // Validación mínima de campos requeridos
      const requiredFields = [
        'NombrePersonal', 'ApPaterno', 'CorreoElectronico', 'Password', 
        'Rol', 'Direccion', 'Telefono', 'Estado'
      ];
  
      requiredFields.forEach(field => {
        if (!updateData[field]) {
          throw new Error(`El campo '${field}' es requerido.`);
        }
      });
  
      // Valida estructura de Direccion
      const { Direccion } = updateData;
      const direccionFields = ['NumeroExterior', 'Calle', 'Colonia', 'Ciudad'];
      direccionFields.forEach(field => {
        if (!Direccion[field]) {
          throw new Error(`El campo Direccion.${field} es requerido.`);
        }
      });
  
      // Valida Telefono (mínimo un teléfono con Lada y Numero válidos)
      if (!Array.isArray(updateData.Telefono) || updateData.Telefono.length === 0) {
        throw new Error('Debe proporcionar al menos un teléfono.');
      }
  
      updateData.Telefono.forEach((tel, index) => {
        if (!tel.Lada || !/^\d{2,3}$/.test(tel.Lada)) {
          throw new Error(`Telefono[${index}].Lada debe ser de 2 o 3 dígitos.`);
        }
        if (!tel.Numero || !/^\d{7,10}$/.test(tel.Numero)) {
          throw new Error(`Telefono[${index}].Numero debe tener entre 7 y 10 dígitos.`);
        }
      });
  
      // Actualiza y devuelve el documento actualizado
      const updated = await Personal.findOneAndUpdate(
        { RFC },
        { $set: updateData },
        { new: true, runValidators: true } // runValidators asegura que se respeten las reglas del esquema
      );
  
      if (!updated) {
        throw new Error('Error al actualizar el administrador.');
      }
  
      return updated;
    } catch (error) {
      throw new Error(`Error al actualizar el administrador: ${error.message}`);
    }
  };
  

module.exports = {
    create,
    getAllAdministrators,
    deleteAdmin,
    updateAdmin
};
