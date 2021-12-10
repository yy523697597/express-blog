import express from 'express'
const router = express.Router()

router.get('/:name', (req, res) => {
  res.render('users', { name: req.params.name })
})

export default router
