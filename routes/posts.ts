import { checkLogin } from '@middlewares/check'
import {
  createPost,
  deletePostById,
  getPostById,
  getPosts,
  getRawPostById,
  increasePv,
  updatePostById,
} from '@models/posts'
import express from 'express'

const router = express.Router()

router.get('/', (req, res, next) => {
  const author = req.query.author
  getPosts(author)
    .then((posts) => {
      res.render('posts', { posts })
    })
    .catch(next)
})

router.post('/create', checkLogin, (req, res, next) => {
  const { title, content } = req.fields
  const author = req.session.user._id

  try {
    if (!author) {
      req.flash('error', '请登录')
      return res.redirect('/signin')
    }
    if (!title) {
      throw new Error('请填写标题')
    }

    if (!content) {
      throw new Error('请填写内容')
    }

    createPost({
      title,
      content,
      author,
    }).then((result) => {
      req.flash('success', '发表成功')
      res.redirect(`/posts/${result.ops[0]._id}`)
    })
  } catch (error) {
    req.flash('error', (error as Error).message)
    return res.redirect('back')
  }
})

router.get('/create', checkLogin, (req, res, next) => {
  res.render('create')
})

router.get('/:postId', (req, res, next) => {
  const postId = req.params.postId
  Promise.all([getPostById(postId), increasePv(postId)])
    .then((result) => {
      const post = result[0]
      if (!post) {
        throw new Error('文章不存在')
      }
      res.render('postDetail', {
        post,
      })
    })
    .catch(next)
})

router.get('/:postId/edit', checkLogin, (req, res, next) => {
  const postId: string = req.params.postId
  const author: string = req.session.user._id

  getRawPostById(postId)
    .then((post) => {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (author.toString() !== post.author._id.toString()) {
        throw new Error('无权限修改')
      }

      res.render('edit', { post })
    })
    .catch(next)
})

router.post('/:postId/edit', checkLogin, (req, res, next) => {
  const postId: string = req.params.postId
  const author: string = req.session.user._id
  const { title, content } = req.fields

  try {
    if (!title) {
      throw new Error('文章标题不能为空')
    }
    if (!content) {
      throw new Error('文章内容不能为空')
    }
  } catch (error) {
    req.flash('error', (error as Error).message)
    return res.redirect('back')
  }

  getRawPostById(postId)
    .then((post) => {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('没有权限')
      }

      updatePostById(postId, { title, content })
        .then((post) => {
          req.flash('success', '更新文章成功')
          return res.redirect(`/posts/${postId}`)
        })
        .catch(next)
    })
    .catch(next)
})

router.get('/:postId/remove', checkLogin, (req, res, next) => {
  const postId = req.params.postId
  const author = req.session.user._id

  getRawPostById(postId)
    .then((post) => {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('权限不足，无法删除')
      }
      deletePostById(postId)
        .then(() => {
          req.flash('success', '删除成功')
          return res.redirect('/posts')
        })
        .catch(next)
    })
    .catch(next)
})

export default router
