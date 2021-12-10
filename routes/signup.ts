import { checkNotLogin } from '@middlewares/check'
import { create } from '@models/users'
import express from 'express'
import fs from 'fs'
import path from 'path'
import sha1 from 'sha1'

const router = express.Router()

router.get('/', checkNotLogin, (req, res, next) => {
  return res.render('signup')
})

router.post('/', (req, res, next) => {
  const { name, gender, bio, password, rePassword } = req.fields

  console.log(' password, rePassword ---->', password, rePassword)
  const avatarPath = req.files.avatar.path
  const userAvatar = avatarPath.split(path.sep).pop()
  try {
    if (!(name.length > 1 && name.length <= 10)) {
      throw new Error('名字长度请限制在 1-10 个字符')
    }

    if (!['m', 'f', 'x'].includes(gender)) {
      throw new Error('性别只能是 m、f 或 x')
    }
    if (!(bio.length > 1 && bio.length < 30)) {
      throw new Error('个人简介请限制在 1-30 个字符')
    }

    if (!req.files.avatar.name) {
      throw new Error('请上传头像')
    }

    if (password.length < 6) {
      throw new Error('密码长度不能小于6')
    }
    if (password !== rePassword) {
      throw new Error('两次输入的密码不一致')
    }
  } catch (error) {
    // 注册失败，异步删除上传的头像
    fs.unlinkSync(req.files.avatar.path)
    req.flash('error', (error as Error).message)
    return res.redirect('/signup')
  }

  const userPassword = sha1(password)

  const user = {
    name,
    password: userPassword,
    gender,
    bio,
    avatar: userAvatar,
  }

  create(user)
    .then((result) => {
      const user = result.ops[0]
      delete user.password
      req.session.user = user
      req.flash('success', '注册成功')
      res.redirect('/posts')
    })
    .catch((error) => {
      fs.unlink(avatarPath, (err) => {
        req.flash('error', '注册失败')
        if (error.message.match('duplicate key')) {
          req.flash('error', '用户名被占用')
          return res.redirect('/signup')
        }
        next(error)
      })
    })
})

export default router
