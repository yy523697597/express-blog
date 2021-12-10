import { Post } from '@lib/mongo'
import { marked } from 'marked'

Post.plugin('contentToHTML', {
  afterFind: (posts) => {
    return posts.map((post) => {
      post.content = marked(post.content)
      return post
    })
  },
  afterFindOne: (post) => {
    if (post) {
      post.content = marked(post.content)
    }
    return post
  },
})

export const createPost = (post) => {
  return Post.create(post).exec()
}

export const getPostById = (postId) => {
  return Post.findOne({ _id: postId }).populate({ path: 'author', model: 'User' }).addCreatedAt().contentToHTML().exec()
}

export const getPosts = (author) => {
  const query = {} as any
  if (author) {
    query.author = author
  }

  return Post.find(query)
    .populate({ path: 'author', model: 'User' })
    .sort({ _id: -1 })
    .addCreatedAt()
    .contentToHTML()
    .exec()
}

export const increasePv = (postId) => {
  return Post.update({ _id: postId }, { $inc: { pv: 1 } }).exec()
}

export const getRawPostById = (postId) => {
  return Post.findOne({ _id: postId }).populate({ path: 'author', model: 'User' }).exec()
}

export const updatePostById = (postId, data) => {
  return Post.update({ _id: postId }, { $set: data }).exec()
}

export const deletePostById = (postId) => {
  return Post.deleteOne({ _id: postId }).exec()
}
