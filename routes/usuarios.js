const express = require('express');
const sql = require('../data/mysql');
const jwt = require('jsonwebtoken');

const route = express.Router();
const secretWord = "s3cr3tW0rd";

//Funciones internas
function validarUsuario(user, pwd){
    return sql.query('SELECT id, username, tipousuario FROM usuarios WHERE (username = :username or correo = :username) and password = :pass', 
         {  replacements:  {username : user, pass: pwd}, type : sql.QueryTypes.SELECT }
     );
}

function registrarUsuario(user){
    return sql.query("INSERT INTO usuarios (nombres, correo, username, password, direccion, telefono, tipousuario ) values(?,?,?,?,?,?,'U')", 
        {  replacements: [user.nombres, user.correo, user.username, user.password, user.direccion , user.telefono]}
    );
}

 route.post('/login', (req, res) =>{
    const {username, pass} = req.body;

    const validado = validarUsuario(username, pass).then(result => {
        console.log();
        if(result.length == 0){
            res.json({error: "Usuario o contraseña incorrecta"});
            return;
        }
        let data = result;
        const token = jwt.sign({
            data
        }, secretWord);
        res.json({token});
    });
});


route.post('/registrar', (req, res) => {
    const user = req.body;
    console.log(user);
    const registrado = registrarUsuario(user).then(result => {
       res.send("Usuario registrado con exito");
    }).catch(error => console.log(error));
})



route.get("/", (req, res) => {
    sql.query('SELECT * FROM usuarios', 
        { type : sql.QueryTypes.SELECT }
    ).then(result =>{
        res.json(result);
    });

})

route.post("/", (req, res) => {
    // let productos = req.body;
    // sql.query('INSERT INTO platos(nombre, urlimagen, precio) VALUES (:nombre , :urlimagen, :precio)', 
    //     { replacements: {
    //             nombre : productos.nombre,
    //             urlimagen : productos.urlImagen,
    //             precio : productos.precio
    //         } 
    //     }
    // ).then(result =>{
    //     res.status(200).json({message: "El producto se creo correctamente", producto: productos});
    // });
    
})

route.put("/", (req, res) => {
    // let productos = req.body;
    // sql.query('UPDATE platos SET nombre = :nombre, urlimagen = :urlimagen, precio = :precio WHERE id = :id', 
    //     { replacements: {
    //             id : productos.id,
    //             nombre : productos.nombre,
    //             urlimagen : productos.urlImagen,
    //             precio : productos.precio
    //         } 
    //     }
    // ).then(result =>{
    //     res.status(200).send(productos);
    // });
});

route.delete("/", (req, res) => {
    // let productos = req.body;
    // sql.query('DELETE FROM platos WHERE id = :id', 
    //     { replacements: {
    //             id : productos.id
    //         } 
    //     }
    // ).then(result =>{
    //     console.log(result);
    //     res.status(204);
    //     res.send();
    // });
});


module.exports = route;