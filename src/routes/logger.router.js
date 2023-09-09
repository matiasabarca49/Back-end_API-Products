const express = require('express')
const { Router } = express
const router = new Router()

router.get("/", (req, res) =>{
    req.logger.fatal(`Peticion ${req.method} en "${"http://"+req.headers.host + "/loggerTest" +req.url}" a las ${new Date().toLocaleTimeString()} el ${new Date().toLocaleDateString()}`)
    req.logger.error(`Peticion ${req.method} en "${"http://"+req.headers.host + "/loggerTest" +req.url}" a las ${new Date().toLocaleTimeString()} el ${new Date().toLocaleDateString()}`)
    req.logger.info(`Peticion ${req.method} en "${"http://"+req.headers.host + "/loggerTest" +req.url}" a las ${new Date().toLocaleTimeString()} el ${new Date().toLocaleDateString()}`)
    req.logger.http(`Peticion ${req.method} en "${"http://"+req.headers.host + "/loggerTest" +req.url}" a las ${new Date().toLocaleTimeString()} el ${new Date().toLocaleDateString()}`)
    req.logger.debug(`Peticion ${req.method} en "${"http://"+req.headers.host + "/loggerTest" +req.url}" a las ${new Date().toLocaleTimeString()} el ${new Date().toLocaleDateString()}`)
    res.send("Test de Logger con Winston")
})

module.exports= router