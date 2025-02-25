const Personal = require("../models/personal");

//Mostrar usuarios
exports.getAllAdmin = async (req, res) => {
    try {
        const admin = await Personal.find({ Rol: "Admin" }); // Se guardan todo el personal que sea administrador
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
        if (rol.Rol === "Admin"){ // Se usa rol.Rol para ingresar al campo "Rol" del objeto "rol", con esto se valida que el personal a eliminar sea administrador
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
    const { RFC } = req.params; // Se define como parametro el RFC
    const rol = await Personal.findOne({ RFC: RFC }, { Rol: 1 }); // Se guarda el rol del personal con el RFC del parametro, para validar que sea administrador

    const { // Se definen todos los campos que se pueden actualizar del administrador
        NombrePersonal, 
        ApPaterno, 
        ApMaterno, 
        Sexo, 
        FechaNacimiento, 
        Rol, 
        NumeroInterior, 
        NumeroExterior, 
        Calle, 
        Colonia, 
        Ciudad, 
        Lada, 
        Numero, 
        Estado 
    } = req.body;

    try {
        if (rol.Rol === "Admin") {  // Se usa rol.Rol para ingresar al campo "Rol" del objeto "rol", con esto se valida que el personal a actualizar sea administrador
            const exist = await Personal.findOne({ RFC }); // Se guarda el administrador buscado

            if (!exist) { // Si no hay un administrador con el RFC del parametro, entonces se manda un mensaje de no encontrado
                console.log("Empleado no encontrado.");
                return res.status(404).json({ message: "Empleado no encontrado." });
            }

            await Personal.updateOne( // En caso de si encontrar un administrador con el RFC del parametro, actualiza al administrador
                { RFC },              // Es importante que esten los campos completos de lo contrario no se podra actualizar
                { 
                    $set: {
                        "NombrePersonal": NombrePersonal,
                        "ApPaterno": ApPaterno,
                        "ApMaterno": ApMaterno,
                        "Sexo": Sexo,
                        "FechaNacimiento": new Date(FechaNacimiento),
                        "Rol": Rol, // Sin convertir a Number, ya que 'Rol' debe ser un String
                        "Direccion": {
                            "NumeroInterior": NumeroInterior,
                            "NumeroExterior": NumeroExterior,
                            "Calle": Calle,
                            "Colonia": Colonia,
                            "Ciudad": Ciudad
                        },
                        "Telefono": [
                            {
                                "Lada": Lada,
                                "Numero": Numero
                            }
                        ],
                        "Estado": Estado,
                        "FechaUltimaModificacion": new Date() // Esta definido que se actualiza en cada modificacion
                    }
                }
            );

            res.status(200).json({ message: "Empleado actualizado con éxito." });

        } else { // En caso de que el personal a querer actualizar no sea administrador manda un mensaje de error
            console.error("El personal no es administrador.");
            res.status(403).json({ message: "El personal no es administrador." });
        }
    } catch (error) { // Se define un try catch para atrapar cualquier error que pueda suceder
        console.log("Error al actualizar administrador: ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}