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

router.get("/", [validateJWT, hasRole("ADMIN_ROLE")], getCategories);

router.get(
  "/:id",
  [
    validateJWT,
    hasRole("ADMIN_ROLE"),
    check("id", "No es un id valido").isMongoId(),
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
  "/:id",
  [
    validateJWT,
    hasRole("ADMIN_ROLE"),
    check("name").notEmpty().withMessage("The name is required"),
    check("id", "No es un id valido").isMongoId(),
    validateFields,
  ],
  updateCategory
);

router.delete(
  "/:id",
  [
    validateJWT,
    hasRole("ADMIN_ROLE"),
    check("id", "No es un id valido").isMongoId(),
    validateFields,
  ],
  deleteCategory
);

export default router;