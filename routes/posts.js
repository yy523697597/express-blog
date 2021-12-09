const express = require('express')
const router = express.Router()

const checkLogin = require('../midllewares/check').checkLogin

router.get('/', (req, res, next) => {
  res.send('homepage')
})

router.post('/create', checkLogin, (req, res, next) => {
  res.send('create post')
})

router.get('/create', checkLogin, (req, res, next) => {
  res.send('create post list')
})

router.get('/:postId', (req, res, next) => {
  res.send('post detail')
})

router.post('/:postId/edit', checkLogin, (req, res, next) => {
  res.send('edit post')
})

router.get('/:postId/remove', checkLogin, (req, res, next) => {
  res.send('remove post')
})

module.exports = router
