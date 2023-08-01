const express = require('express')
const passport = require('passport');
const { getGithubCallback } = require('../../controllers/passport/github.passport.controller');
const { Router } = express
const router = new Router()

router.get('/github',
  passport.authenticate('auth-github', { scope: [ 'user:email' ] }));

router.get('/github/callback', 
  passport.authenticate('auth-github', { failureRedirect: "/api/sessions/fail?error=github" }),
  getGithubCallback);

module.exports = router