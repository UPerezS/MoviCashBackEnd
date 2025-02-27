require("dotenv").config(); // Cargar variables de entorno

const app = require('./index.js'); // Importación de la app express
const conectarDB = require('./config/mongo.js'); // Importación de la conexión de la BD

conectarDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
