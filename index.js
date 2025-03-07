require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.js'); // Importa las rutas de autenticación register, login, ect
const adminRoutes = require('./routes/adminRoutes.js') // Importa las rutas de admin
const superRoutes = require('./routes/superRoutes.js');
const activityRoutes = require('./routes/activityRoutes.js');

const filtroRoutes = require('./routes/filtrosRoutes.js');
const transaccionRoutes = require('./routes/transaccionRoutes.js')


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas

app.use('/admin', adminRoutes); // Monta las rutas bajo el prefijo "/admin"
app.use('/operator', operatorRoutes); // Monta las rutas bajo el prefijo "/operator"
app.use('/activity',activityRoutes); // Monta las rutas bajo el prefijo "/activity" 

module.exports = app;