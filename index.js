require('dotenv').config();

const express = require('express');
const cors = require('cors');

const adminRoutes = require('./routes/adminRoutes.js') // Importa las rutas de admin

const app = express();

//Middlewares

app.use(cors());
app.use(express.json());

//Rutas
app.use('/admin', adminRoutes); // Monta las rutas bajo el prefijo "/admin"


// Exportación de la app express

module.exports = app;