const express = require('express')
const { Router } = express
const router = new Router()
const { sendMail, sendMailRecoverPass, changepassword} = require('../controllers/mail.controller')

//Recuperación de Constraseña
router.post("/sendmailpass", sendMailRecoverPass)
router.post("/changepassword", changepassword)




module.exports = router