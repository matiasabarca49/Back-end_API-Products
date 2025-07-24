const express = require('express')
const { Router } = express
const router = new Router()
//middleware
const { checkPermAdminAndPremium } = require('../../middlewares/permissions.middleware.js')

router.get( "/", checkPermAdminAndPremium, (req,res) => {
    res.render('realTimeProducts', {rol: req.session.rol})
})

module.exports = router