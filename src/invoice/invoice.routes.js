import {Router} from "express"
import { validateJWT } from "../middlewares/validate-jwt.js"
import { completePurchase, getPurchases } from "./invoice.controller.js"


const router = Router()

router.post("/checkout", validateJWT, completePurchase)

router.get('/history', validateJWT, getPurchases)

export default router;