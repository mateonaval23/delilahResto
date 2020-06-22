const express = require('express');
const sql = require('../data/mysql');
const jwt = require('jsonwebtoken');

const route = express.Router();
const secretWord = "s3cr3tW0rd";
var usuarioId;
//Funciones internas
const validateUser = (req, res, next) => {
    try{
        
        const token = req.headers.authorization.split(' ')[1];
        const verifyToken = jwt.verify(token, secretWord);
        if(verifyToken){
            req.data = verifyToken;
            let userInfo = req.data.data[0];
            usuarioId = userInfo.id;
            return next();
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

route.use(validateUser);

function insertarPedido(pedido){
    var fecha = new Date();
    return sql.query("INSERT INTO pedidos (hora, estado, usuarioId, mediodepagoId) values(?,?,?,?)", 
        {  replacements: [fecha, pedido.estado, usuarioId, pedido.mediodepagoId]}
    );
}

function insertarPedidodetalle(pedidoId, platos){
    let platosArr = [];
    for (let index = 0; index < platos.length; index++) {
        platosArr.push("(" + platos[index] +"," + pedidoId +")");
    }
    var query = "INSERT INTO pedidosdetalle (platosId, pedidosId) VALUES " + platosArr.join(", ");
    return sql.query(query);
}


route.post("/", (req, res) => {
    const pedido = req.body.pedido;
    const platos = req.body.platos;
    const registrado = insertarPedido(pedido).then(result => {
        const pedidodetalle = insertarPedidodetalle(result[0], platos).then(resultDetail =>{
            res.send("Pedido creado correctamente");
        }).catch(error => console.log(error));
    }).catch(error => console.log(error));

})

route.get("/", rolAdmin, (req, res) => {
    sql.query('SELECT * FROM pedidos p inner join pedidosdetalle pd on p.id = pd.pedidosId', 
        { type : sql.QueryTypes.SELECT }
    ).then(result =>{
        res.json(result);
    });
})

route.get("/usuario/:id/pedidos", checkMyInfo, (req, res) => {
    const userId = req.params.id;
    sql.query('SELECT * FROM pedidos p inner join pedidosdetalle pd on p.id = pd.pedidosId WHERE p.usuarioId = 1', 
        {replacements : {id: userId}, type : sql.QueryTypes.SELECT }
    ).then(result =>{
        res.json(result);
    });
})

route.put("/", rolAdmin, (req, res) =>{
    const pedido = req.body;
    sql.query('UPDATE pedidos SET estado = :estado WHERE id = :id', 
        { replacements: {
                id : pedido.id,
                estado : pedido.estado
            } 
        }
    ).then(result =>{
        res.status(200).send(pedido);
    });
});

route.delete("/:id", rolAdmin, (req, res) =>{
    const pedidoId = req.params.id;
    sql.query('DELETE FROM pedidosdetalle WHERE pedidosId = :id', 
        { replacements: {
                id : pedidoId
            } 
        }
    ).then(result =>{
        sql.query('DELETE FROM pedidos WHERE id = :id', 
        { replacements: {
                id : pedidoId
            } 
        }
        ).then(result2 =>{
            res.status(204).send();
        });
    });
});

module.exports = route;