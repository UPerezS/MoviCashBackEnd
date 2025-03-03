const activityService = require("../services/activityRegisterService");

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
    }``
};


//Exportamos los modulos de registros
module.exports = {registerActivity};

