const activityService = require("../services/activityService");

// Registro de actividades y acciones.
const registerActivity = async (req, res) => {
    try {
        const {RFC, Accion, Detalles} = req.body;

        if(!RFC || !Accion || !Detalles){
            return res.status(400).json({error:"Hay un campo faltante"});
        }

        const newAction = await activityService.addAction(
            RFC, 
            {
                Accion,
                Detalles
            }
        );

        if(Accion != "Cargar CSV"){
            return res.status(200).json({"Success": newAction});
        }else{
            return newAction;
        }
        //return newAction;
    } catch(error) {
        console.error("Error en el registro: " + error.message);
        if(Accion != "Cargar CSV"){
            return res.status(500).json({"Error": error.message});
        }else{
            throw new Error(error.message);
        }
    }
};

const getActivity = async (req, res) => {
    try {
        const { nombre, rol, fechaInicio, fechaFin, accion} = req.query;
        const filters = {nombre, rol, fechaInicio, fechaFin, accion};

        const activity = await activityService.getActivity(filters);
        res.json(activity);
    } catch(error) {
        console.error('Error al obtener las actividades: ', error);
        res.status(500).json({error : 'Error interno del servidor'});
    }
};

const getFileByName = async (req, res, fileName) => {
    try {
        const fileNameToUse = fileName || req.params.fileName || req.body.fileName;

        if (!fileNameToUse) {
            return res.status(400).json({error: "Nombre de archivo no proporcionado"});
        }

        const activity = await activityService.getFileByName(fileNameToUse);
        
        if (activity.length === 0) {
            return res.status(404).json({error: "No se encontraron actividades para este archivo"});
        }

        if (res) {
            res.json(activity);
        }
        return activity;
    } catch(error) {
        console.error('Error al obtener name del CSV: ', error);
        if (res) {
            res.status(500).json({error: 'Error interno del servidor'});
        }
        throw error;
    }
};

// Exportamos los modulos de registros
module.exports = {registerActivity, getActivity, getFileByName};