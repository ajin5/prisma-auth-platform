import { Router } from "express";

import { validate } from "../../middleware/validate.middleware.js";
import { loginController,signupController } from "./auth.controller.js";
import { loginSchema,signupSchema } from "./auth.schema.js";

const router = Router();

router.post("/signup",validate(signupSchema), signupController);
router.post("/login", validate(loginSchema), loginController);

export default router;