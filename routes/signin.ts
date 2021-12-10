import { checkNotLogin } from '@middlewares/check'
import { getUserByName } from '@models/users'
import express from 'express'
import sha1 from 'sha1'

const router = express.Router()

router.get('/', checkNotLogin, (req, res, next) => {
  res.render('signin')
})

router.post('/', checkNotLogin, (req, res, next) => {
  const { name, password } = req.fields

  try {
    if (!name) {
      throw new Error('请输入用户名')
    }
    if (!password.length) {
      throw new Error('请输入密码')
    }
    if (password.length < 6) {
      throw new Error('密码错误')
    }
  } catch (error) {
    req.flash('error', (error as Error).message)
    return res.redirect('back')
  }

  getUserByName(name).then((user) => {
    console.log('user ---->', user)
    if (!user) {
      req.flash('error', '用户不存在')
      return res.redirect('back')
    }
    if (sha1(password) !== user.password) {
      req.flash('error', '密码错误')
      return res.redirect('back')
    }
    req.flash('success', '登录成功')
    delete user.password
    req.session.user = user
    res.redirect('/posts')
  })
})

export default router
