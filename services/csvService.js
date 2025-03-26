const csv = require('csv-parser');
const fs = require('fs');
const Ordenante = require('../models/ordenante');
const Om = require('../middlewares/ordenanteMiddleware');

exports.insertBulk = async (req, res) => {
  const fields = [];
  const errores = [];
  const duplicados = [];

  return new Promise((resolve, reject) => {
    const processRow = async (row) => {
      if (Object.values(row).every(val => val === '')) return null;
    
      const ordenante = {
        RFCOrdenante: row.RFCOrdenante,
        NombreOrdenante: row.NombreOrdenante,
        ApPaterno: row.ApPaterno,
        ApMaterno: row.ApMaterno || null,
        Sexo: row.Sexo,
        FechaNacimiento: new Date(row.FechaNacimiento),
        NumeroCuenta: row.NumeroCuenta,
        Saldo: parseFloat(row.Saldo),
        Estado: row.Estado,
        RFCOperador: row.RFCOperador,
        Telefono: Array.isArray(row.Telefono) ? row.Telefono : [row.Telefono], 
        Direccion: {
          NumeroExterior: row.NumeroExterior,
          NumeroInterior: row.NumeroInterior || null,
          Calle: row.Calle,
          Colonia: row.Colonia,
          Ciudad: row.Ciudad
        }
      };

      const { error } = Om.validateRegisterOrdenante1(ordenante);

      if (error) {
        errores.push({
          fila: row,
          mensaje: 'Datos no válidos',
          detalles: error.details
        });
        return null;
      }

      const existingOrdenante = await Ordenante.findOne({
        $or: [
          { RFCOrdenante: ordenante.RFCOrdenante },
          { NumeroCuenta: ordenante.NumeroCuenta }
        ]
      });

      if (existingOrdenante) {
        duplicados.push({
          registro: ordenante,
          mensaje: 'Registro duplicado',
          camposDuplicados: existingOrdenante.RFCOrdenante === ordenante.RFCOrdenante ? 'RFCOrdenante' : 'NumeroCuenta'
        });
        return null;
      }

      return ordenante;
    };

    const processFile = async () => {
      try {
        const rows = [];
        
        const readStream = fs.createReadStream(req.file.path)
          .pipe(csv());

        for await (const row of readStream) {
          const processedRow = await processRow(row);
          if (processedRow) rows.push(processedRow);
        }

        if (errores.length > 0) {
          return res.status(400).json({
            message: 'Hay errores en los datos, modificalos y vuelve a intentar',
            registrosConError: errores.length,
            errores: errores
          });
        }

        if (rows.length > 0) {
          const result = await Ordenante.insertMany(rows, { 
            ordered: false  
          });
          
          return res.status(200).json({
            message: 'CSV procesado con exito',
            registrosInsertados: result.length,
            registrosDuplicados: duplicados.length,
            duplicados: duplicados
          });
        } else {
          return res.status(400).json({
            message: 'No hay registros válidos para insertar',
            registrosDuplicados: duplicados.length,
            duplicados: duplicados
          });
        }
      } catch (error) {
        console.error("Error detallado al insertar registros:", error);
        if (!res.headersSent) {
          return res.status(500).json({ 
            message: 'Error al insertar registros', 
            error: error.message,
            detallesError: error
          });
        }
      }
    };

    processFile()
      .then(resolve)
      .catch(reject);
  });
};