const express = require('express')
const router = express.Router()
const checkLogin = require('../midllewares/check').checkLogin

router.get('/', checkLogin, (req, res, next) => {
  res.send('login out')
})

module.exports = router
