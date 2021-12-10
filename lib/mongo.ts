import moment from 'moment'
import Mongolass from 'mongolass'
import objectIdToTimeStamp from 'objectid-to-timestamp'

const mongolass = new Mongolass()

mongolass.plugin('addCreatedAt', {
  afterFind: (results) => {
    results.forEach((result) => {
      result.created_at = moment(objectIdToTimeStamp(result.id)).format('YYYY-MM-DD HH:mm')
    })
    return results
  },
  afterFindOne: (result) => {
    if (result) {
      result.created_at = moment(objectIdToTimeStamp(result._id)).format('YYYY-MM-DD HH:mm')
    }
    return result
  },
})

mongolass.connect(process.env.MONGO_DB)

export const User = mongolass.model('User', {
  name: {
    type: 'string',
    required: true,
  },
  password: {
    type: 'string',
    required: true,
  },
  avatar: {
    type: 'string',
    required: true,
  },
  gender: {
    type: 'string',
    enum: ['m', 'f', 'x'],
    default: 'x',
  },
  bio: {
    type: 'string',
    required: true,
  },
})

User.index({ name: 1 }, { unique: true }).exec()

export const Post = mongolass.model('Post', {
  author: {
    type: Mongolass.Types.ObjectId,
    required: true,
  },
  title: {
    type: 'string',
    required: true,
  },
  content: {
    required: true,
    type: 'string',
  },
  pv: {
    type: 'number',
    default: 0,
  },
})

Post.index({ author: 1, _id: -1 }).exec()
