require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes.js'); // Importa las rutas de autenticación

const superRoutes = require('./routes/superRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js') // Importa las rutas de admin
const operatorRoutes = require('./routes/operatorRoutes.js');
const ordenanteRoutes = require('./routes/ordenanteRoutes.js');

const activityRoutes = require('./routes/activityRoutes.js');
const transaccionRoutes = require('./routes/transaccionRoutes.js');
const notificacionRoutes = require('./routes/notificacionRoutes');
const transaccionRequestRoutes = require('./routes/transaccionRequestRoutes.js');

const filtroRoutes = require('./routes/filtrosRoutes.js');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.use('/auth', authRoutes); // Monta las rutas bajo el prefijo "/auth"
app.use('/super', superRoutes); // Monta las rutas bajo el prefijo "/super"
app.use('/admin', adminRoutes); // Monta las rutas bajo el prefijo "/admin"
app.use('/operator', operatorRoutes); // Monta las rutas bajo el prefijo "/operator"
app.use('/ordenante', ordenanteRoutes);

app.use('/transaccion',transaccionRoutes) // Monta las rutas bajo el prefijo "/transaccion"
app.use('/activity',activityRoutes); // Monta las rutas bajo el prefijo "/activity"
app.use('/notificacion',notificacionRoutes);

app.use('/filtros', filtroRoutes); // Monta las rutas bajo el prefijo "/filtros"

//Solicitud de transacciones
app.use('/transacciones', transaccionRequestRoutes); // Monta las rutas bajo el refijo /transacciones

module.exports = app;