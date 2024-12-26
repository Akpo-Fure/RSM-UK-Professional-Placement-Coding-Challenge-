import { User } from '@prisma/client'
import { Omit } from '@prisma/client/runtime/library'

type RequestUser = Omit<User, 'password'>

export { RequestUser }
