const app = require('./index.js');
const conectarDB = require('./config/mongo.js');

const transaccionRoutes = require('./routes/transaccionRoutes.js');

// Configurar rutas
app.use('/api/transacciones', transaccionRoutes);

// Conectar a la base de datos
conectarDB();

const PORT = process.env.PORT || 8090;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});