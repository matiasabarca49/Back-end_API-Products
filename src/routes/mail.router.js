const express = require('express')
const { Router } = express
const router = new Router()
const { sendMailPurchase, sendMailRecoverPass, changepassword} = require('../controllers/mail.controller')

//Recuperación de Constraseña
router.post("/sendmailpass", sendMailRecoverPass)
router.post("/changepassword", changepassword)
router.post("/send/mail", sendMailPurchase)




module.exports = router