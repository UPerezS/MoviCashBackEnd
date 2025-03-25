const Transaccion = require ("../models/transaccion");

//Obtener depositos
const getTransaccion = async (idComprobante) => {

    try{
        const transaccion = await Transaccion.findOne({IdComprobante: idComprobante}).exec();

        if(!transaccion){
            return null;
        }

        var data = {};

        if(transaccion.Tipo === "Depósito"){
            data = {
                IdComprobante: transaccion.IdComprobante,
                Fecha: transaccion.Fecha,
                NumeroCuentaBeneficiario: transaccion.NumeroCuentaBeneficiario,
                NombreCompletoBeneficiario: transaccion.NombreCompletoBeneficiario,
                RFCOperador: transaccion.RFCOperador,
                Monto: transaccion.Monto,
                Tipo: transaccion.Tipo,
                Estado: transaccion.Estado
            };
        }else if(transaccion.Tipo === "Transferencia"){
            data = {
                IdComprobante: transaccion.IdComprobante,
                Fecha: transaccion.Fecha,
                NumeroCuentaOrdenante: transaccion.NumeroCuentaOrdenante,
                NombreCompletoOrdenante: transaccion.NombreCompletoOrdenante,
                NumeroCuentaBeneficiario: transaccion.NumeroCuentaBeneficiario,
                RFCOperador: transaccion.RFCOperador,
                Monto: transaccion.Monto,
                Tipo: transaccion.Tipo,
                Estado: transaccion.Estado
            };
        }
        return(data);
    }catch(error){
        console.error("Error al obtener la transaccion: ", error);
        throw error;
    }
};

module.exports = {getTransaccion};