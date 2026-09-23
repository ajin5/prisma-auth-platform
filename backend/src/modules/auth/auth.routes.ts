import { Router } from "express";

import { validate } from "../../middleware/validate.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

import {
  loginController,
  signupController,
  meController,
} from "./auth.controller.js";
import { loginSchema,signupSchema } from "./auth.schema.js";


const router = Router();

router.post("/signup",validate(signupSchema), signupController);

router.post("/login", validate(loginSchema), loginController);
router.get("/me", requireAuth, meController);
// router.get("/me", requireAuth, (_req, res) => {
//   return res.status(200).json({
//     message: "Protected route accessed",
//   });
// });

export default router;