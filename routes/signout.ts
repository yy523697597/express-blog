import { checkLogin } from '@middlewares/check'
import express from 'express'

const router = express.Router()

router.get('/', checkLogin, (req, res, next) => {
  req.session.user = null
  req.flash('success', '登出成功')
  res.redirect('/posts')
})

export default router
