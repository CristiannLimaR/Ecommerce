import { Router } from "express";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRole } from "../middlewares/validate-roles.js";
import {
  completePurchase,
  getInvoicesByClient,
  getPurchases,
  updateInvoices,
} from "./invoice.controller.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { check } from "express-validator";
import { invoiceValidator } from "../middlewares/validator.js";

const router = Router();

router.post("/checkout", validateJWT, completePurchase);

router.get("/history", validateJWT, getPurchases);

router.get(
  "/:clientId",
  [
    validateJWT,
    hasRole("ADMIN_ROLE"),
    check("clientId", "It is not a valid id").isMongoId(),
    validateFields,
  ],
  getInvoicesByClient
);

router.put(
  "/:invoiceId",
  [validateJWT, hasRole("ADMIN_ROLE"), invoiceValidator],
  updateInvoices
);

export default router;
