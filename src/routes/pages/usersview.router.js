const express = require('express')
const { Router } = express
const router = new Router()
//middleware
const { checkPermAdmin } = require('../../middlewares/permissions.middleware.js')

router.get("/", checkPermAdmin ,async (req, res)=>{
    res.render("users")
})



module.exports = router