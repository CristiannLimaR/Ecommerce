import { body } from 'express-validator'
import { validateFields } from './validate-fields.js'
import { existsEmail, isRoleValid } from '../helpers/db-validator.js'

export const registerValidator = [
    body('name', 'The name is required').not().isEmpty(),
    body('surname', 'The surname is required').not().isEmpty(),
    body('email', "You must enter a valid email").isEmail(),
    body('role').optional().custom(isRoleValid),
    body('email').custom(existsEmail),
    body('password', 'Password must be at least 8 characters').isLength({ min: 8 }),
    validateFields
];

export const loginValidator = [
    body('email').optional().isEmail().withMessage("Enter a valid email address"),
    body('username').optional().isString().withMessage("Enter a valid username"),
    body('password', 'Password must be at least 8 characters').isLength({ min: 8 }),
    validateFields
]

export const productValidator = [
    body('name', 'The name is required').notEmpty(),
    body('description', 'description is required').notEmpty(),
    body('description', 'The max length is 50 characters').isLength({max: 200}),
    body('price', 'The price is required').notEmpty(),
    body('price', 'The price must be a positive value').toFloat().isFloat({min: 0}),
    body('stock', 'The stock is required').notEmpty(),
    body('stock', 'The stock must be a positive value').isInt({min: 0}),
    body('sales', 'It is not allowed to add sales directly').not().exists(),
    validateFields
]