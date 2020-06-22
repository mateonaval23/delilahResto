const express = require('express');
const jwt = require('jsonwebtoken');
const sql = require('../data/mysql');
const secretWord = "s3cr3tW0rd";
const route = express.Router();


// Validar jwt

const rolesAdmin = (req, res, next) => {
    try{
        
        const token = req.headers.authorization.split(' ')[1];
        const verifyToken = jwt.verify(token, secretWord);
        if(verifyToken){
            req.data = verifyToken;
            let userInfo = req.data.data[0];
            if(req.method != "GET" && userInfo.tipousuario != "A"){
                res.status(401).send("Error");
            }
            else{
                return next()
            }
            
        }

    }catch(err){
        res.json({error: "Error al validar usuario"});
    }
}

route.use(rolesAdmin);

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

route.delete("/:id", (req, res) => {
    let productoId = req.params.id;
    sql.query('DELETE FROM platos WHERE id = :id', 
        { replacements: {
                id : productoId
            } 
        }
    ).then(result =>{
        console.log(result);
        res.status(204);
        res.send();
    });
});

module.exports = route;