require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.js'); // Importa las rutas de autenticación

const app = express();

//Middlewares

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//Rutas

app.use('/auth', authRoutes); // Monta las rutas bajo el prefijo "/auth"


module.exports = app;