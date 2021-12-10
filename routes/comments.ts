import { checkLogin } from '@middlewares/check'
import express from 'express'

const router = express.Router()

router.post('/', checkLogin, (req, res, next) => {
  res.send('create comment')
})

router.get('/:commentId/remove', checkLogin, (req, res, next) => {
  res.send('remove comment')
})

export default router
