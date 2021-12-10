import comments from './comments'
import posts from './posts'
import signin from './signin'
import signout from './signout'
import signup from './signup'

export default function (app) {
  app.get('/', (req, res) => {
    return res.redirect('/signup')
  })

  app.use('/signin', signin)
  app.use('/signup', signup)
  app.use('/signout', signout)
  app.use('/posts', posts)
  app.use('/comments', comments)

  // 404 page
  app.use((req, res) => {
    if (!res.headersSent) {
      res.status(404).render('404')
    }
  })
}
