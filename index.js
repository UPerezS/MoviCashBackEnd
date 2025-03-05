require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.js'); // Importa las rutas de autenticación register/login
const registerRoutes = require('./routes/registerRoutes') // Importa las rutas bajo el prefijo /register
const adminRoutes = require('./routes/adminRoutes.js') // Importa las rutas de admin
const operatorRoutes = require('./routes/operatorRoutes.js'); // Importa las rutas de operador
const activityRoutes = require('./routes/activityRoutes.js'); // Importa las rutas de activity

const app = express();

//Middlewares

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.use('/auth', authRoutes); // Monta las rutas bajo el prefijo "/auth"
app.use('/register',registerRoutes);
app.use('/admin', adminRoutes); // Monta las rutas bajo el prefijo "/admin"
app.use('/operator', operatorRoutes); // Monta las rutas bajo el prefijo "/operator"
app.use('/activity',activityRoutes); // Monta las rutas bajo el prefijo "/activity" 

module.exports = app;