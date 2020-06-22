// Dependencias requeridas
const express = require('express');
const bodyParser = require('body-parser');
const platos = require('./routes/platos');
const usuarios = require('./routes/usuarios');
const pedidos = require('./routes/pedidos');

// Inicializando server
const server = express();

// Middlewares
server.use(bodyParser.json());
server.use("/platos", platos);
server.use("/usuarios", usuarios);
server.use("/pedidos", pedidos);



server.listen(3000, () =>{
    console.log("Servidor iniciado");
});