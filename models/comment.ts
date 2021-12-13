import { Comment } from '@lib/mongo'
import { marked } from 'marked'

Comment.plugin('contentToHTML', {
  afterFind: (comments) => {
    return comments.map((comment) => {
      comment.content = marked(comment.content)
      return comment
    })
  },
})

export const createComment = (comment) => {
  return Comment.create(comment).exec()
}

export const getCommentById = (commentId) => {
  return Comment.findOne({ _id: commentId }).exec()
}

export const getComments = (postId) => {
  return Comment.find({ postId })
    .populate({ path: 'author', model: 'User' })
    .sort({ _id: -1 })
    .addCreatedAt()
    .contentToHTML()
    .exec()
}

export const getCommentsCount = (postId) => {
  return Comment.count({ postId }).exec()
}

export const delCommentById = (commentId) => {
  return Comment.deleteOne({ _id: commentId }).exec()
}

export const delCommentsByPostId = (postId) => {
  return Comment.deleteMany({ postId }).exec()
}
