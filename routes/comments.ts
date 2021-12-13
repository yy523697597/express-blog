import { checkLogin } from '@middlewares/check'
import { createComment, delCommentById, getCommentById } from '@models/comment'
import express from 'express'

const router = express.Router()

router.post('/', checkLogin, (req, res, next) => {
  const author = req.session.user._id
  const { postId, content } = req.fields

  try {
    if (!postId || !content) {
      throw new Error('请填写内容')
    }
  } catch (error) {
    req.flash('error', (error as Error).message)
    return res.redirect('back')
  }

  const comment = {
    postId,
    content,
    author,
  }

  createComment(comment)
    .then(() => {
      req.flash('success', '留言成功')
      res.redirect('back')
    })
    .catch(next)
})

router.get('/:commentId/remove', checkLogin, (req, res, next) => {
  const commentId = req.params.commentId
  const author = req.session.user._id

  getCommentById(commentId).then((comment) => {
    if (!comment) {
      throw new Error('留言不存在')
    }

    if (comment.author.toString() !== author.toString()) {
      throw new Error('无权限操作')
    }
    delCommentById(commentId)
      .then(() => {
        req.flash('success', '删除留言成功')
        res.redirect('back')
      })
      .catch(next)
  })
})

export default router
