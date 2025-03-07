require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.js'); // Importa las rutas de autenticación register, login, ect


const adminRoutes = require('./routes/adminRoutes.js') // Importa las rutas de admin
const operatorRoutes = require('./routes/operatorRoutes.js'); // Importa las rutas de operador
const activityRoutes = require('./routes/activityRoutes.js'); // Importa las rutas de activity
const authRoutes = require('./routes/auth.js'); // Importa las rutas de autenticación
const operatorRoutes = require('./routes/operatorRoutes.js');
const registerRoutes = require('./routes/registerRoutes.js');
const filtroRoutes = require('./routes/filtrosRoutes.js');

const app = express();

//Middlewares

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.use('/auth', authRoutes); // Monta las rutas bajo el prefijo "/auth"

app.use('/admin', adminRoutes); // Monta las rutas bajo el prefijo "/admin"
app.use('/operator', operatorRoutes); // Monta las rutas bajo el prefijo "/operator"
app.use('/activity',activityRoutes); // Monta las rutas bajo el prefijo "/activity" 
app.use('/filtros', filtroRoutes); // Monta las rutas bajo el prefijo "/filtros"

module.exports = app;