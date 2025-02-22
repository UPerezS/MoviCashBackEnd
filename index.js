require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

//Middlewares

app.use(cors());
app.use(express.json());

//Rutas



// Exportación de la app express

module.exports = app;