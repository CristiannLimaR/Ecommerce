import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import {
  deleteCategory,
  getCategories,
  getCategoryById,
  saveCategory,
  updateCategory,
} from "./category.controller.js";
import { hasRole } from "../middlewares/validate-roles.js";

const router = Router();

router.get("/", getCategories);

router.get(
  "/:categoryId",
  [
    validateJWT,
    hasRole("ADMIN_ROLE"),
    check("categoryId", "It is not a valid id").isMongoId(),
    validateFields,
  ],
  getCategoryById
);

router.post(
  "/",
  [
    validateJWT,
    hasRole("ADMIN_ROLE"),
    check("name").notEmpty().withMessage("The name is required"),
    validateFields,
  ],
  saveCategory
);

router.put(
  "/:categoryId",
  [
    validateJWT,
    hasRole("ADMIN_ROLE"),
    check("name").notEmpty().withMessage("The name is required"),
    check("categoryId", "It is not a valid id").isMongoId(),
    validateFields,
  ],
  updateCategory
);

router.delete(
  "/:categoryId",
  [
    validateJWT,
    hasRole("ADMIN_ROLE"),
    check("categoryId", "It is not a valid id").isMongoId(),
    validateFields,
  ],
  deleteCategory
);

export default router;