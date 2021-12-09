const express = require('express')
const router = express.Router()
const checkLogin = require('../midllewares/check').checkLogin

router.post('/', checkLogin, (req, res, next) => {
  res.send('create comment')
})

router.get('/:commentId/remove', checkLogin, (req, res, next) => {
  res.send('remove comment')
})

module.exports = router
