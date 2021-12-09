const express = require('express')
const router = express.Router()
const checkNotLogin = require('../middlewares/check').checkNotLogin

router.get('/', checkNotLogin, (req, res, next) => {
  res.send('login page')
})

router.post('/', checkNotLogin, (req, res, next) => {
  res.send('user login')
})

module.exports = router
