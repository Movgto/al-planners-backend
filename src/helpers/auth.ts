import { IUser } from '../models/User'
import { genSalt, hash } from 'bcrypt'
import {sign} from 'jsonwebtoken'

export const generateToken = () => {
  return Math.round(Math.random() * 999999).toString().padStart(6, '0')
}

export const hashPassword = async (psw: string) => {
  const salt = await genSalt(10)

  const password = await hash(psw, salt)

  return password
}

export type UserDataJWT = {
  id: IUser['id']
}

export const generateJWT = (user: UserDataJWT) => {
  const jwt = sign(user, process.env.JWT_SECRET!,
    {expiresIn: '180d'}
  )

  return jwt
}