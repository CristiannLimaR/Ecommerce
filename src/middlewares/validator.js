import { body, param } from 'express-validator'
import { validateFields } from './validate-fields.js'
import { existsEmail, existUsername, isRoleValid } from '../helpers/db-validator.js'

export const registerValidator = [
    body('name', 'The name is required').not().isEmpty(),
    body('surname', 'The surname is required').not().isEmpty(),
    body('email', "You must enter a valid email").isEmail(),
    body('role').optional().custom(isRoleValid),
    body('email').custom(existsEmail),
    body('username').custom(existUsername),
    body('password', 'Password must be at least 8 characters').isLength({ min: 8 }),
    body('phone').isNumeric().isLength({min: 8, max: 8}).withMessage('The phone must have a 8 characters and a numeric character'),
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
    body('description', 'The max length is 50 characters').isLength({max: 50}),
    body('price', 'The price is required').notEmpty(),
    body('price', 'The price must be a positive value').toFloat().isFloat({min: 0}),
    body('stock', 'The stock is required').notEmpty(),
    body('stock', 'The stock must be a positive value').isInt({min: 0}),
    body('sales', 'It is not allowed to add sales directly').not().exists(),
    validateFields
]


export const itemValidator = [
    body("items").isArray().withMessage("Items must be an array"),
    body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
    body("items.*.product").isMongoId().withMessage("It is not a valid id"),
    body("items.*.total").not().exists().withMessage('It is not allowed change total directly'),
    body("items.*.price").not().exists().withMessage('It is not allowed change price directly'),
    validateFields
]

export const invoiceValidator = [
    body('totalAmount').not().exists().withMessage('It is not allowed change totalAmount directly'),
    body('client').not().exists().withMessage('Changing the invoice client is not allowed.'),
    param('invoiceId', 'It is not a valid id').isMongoId(),
    itemValidator,
    validateFields
]

export const updateUserValidator = [
    body("email").custom(existsEmail),
    body("username").custom(existUsername),
    body("currentPassword", "The old password is required").optional().notEmpty(),
    body("password", "Password must be at least 8 characters").optional().isLength({ min: 8 }),
    body("role").optional().custom(isRoleValid),
    validateFields,
  ];