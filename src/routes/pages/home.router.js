const express = require('express')
const { Router } = express
const router = new Router()

//middleware
const {checkLogin} = require("../../middlewares/sessions.middleware.js")
const { checkPermAdmin } = require('../../middlewares/permissions.middleware.js')
//Controller
const { getUsersPageController } = require('../../controllers/pages/users.pages.controller.js')

//routes
router.get("/", checkLogin, checkPermAdmin, getUsersPageController)

module.exports = router

