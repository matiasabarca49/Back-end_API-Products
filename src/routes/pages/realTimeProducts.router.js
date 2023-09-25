const express = require('express')
const { Router } = express
const router = new Router()


function ath(req, res, next){
    if(req.session.rol === "Admin" || req.session.rol === "Premium"){
        next()
    }
    else{
        res.send("Usted no tiene permisos necesarios, consulte con el administrador")
    }
}

router.get( "/", ath, (req,res) => {
    res.render('realTimeProducts')
})

module.exports = router