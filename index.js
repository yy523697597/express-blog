require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')
const flash = require('connect-flash')
const routes = require('./routes')
const pkg = require('./package')
const session = require('express-session')
const MongoDbStore = require('connect-mongo')
const formidableMiddleware = require('express-formidable')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    name: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    },
    store: MongoDbStore.create({
      mongoUrl: process.env.MONGO_DB,
      useUnifiedTopology: true
    })
  })
)
app.use(flash())
app.use(
  formidableMiddleware({
    uploadDir: path.join(__dirname, 'public/img'),
    keepExtensions: true
  })
)

app.locals.blog = {
  title: pkg.name,
  description: pkg.description
}
app.use((req, res, next) => {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

routes(app)

app.listen(process.env.PORT, () => {
  console.log(`${pkg.name} listening on port ${process.env.PORT}`)
})
