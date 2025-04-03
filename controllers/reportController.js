const reportService = require("../services/reportService");

//Obtener transacciones.

const getTransaccion = async (req,res) => {
    try{
        const{IdComprobante} = req.params;

        const transaccion = await reportService.getTransaccion(IdComprobante);

        if(!transaccion){
            return res.status(404).json({message: "Transaccion no encontrada"});
        }
        res.json(transaccion);
    }catch(error){
        console.error('Error al obtener la transaccion',error.message);
        res.status(500).json({error:"Error interno del servidor"});
    }
};

module.exports = {getTransaccion}