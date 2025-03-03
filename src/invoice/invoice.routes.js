import { Router } from "express";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRole } from "../middlewares/validate-roles.js";
import { completePurchase, getProductsByClient, getPurchases, updateInvoices } from "./invoice.controller.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { check } from "express-validator";

const router = Router();

router.post("/checkout", validateJWT, completePurchase);

router.get("/history", validateJWT, getPurchases);

router.get(
    "/:id",
   [
    validateJWT,
    hasRole("ADMIN_ROLE"),
    validateFields
   ],
   getProductsByClient
)

router.put(
    "/:id",
    [
        validateJWT,
        hasRole("ADMIN_ROLE"),
        check('totalAmound').not().exists().withMessage('It is not allowed change total directly'),
        check('client').not().exists().withMessage('Changing the invoice client is not allowed.')
    ],
    updateInvoices
);

export default router;
