const Personal = require("../models/personal");
const Actividad = require('../models/actividad')

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

//Eliminar Admines y registrar fecha de eliminacion en Actividad
exports.deleteAdmin = async (req, res) => {
    const { RFC } = req.params; // Se define como parametro el RFC
    const rol = await Personal.findOne({RFC: RFC},{Rol:1}) // Se guarda el rol del personal con el RFC del parametro, para validar que sea Admin

    try {
        if (rol.Rol === "Admin"){ // Se usa rol.Rol para ingresar al campo "Rol" del objeto "rol", con esto se valida que el personal a eliminar sea Admin
            const exist = await Personal.findOne({ RFC }); // Se guarda el Admin buscado
            if (!exist) { // Si no hay un Admin con el RFC del parametro, entonces se manda un mensaje de no encontrado
                console.log('Admin no encontrado.');
                return res.status(404).json({ message: "Admin no encontrado."});
            }

            // Registrar la actividad al eliminar
            await Actividad.updateOne(
                { RFC },
                {
                    $push: {
                        Acciones: {
                            Accion: "Eliminación",
                            Detalles: "Se ha eliminado el usuario de manera permanente.",
                            Fecha: new Date()
                        }
                    }
                },
                { upsert: true }
            );
            
            await Personal.deleteOne({ RFC });  // En caso de si encontrar un Admin con el RFC del parametro, elimina al Admin
            res.status(200).json({ message: "Admin eliminado con exito."})
        }else{  
            return res.status(404).json("El personal a eliminar no es admin");
        }
    }catch(error) { // Se define un try catch para atrapar cualquier error que pueda suceder
        console.error("Error al eliminar el Admin: ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};


// Actualizar Admin y registrar cambios en Actividad
exports.updateAdmin = async (req, res) => {
    const { RFC } = req.params;
    const cambios = req.body;
    const campos = Object.keys(cambios);

    try {
        // Construir proyección dinámica + Rol
        let proyeccion = {};
        campos.forEach(campo => {
            proyeccion[campo] = 1;
        });
        proyeccion.Rol = 1;

        // Buscar el admin
        const admin = await Personal.findOne({ RFC }).select(proyeccion);

        if (!admin) {
            return res.status(404).json({ message: "Admin no encontrado." });
        }
        if (admin.Rol !== "Admin") {
            return res.status(403).json({ message: "El usuario no es un Admin." });
        }

        // Función para limpiar campos innecesarios
        function limpiarCampos(obj) {
            const { Rol, Telefono,...resto } = obj;

            // Valida el contenido del telefono
            if (Telefono && Array.isArray(Telefono)) {
                const telefonoLimpio = Telefono.filter(tel => tel.Lada || tel.Numero);
                if (telefonoLimpio.length > 0) {
                    resto.Telefono = telefonoLimpio;
                }
            }
            return resto;
        }

        // Aplicar limpieza
        const adminLimpio = limpiarCampos(admin.toObject());
        const cambiosLimpios = limpiarCampos(cambios);

        const modificaciones = {
            Anterior: adminLimpio,
            Actualizado: cambiosLimpios
        };

        // Construir mensaje de detalles
        let detallesMensaje = "Se han actualizado los siguientes campos: ";
        detallesMensaje += campos.join(", ");

        // Registrar en coleccion Actividad
        await Actividad.updateOne(
            { RFC, Rol: admin.Rol },
            {
                $push: {
                    Acciones: {
                        Accion: "Actualización",
                        Detalles: detallesMensaje,
                        Modificacion: [modificaciones],
                        Fecha: new Date()
                    }
                }
            },
            { upsert: true }
        );

        console.log("Actividad registrada:", detallesMensaje);
        console.log("Cuerpo recibido:", cambios);
        console.log("Cuerpo limpio:", cambiosLimpios);


        // Actualizar en coleccion Personal
        await Personal.updateOne({ RFC }, { $set: cambios });

        res.status(200).json({ message: "Admin actualizado con éxito." });

    } catch (error) {
        console.error("Error al actualizar Admin:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};