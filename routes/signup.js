const express = require('express')
const router = express.Router()
const checkNotLogin = require('../midllewares/check').checkNotLogin

router.get('/', checkNotLogin, (req, res, next) => {
  res.render('signup page')
})

router.post('/', checkNotLogin, (req, res, next) => {
  res.render('user signup')
})

module.exports = router


