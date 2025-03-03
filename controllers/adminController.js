const Personal = require("../models/personal");

//Mostrar usuarios
exports.getAllAdmin = async (req, res) => {
    try {
        const admin = await Personal.find({ Rol: "Administrador" }); // Se guardan todo el personal que sea administrador
        if (admin.length === 0) {
            return res.status(404).json({ message: "No se encontraron administradores." });
        }
        res.status(200).json({ message: "Administradores encontrados.", data: admin }); // Se guarda dentro del json el personal administrador despues de el mensaje
    } catch (error) {
        console.error("Error al obtener los administradores: ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

//Eliminar administradores
exports.deleteAdmin = async (req, res) => {
    const { RFC } = req.params; // Se define como parametro el RFC
    const rol = await Personal.findOne({RFC: RFC},{Rol:1}) // Se guarda el rol del personal con el RFC del parametro, para validar que sea administrador

    try {
        if (rol.Rol === "Administrador"){ // Se usa rol.Rol para ingresar al campo "Rol" del objeto "rol", con esto se valida que el personal a eliminar sea administrador
            const exist = await Personal.findOne({ RFC }); // Se guarda el administrador buscado
            if (!exist) { // Si no hay un administrador con el RFC del parametro, entonces se manda un mensaje de no encontrado
                console.log('Administrador no encontrado.');
                return res(estatus(404)).json({ message: "Administrador no encontrado."});
            }
            
            await Personal.deleteOne({ RFC });  // En caso de si encontrar un administrador con el RFC del parametro, elimina al administrador
            res.status(200).json({ message: "Administrador eliminado con exito."})
        }else{  
            console.error("El personal no es administrador.") // En caso de que el personal a querer eliminar no sea administrador manda un mensaje de error
        }
    }catch(error) { // Se define un try catch para atrapar cualquier error que pueda suceder
        console.error("Error al eliminar el administrador: ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}


//Actualizar administradores
exports.updateAdmin = async (req, res) => {
    const { RFC } = req.params; // RFC como parámetro
    const {
      NombrePersonal, ApPaterno, ApMaterno, Rol, CorreoElectronico,
      NumeroInterior, NumeroExterior, Calle, Colonia, Ciudad, Lada,
      Numero, Estado
    } = req.body;
  
    try {
      const admin = await Personal.findOne({ RFC }); // Buscar al administrador
  
      if (!admin) {
        return res.status(404).json({ message: "Empleado no encontrado." });
      }
  
      if (admin.Rol !== "Administrador") {
        return res.status(403).json({ message: "El personal no es administrador." });
      }
  
      // Verificar campos obligatorios
      if (!NombrePersonal || !ApPaterno || !CorreoElectronico ||
          !Rol || !NumeroExterior || !Calle || !Colonia ||
          !Ciudad || !Lada || !Numero || !Estado) {
        return res.status(400).json({ message: "Faltan campos requeridos." });
      }
  
      // Actualizar administrador
      await Personal.updateOne(
        { RFC },
        {
          $set: {
            NombrePersonal,
            ApPaterno,
            ApMaterno: ApMaterno || "",
            CorreoElectronico,
            Rol,
            Direccion: {
              NumeroInterior: NumeroInterior || "",
              NumeroExterior,
              Calle,
              Colonia,
              Ciudad
            },
            Telefono: [{ Lada, Numero }],
            Estado
          }
        }
      );
  
      res.status(200).json({ message: "Empleado actualizado con éxito." });
  
    } catch (error) {
      console.error("Error al actualizar administrador:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  };