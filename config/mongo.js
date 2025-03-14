const mongoose = require('mongoose');
require('dotenv').config();

const conectarDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://root:PbsSjrET5MRtvAhR@bdintegradora2.a7ouu.mongodb.net/moviCash?retryWrites=true&w=majority&appName=BDIntegradora2';
    
    await mongoose.connect(mongoURI, {
      dbName: 'moviCash'
    });
    
    console.log('Conexión a MongoDB establecida correctamente');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

module.exports = conectarDB;