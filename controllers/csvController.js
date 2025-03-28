const csvService = require('../services/csvService');

exports.insertBulk = async (req, res) => {
  try {
    await csvService.insertBulk(req, res);
  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    res.status(500).json({ 
      message: "Error al procesar la solicitud", 
      error: error.message 
    });
  }
};