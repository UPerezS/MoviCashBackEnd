require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.js'); // Importa las rutas de autenticación register, login, ect


const operatorRoutes = require('./routes/operatorRoutes.js'); // Importa las rutas de operador
const adminRoutes = require('./routes/adminRoutes.js') // Importa las rutas de admin
const superRoutes = require('./routes/superRoutes.js');

const activityRoutes = require('./routes/activityRoutes.js'); // Importa las rutas de activity
const transaccionRoutes = require('./routes/transaccionRoutes.js')


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.use('/auth', authRoutes); // Monta las rutas bajo el prefijo "/auth"
app.use('/operator', operatorRoutes); // Monta las rutas bajo el prefijo "/operator"
app.use('/admin', adminRoutes); // Monta las rutas bajo el prefijo "/admin"
app.use('/super', superRoutes); // Monta las rutas bajo el prefijo "/super"

app.use('/transaccion',transaccionRoutes) // Monta las rutas bajo el prefijo "/transaccion"
app.use('/activity',activityRoutes); // Monta las rutas bajo el prefijo "/activity"


module.exports = app;