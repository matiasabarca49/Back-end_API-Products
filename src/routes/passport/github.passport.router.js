const express = require('express')
const passport = require('passport')
const { Router } = express
const router = new Router()

router.get('/github',
  passport.authenticate('auth-github', { scope: [ 'user:email' ] }));

router.get('/github/callback', 
  passport.authenticate('auth-github', { failureRedirect: "/api/sessions/fail?error=github" }),
  function(req, res) {
    const userFound = req.user
    req.session.user = userFound.name || " "
    req.session.lastName = userFound.lastName || " "
    req.session.email = userFound.email
    req.session.age = userFound.age || " "
    req.session.rol = userFound.rol
    res.redirect("/products")
  });

module.exports = router