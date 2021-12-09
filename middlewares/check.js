module.exports = {
  checkLogin: (req, res, next) => {
    if (!req.session.user) {
      req.flash('error', '未登录')
      return res.redirect('/signin')
    }
    next()
  },
  checkNotLogin: (req, res, next) => {
    if (req.session.user) {
      req.flash('error', '已登录')
      return res.redirect('/posts') // 返回之前的页面
    }
    next()
  }
}
