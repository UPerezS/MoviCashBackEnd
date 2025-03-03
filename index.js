require('dotenv').config();

const express = require('express');
const cors = require('cors');

const adminRoutes = require('./routes/adminRoutes.js') // Importa las rutas de admin
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
app.use('/admin', adminRoutes); // Monta las rutas bajo el prefijo "/admin"
app.use('/operator', operatorRoutes); // Monta las rutas bajo el prefijo "/operator"
app.use('/register', registerRoutes); // Monta las rutas bajo el prefijo "/register"
app.use('/auth', authRoutes); // Monta las rutas bajo el prefijo "/auth"
app.use('/filtros', filtroRoutes); // Monta las rutas bajo el prefijo "/filtros"

module.exports = app;