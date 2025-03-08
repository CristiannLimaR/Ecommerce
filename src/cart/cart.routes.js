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
import { addToCartValidator, itemValidator } from "../middlewares/validator.js";

const router = Router();

router.get("/", validateJWT, getCart);

router.post(
  "/addToCart/:productId",
  [
    validateJWT,
    addToCartValidator,
    validateFields,
  ],
  addToCart
);

router.put("/", [validateJWT, itemValidator, validateFields], updateCart);

router.delete(
  "/:productId",
  [validateJWT, check("productId", "It is not a valid id").isMongoId()],
  deleteProductOfCart
);

router.post("/clearCart", validateJWT, clearCart);

export default router;
