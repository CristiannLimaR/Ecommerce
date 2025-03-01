import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import {
  addToCart,
  clearCart,
  deleteProductOfCart,
  getCart,
  updateCart,
} from "./cart.controller.js";

const router = Router();

router.get("/", validateJWT, getCart);

router.post(
  "/addToCart/:productId",
  [
    validateJWT,
    check("quantity")
      .exists()
      .isInt({ min: 1 })
      .withMessage("The quantity must be a positive integer"),
    validateFields,
  ],
  addToCart
);

router.put(
  "/",
  [
    validateJWT,
    check("items").isArray().withMessage("Items must be an array"),
    check("items.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer")
      .optional({ checkFalsy: true }),
    validateFields,
  ],
  updateCart
);

router.delete("/:productId", [validateJWT], deleteProductOfCart);

router.get("/clearCart", validateJWT, clearCart);

export default router;
