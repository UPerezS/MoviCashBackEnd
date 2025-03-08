const activityService = require("../services/activityService");

//Registro de actividades y acciones.

const registerActivity = async (req,res)=>{
    try{
        const {RFC,Rol,Accion,Detalles} = req.body;

        if(!RFC || !Rol || !Accion || ! Detalles){
            return res.status(400).json({error:"Hay un campo faltante"});
        }

        const newAction = await activityService.addAction(
            RFC, 
            Rol, {
            Accion,
            Detalles
        });

        res.status(201).json({message:"Actividad registrada con exito", activity: newAction});
    }catch(error){
        console.error("Error en el registro: " + error.message);
        res.status(500).json({error:"Error interno del servidor"});
    };
};

const getActivity = async (req,res) => {
    try {
        const { nombre, rol, fechaInicio, fechaFin, accion} = req.query;
        const filters = {nombre, rol, fechaInicio, fechaFin, accion};

        const activity = await activityService.getActivity(filters);
        res.json(activity);
    }catch(error){
        console.error('Error al obtener las actividades: ',error);
        res.status(500).json({error : 'Error en el servidor'});
    }
};


//Exportamos los modulos de registros
module.exports = {registerActivity, getActivity};

