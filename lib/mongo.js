const Mongolass = require('mongolass')
const mongolass = new Mongolass()
const moment = require('moment')
const objectIdToTimeStamp = require('objectid-to-timestamp')

mongolass.plugin('addCreatedAt', {
  afterFind: results => {
    results.forEach(result => {
      result.created_at = moment(objectIdToTimeStamp(result.id)).format(
        'YYYY-MM-DD HH:mm'
      )
    })
    return results
  },
  afterFindOne: result => {
    if (result) {
      result.created_at = moment(objectIdToTimeStamp(result._id)).format(
        'YYYY-MM-DD HH:mm'
      )
    }
    return result
  }
})

mongolass.connect(process.env.MONGO_DB)

exports.User = mongolass.model('User', {
  name: {
    type: 'string',
    required: true
  },
  password: {
    type: 'string',
    required: true
  },
  avatar: {
    type: 'string',
    required: true
  },
  gender: {
    type: 'string',
    enum: ['m', 'f', 'x'],
    default: 'x'
  },
  bio: {
    type: 'string',
    required: true
  }
})

exports.User.index({ name: 1 }, { unique: true }).exec()
