import flash from 'connect-flash'
import MongoDbStore from 'connect-mongo'
import dotenv from 'dotenv'
import express from 'express'
import formidableMiddleware from 'express-formidable'
import session from 'express-session'
import expressWinston from 'express-winston'
import path from 'path'
import winston from 'winston'

import pkg from './package.json'
import routes from './routes'

dotenv.config()

const app = express()

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
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: MongoDbStore.create({
      mongoUrl: process.env.MONGO_DB,
    }),
  }),
)
app.use(flash())
app.use(
  formidableMiddleware({
    uploadDir: path.join(__dirname, 'public/img'),
    keepExtensions: true,
  }),
)

app.locals.blog = {
  title: pkg.name,
  description: pkg.description,
}
app.use((req, res, next) => {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: 'logs/success.logs',
      }),
    ],
  }),
)
routes(app)
app.use(
  expressWinston.errorLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: 'logs/error.log',
      }),
    ],
  }),
)

// eslint-disable-next-line max-params
app.use((err, req, res, next) => {
  req.flash('error', err.message)
  res.redirect('/posts')
})

app.listen(process.env.PORT, () => {
  console.log(`${pkg.name} listening on port ${process.env.PORT}`)
})
