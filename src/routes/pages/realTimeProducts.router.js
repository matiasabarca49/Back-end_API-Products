const express = require('express')
const { Router } = express
const router = new Router()


function ath(req, res, next){
    if(req.session.rol === "Admin" || req.session.rol === "Premium"){
        next()
    }
    else{
        res.status(401).send({status: "Error", reason: "no autorizado"})
    }
}

router.get( "/", ath, (req,res) => {
    res.render('realTimeProducts', {rol: req.session.rol})
})

module.exports = router