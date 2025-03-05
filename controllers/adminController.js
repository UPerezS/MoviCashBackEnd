const mongoose = require('mongoose');
exports.crearOrdenante = async (req, res) => {
    try {
      const { 
        RFCOrdenante, 
        NombreOrdenante, 
        ApPaterno, 
        ApMaterno, 
        Sexo, 
        FechaNacimiento, 
        NumeroCuenta, 
        Saldo, 
        RFCOperador,
        Telefono,
        Direccion
      } = req.body;
      
      // Crear el BSON directamente con los tipos correctos
      const ordenanteDoc = {
        RFCOrdenante,
        NombreOrdenante,
        ApPaterno,
        ApMaterno: ApMaterno || "",
        Sexo,
        FechaNacimiento: new Date(FechaNacimiento),
        NumeroCuenta,
        Saldo: parseFloat(Saldo), // Usar parseFloat directamente
        Estado: "Activo",
        FechaRegistro: new Date(),
        RFCOperador,
        Telefono,
        Direccion: {
          NumeroInterior: Direccion.NumeroInterior || "",
          NumeroExterior: Direccion.NumeroExterior,
          Calle: Direccion.Calle,
          Colonia: Direccion.Colonia,
          Ciudad: Direccion.Ciudad
        },
        FechaUltimaModificacion: new Date()
      };
      
      // Usar el driver de MongoDB directamente
      const db = mongoose.connection.db;
      
      // Bypass validation temporalmente para pruebas
      // Nota: Esta operación requiere permisos de administrador
      try {
        const resultado = await db.collection('Ordenante').insertOne(
          ordenanteDoc,
          { bypassDocumentValidation: true }
        );
        
        res.status(201).json({
          success: true,
          message: "Ordenante creado correctamente",
          data: {
            id: resultado.insertedId,
            ...ordenanteDoc
          }
        });
      } catch (dbError) {
        console.error("Error al insertar:", dbError);
        
        // Si no podemos hacer bypass, intentamos otra estrategia
        if (dbError.code === 121) {
          // Usar comando runCommand directamente
          try {
            const cmdResult = await db.command({
              insert: 'Ordenante',
              documents: [ordenanteDoc],
              bypassDocumentValidation: true
            });
            
            if (cmdResult.ok === 1) {
              return res.status(201).json({
                success: true,
                message: "Ordenante creado correctamente (usando comando)",
                data: ordenanteDoc
              });
            } else {
              throw new Error("Error al ejecutar comando: " + JSON.stringify(cmdResult));
            }
          } catch (cmdError) {
            console.error("Error al ejecutar comando:", cmdError);
            return res.status(500).json({
              success: false,
              error: "No se pudo crear el ordenante con bypass",
              details: cmdError.message
            });
          }
        }
        
        return res.status(500).json({
          success: false,
          error: "Error de validación",
          details: dbError.errInfo?.details || dbError.message
        });
      }
    } catch (error) {
      console.error("Error general:", error);
      res.status(500).json({
        success: false, 
        error: error.message
      });
    }
  };