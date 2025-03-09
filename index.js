require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.js'); // Importa las rutas de autenticación register, login, ect
const adminRoutes = require('./routes/adminRoutes.js') // Importa las rutas de administradores
const operatorRoutes = require('./routes/operatorRoutes.js');
const superRoutes = require('./routes/superRoutes.js');
const ordenanteRoutes = require('./routes/ordenanteRoutes.js');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.use('/admin', adminRoutes); // Monta las rutas bajo el prefijo "/admin"
app.use('/operator', operatorRoutes); // Monta las rutas bajo el prefijo "/operator"
app.use('/auth', authRoutes); // Monta las rutas bajo el prefijo "/auth"
app.use('/super', superRoutes); // Monta las rutas bajo el prefijo "/super"
app.use('/ordenante', ordenanteRoutes);


module.exports = app;