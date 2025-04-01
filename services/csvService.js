const csv = require('csv-parser');
const fs = require('fs');
const Ordenante = require('../models/ordenante');
const Om = require('../middlewares/csvMiddleware');
const activityController = require('../controllers/activityController');
const activityService = require('../services/activityService');

exports.insertBulk = async (req, res) => {
    const fields = [];
    const errores = [];
    const duplicados = [];
    const fileName = req.file ? req.file.originalname : null;
  
    if (!fileName) {
        return res.status(400).json({ message: "No se proporcionó un nombre de archivo válido." });
    }

    try {
        const isExistingCSV = await activityService.getFileByName(fileName);

        if(isExistingCSV.length > 0){
            return res.status(400).json({ message: "El archivo ya existe en la base de datos." });
        }

        const {RFC} = req.body;

        if (!RFC) {
            return res.status(400).json({ message: 'El RFC del usuario que sube el archivo son necesarios.' });
        }

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

            const actionData = {
                Accion: 'Cargar CSV',
                Detalles: fileName
            };
      
            await activityController.registerActivity({
                body: {
                    RFC,
                    Accion: 'Cargar CSV',
                    Detalles: fileName
                }
            }, res);

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
        return res.status(500).json({ 
            message: 'Error al insertar registros', 
            error: error.message,
            detallesError: error
        });
    } finally {
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (unlinkError) => {
                if (unlinkError) {
                    console.error('Error al eliminar el archivo:', unlinkError);
                }else{
                  console.log('Archivo Eliminado de uploads');
                }
            });
        }
    }
};

exports.validateCSVFile = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }

    const allowedFileTypes = ['text/csv', 'application/vnd.ms-excel'];
  
    if (!allowedFileTypes.includes(req.file.mimetype)) {
        fs.unlink(req.file.path, (unlinkError) => {
            if (unlinkError) {
                console.error('Error al eliminar el archivo no válido:', unlinkError);
            }
        });

        return res.status(400).json({ 
            message: 'Tipo de archivo no válido. Solo se permiten archivos CSV' 
        });
    }

    next();
};