import { Router } from "express";
import { validateFields } from "../middlewares/validate-fields.js";
import {
  deleteProduct,
  getBestSellingProducts,
  getProductById,
  getProducts,
  getProductsByCategory,
  getProductsByName,
  getProductsOutOfStock,
  saveProduct,
  updateProduct,
} from "./product.controller.js";
import { check } from "express-validator";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRole } from "../middlewares/validate-roles.js";
import { productValidator } from "../middlewares/validator.js";

const router = Router();

router.get("/", getProducts);

router.get(
  "/outofstock",
  [validateJWT, hasRole("ADMIN_ROLE"), validateFields],
  getProductsOutOfStock
);

router.get("/bestsellers", getBestSellingProducts);

router.get(
  "/search",
  [
    check("name").notEmpty().withMessage("The name parameter is required"),
    validateFields,
  ],
  getProductsByName
);

router.get(
  "/category/:categoryName",
  [
    check("categoryName")
      .notEmpty()
      .withMessage("The category name parameter is required"),
    validateFields,
  ],
  getProductsByCategory
);
router.get(
  "/:id",
  [check("id", "It is not a valid id").isMongoId(), validateFields],
  getProductById
);

router.post(
  "/",
  [validateJWT, hasRole("ADMIN_ROLE"), productValidator, validateFields],
  saveProduct
);

router.put(
  "/:id",
  [
    validateJWT,
    hasRole("ADMIN_ROLE"),
    check("id", "It is not a valid id").isMongoId(),
    productValidator,
    validateFields,
  ],
  updateProduct
);

router.delete(
  "/:id",
  [
    validateJWT,
    hasRole("ADMIN_ROLE"),
    check("id", "It is not a valid id").isMongoId(),
    validateFields,
  ],
  deleteProduct
);

export default router;
