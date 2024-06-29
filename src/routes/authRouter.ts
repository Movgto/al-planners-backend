import {Router} from 'express'
import { body } from 'express-validator'
import inputValidation from '../middleware/inputValidation'
import AuthController from '../controllers/AuthController'
import { auhtenticateAdmin } from '../middleware/auth'

const router = Router()

router.post('/admins/login',
  body('email').isEmail().withMessage('Email is not valid'),
  body('password').notEmpty().withMessage('Password cannot be empty'),
  inputValidation,
  AuthController.adminLogin
)

router.post('/admins/signup',
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('email').isEmail().withMessage('Email is not valid'),
  body('password').notEmpty().withMessage('Password cannot be empty'),
  body('password_confirmation').custom((val, {req}) => {
    if (req.body.password === val) {
      return true
    }

    throw new Error('Las contraseñas no coinciden')
  }),
  inputValidation,
  AuthController.adminSignUp
)

router.get('/admins',
  auhtenticateAdmin,
  AuthController.getAdmin
)

export default router