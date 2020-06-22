const express = require('express');
const sql = require('../data/mysql');
const route = express.Router();


route.get("/", (req, res) => {
    sql.query('SELECT * FROM platos', 
        { type : sql.QueryTypes.SELECT }
    ).then(result =>{
        res.json(result);
    });

})

route.post("/", (req, res) => {
    let productos = req.body;
    sql.query('INSERT INTO platos(nombre, urlimagen, precio) VALUES (:nombre , :urlimagen, :precio)', 
        { replacements: {
                nombre : productos.nombre,
                urlimagen : productos.urlImagen,
                precio : productos.precio
            } 
        }
    ).then(result =>{
        res.status(200).json({message: "El producto se creo correctamente", producto: productos});
    });
    
})

route.put("/", (req, res) => {
    let productos = req.body;
    sql.query('UPDATE platos SET nombre = :nombre, urlimagen = :urlimagen, precio = :precio WHERE id = :id', 
        { replacements: {
                id : productos.id,
                nombre : productos.nombre,
                urlimagen : productos.urlImagen,
                precio : productos.precio
            } 
        }
    ).then(result =>{
        res.status(200).send(productos);
    });
});

route.delete("/", (req, res) => {
    let productos = req.body;
    sql.query('DELETE FROM platos WHERE id = :id', 
        { replacements: {
                id : productos.id
            } 
        }
    ).then(result =>{
        console.log(result);
        res.status(204);
        res.send();
    });
});

module.exports = route;