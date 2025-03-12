const Actividad = require("../models/actividad");

/**
 * 
 La funcion registra las acciones del personal
 en caso de que aun no se cuente con un registro de acciones,
 el sistema la crea automaticamente y registra las acciones.
 */

 const addAction = async (RFC, Rol, actionData) => {
    try {
        var activity = await Actividad.findOne({ RFC, Rol });

        // Si el registro de actividad no se encuentra, se crea y se guardan las acciones relacionadas.
        if (!activity) {
            const personal = await Personal.findOne({ RFC });

            if (!personal) throw new Error("Empleado no encontrado");

            const NombreCompleto = `${personal.NombrePersonal} ${personal.ApPaterno} ${personal.ApMaterno}`;

            // Creacion de el docuimento de actividad para el personal, se crea uno diferente por rol, asi el empleado cuando camnbie de rol podra identificar su actividad
            activity = new Actividad({
                RFC,
                NombreCompleto,  //Se concatena automaticamente de la coleccion Personal
                Rol,
                Acciones: [],    //El array de las acciones empieza vacio.
            });

            await activity.save();
        }

        //Fecha de cada nueva accion.
        actionData.Fecha = new Date(); 

        // Agregacion de cada accion nueva al registro.
        const updatedActivity = await Actividad.findOneAndUpdate(
            { RFC, Rol },
            { $push: { Acciones: actionData } }, // Como es un array, solo se agrega con un push la nueva accion.
            { new: true } 
        );

        if (!updatedActivity) {
            throw new Error("No se encontró el registro de actividades.");
        }

        return updatedActivity;  // Retornamos la actividad actualizada
    } catch (error) {
        console.error("Error en addAction:", error.message);
        throw new Error("Error al agregar la actividad: " + error.message);
    }
};

const getActivity = async(filters) => {
    try{
        var pipeline = [
            {$unwind: "$Acciones"},
            {$match:{}}
        ];

        var matchStage = {};

        //Filtramos por nombre si se proporciona
        if(filters.nombre){
            matchStage.NombreCompleto = {$regex: new RegExp(filters.nombre,'i')}; //lo hacemos insensible a mayusculas y minusculas
        }

        //Filtramos por ROL si se proporciona
        if(filters.rol){
            matchStage.Rol = filters.rol;
        }
        //Filtramos por rango de fechas
        if(filters.fechaInicio && filters.fechaFin){
            matchStage["Acciones.Fecha"] = {
                $gte: new Date(filters.fechaInicio),
                $lte: new Date(filters.fechaFin)
            };
        }

        //Filtramos por tipo de accion
        if(filters.accion){
            matchStage["Acciones.Accion"] = filters.accion;
        }

        if(Object.keys(matchStage).length > 0){
            pipeline.push({$match:matchStage});
        }

        const activities = await Actividad.aggregate(pipeline);

        return activities;
    }catch(error){
        console.error("Error en getActivity: ", error.message);
        throw new Error("Error al obtener actividades: "+error.message);
    }
}

module.exports = {addAction, getActivity};