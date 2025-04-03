const multer = require('multer');
const Joi = require('joi');

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'uploads/');
    },
    fileName:(req,file,cb) => {
        cb(file.originalname);
        const fileName =file.originalname;
        req.fileName=fileName;
        cb(null,fileName);
        console.log(fileName);
    }
});

// Validación con Joi para el registro de ordenante
exports.validateRegisterOrdenante1 = (ordenante) => {
    const schema = Joi.object({
      RFCOrdenante: Joi.string()
        .pattern(/^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/)
        .required(),
      
      RFCOperador: Joi.string()
        .pattern(/^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/)
        .required(),
      
      NombreOrdenante: Joi.string().required(),
      
      ApPaterno: Joi.string().required(),
      
      ApMaterno: Joi.string().allow(null, ''),
      
      Sexo: Joi.string().valid('M', 'F').required(),
      
      FechaNacimiento: Joi.date().required(),
      
      NumeroCuenta: Joi.string().required(),
      
      Saldo: Joi.number().min(0).required(),
      
      Estado: Joi.string().valid('Activo', 'Inactivo', 'Bloqueado').required(),
      
      Telefono: Joi.array().items(
        Joi.string().pattern(/^\d{7,10}$/)
      ).min(1).required(),
      
      Direccion: Joi.object({
        NumeroExterior: Joi.string().required(),
        NumeroInterior: Joi.string().allow(null, ''),
        Calle: Joi.string().required(),
        Colonia: Joi.string().required(),
        Ciudad: Joi.string().required()
      }).required()
    });
  
    return schema.validate(ordenante);
  };

exports.upload = multer({storage:storage}).single('file');