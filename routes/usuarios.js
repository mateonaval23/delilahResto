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

const checkMyInfo = (req, res, next) =>{
    try{
        
        const token = req.headers.authorization.split(' ')[1];
         
        const verifyToken = jwt.verify(token, secretWord);
        if(verifyToken){
            req.data = verifyToken;
            let userInfo = req.data.data[0];
            if(userInfo.id != req.params.id){
                res.status(401).send();
            }
            else{
                return next()
            }
            
        }

    }catch(err){
        res.json({error: "Error al validar usuario"});
    }
}

const rolAdmin = (req, res, next) => {
    try{
        
        const token = req.headers.authorization.split(' ')[1];
        const verifyToken = jwt.verify(token, secretWord);
        if(verifyToken){
            req.data = verifyToken;
            let userInfo = req.data.data[0];
            console.log(userInfo);
            if(userInfo.tipousuario != "A"){
                res.status(401).send();
            }
            else{
                return next()
            }
            
        }

    }catch(err){
        res.json({error: "Error al validar usuario"});
    }
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



route.get("/", rolAdmin, (req, res) => {
    sql.query('SELECT * FROM usuarios', 
        { type : sql.QueryTypes.SELECT }
    ).then(result =>{
        res.json(result);
    });

})


route.get("/:id", checkMyInfo, (req, res) => {
    const userId = req.params.id;
    sql.query('SELECT * FROM usuarios where id = :id ', 
        {replacements: {id : userId}, type : sql.QueryTypes.SELECT }
    ).then(result =>{
        res.json(result);
    });

})


route.put("/:id", checkMyInfo, (req, res) => {
    const usuario = req.body;
    const userId = req.params.id;
    sql.query('UPDATE usuarios SET nombres = :nombres, correo = :correo, username = :username, password = :password, direccion = :direccion, telefono = :telefono,  WHERE id = :id', 
        { replacements: {
            id : userId,
            nombres: usuario.nombres,
            correo: usuario.correo,
            username : usuario.username,
            password : usuario.password,
            direccion : usuario.direccion,
            telefono : usuario.telefono
            } 
        }
    ).then(result =>{
        res.status(200).send(usuario);
    });
});

route.delete("/:id", checkMyInfo, (req, res) => {
    const userId = req.params.id;
    sql.query('DELETE FROM usuario WHERE id = :id', 
        { replacements: {
                id : userId
            } 
        }
    ).then(result =>{
        res.status(204);
        res.send();
    });
});


module.exports = route;