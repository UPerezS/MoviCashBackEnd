const Personal = require("../models/personal");

//Mostrar usuarios
exports.getAllAdmin = async (req, res) => {
    try {
        const admin = await Personal.find({ Rol: "Admin" }); // Se guardan todo el personal que sea Admin
        if (admin.length === 0) {
            return res.status(404).json({ message: "No se encontraron Admines." });
        }
        res.status(200).json({ message: "Admines encontrados.", data: admin }); // Se guarda dentro del json el personal Admin despues de el mensaje
    } catch (error) {
        console.error("Error al obtener los Admines: ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

//Eliminar Admines
exports.deleteAdmin = async (req, res) => {
    const { RFC } = req.params; // Se define como parametro el RFC
    const rol = await Personal.findOne({RFC: RFC},{Rol:1}) // Se guarda el rol del personal con el RFC del parametro, para validar que sea Admin

    try {
        if (rol.Rol === "Admin"){ // Se usa rol.Rol para ingresar al campo "Rol" del objeto "rol", con esto se valida que el personal a eliminar sea Admin
            const exist = await Personal.findOne({ RFC }); // Se guarda el Admin buscado
            if (!exist) { // Si no hay un Admin con el RFC del parametro, entonces se manda un mensaje de no encontrado
                console.log('Admin no encontrado.');
                return res(estatus(404)).json({ message: "Admin no encontrado."});
            }
            
            await Personal.deleteOne({ RFC });  // En caso de si encontrar un Admin con el RFC del parametro, elimina al Admin
            res.status(200).json({ message: "Admin eliminado con exito."})
        }else{  
            console.error("El personal no es Admin.") // En caso de que el personal a querer eliminar no sea Admin manda un mensaje de error
        }
    }catch(error) { // Se define un try catch para atrapar cualquier error que pueda suceder
        console.error("Error al eliminar el Admin: ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}


//Actualizar Admines
exports.updateAdmin = async (req, res) => {
    const { RFC } = req.params; // RFC como parámetro
    const {
      NombrePersonal, ApPaterno, ApMaterno, Rol, CorreoElectronico,
      NumeroInterior, NumeroExterior, Calle, Colonia, Ciudad, Lada,
      Numero, Estado
    } = req.body;
  
    try {
      const admin = await Personal.findOne({ RFC }); // Buscar al Admin
  
      if (!admin) {
        return res.status(404).json({ message: "Empleado no encontrado." });
      }
  
      if (admin.Rol !== "Admin") {
        return res.status(403).json({ message: "El personal no es Admin." });
      }
  
      // Verificar campos obligatorios
      if (!NombrePersonal || !ApPaterno || !CorreoElectronico ||
          !Rol || !NumeroExterior || !Calle || !Colonia ||
          !Ciudad || !Lada || !Numero || !Estado) {
        return res.status(400).json({ message: "Faltan campos requeridos." });
      }
  
      // Actualizar Admin
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
      console.error("Error al actualizar Admin:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  };