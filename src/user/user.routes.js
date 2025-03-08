import { Router } from "express";
import { check } from "express-validator";
import { getUsers, updateUser, getUserById, deleteUser} from "./user.controller.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { existsUserById} from "../helpers/db-validator.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { updateUserValidator } from "../middlewares/validator.js";

const router = Router();

router.get("/", getUsers);

router.get(
  "/:userId",
  [
    check("userId", "It is not a valid id").isMongoId(),
    check("userId").custom(existsUserById),
    validateFields,
  ],
  getUserById
);


router.put(
  "/:userId",
  [
    validateJWT,
    check("userId", "It is not a valid id").isMongoId(),
    updateUserValidator,
    validateFields,
  ],
  updateUser
);


router.delete(
  "/:userId",
  [
    validateJWT,
    check("userId", "It is not a valid id").isMongoId(),
    check("userId").custom(existsUserById),
    check("password").exists().withMessage('Password is required to confirm deletion'),
    validateFields
  ],
  deleteUser
)
export default router;