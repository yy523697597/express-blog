import { User } from '@lib/mongo'

export const create = (user) => {
  return User.create(user).exec()
}
export const getUserByName = (name) => {
  return User.findOne({ name })
    .addCreatedAt()
    .exec()
}
