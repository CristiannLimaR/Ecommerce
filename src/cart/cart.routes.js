import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { addToCart, clearCart, deleteProductOfCart, getCart, updateCart } from "./cart.controller";


const router = Router();

router.get("/", getCart);

router.post(
  "/addToCart",
  [
    validateJWT,
    check("productName").exists().withMessage("The product is required"),
    check("quantity").exists().isInt({ min: 1 }).withMessage("The quantity must be a positive integer"),
    validateFields,
  ],
  addToCart
);

router.put(
    "/:productId",
    [
        validateJWT,
        check('quantity').exists().idInt({ min: 1 }).withMessage('The quantity must be a positive integer'),
        validateFields,
    ],
    updateCart
)

router.delete(
    "/:productId",
    [
        validateJWT
    ],
    deleteProductOfCart
)

router.get("/clearCart",validateJWT,clearCart)

export default router;