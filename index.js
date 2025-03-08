require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.js'); // Importa las rutas de autenticación register, login, ect


const adminRoutes = require('./routes/adminRoutes.js') // Importa las rutas de admin
const operatorRoutes = require('./routes/operatorRoutes.js'); // Importa las rutas de operador
const activityRoutes = require('./routes/activityRoutes.js'); // Importa las rutas de activity
const authRoutes = require('./routes/auth.js'); // Importa las rutas de autenticación
const registerRoutes = require('./routes/registerRoutes.js');
const filtroRoutes = require('./routes/filtrosRoutes.js');
const superRoutes = require('./routes/superRoutes.js');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas

app.use('/activity',activityRoutes); // Monta las rutas bajo el prefijo "/activity" 
app.use('/filtros', filtroRoutes); // Monta las rutas bajo el prefijo "/filtros"

// Rutas
app.use('/admin', adminRoutes); // Prefijo "/admin"
app.use('/operator', operatorRoutes); // Prefijo "/operator"
app.use('/register', registerRoutes); // Prefijo "/register"
app.use('/auth', authRoutes); // Prefijo "/auth"
app.use('/superadmin', superRoutes); // Ahora coincide con "/superadmin/"

module.exports = app;
