import { Router } from "express";

import { validate } from "../../middleware/validate.middleware.js";
import { signupController } from "./auth.controller.js";
import { signupSchema } from "./auth.schema.js";

const router = Router();

router.post("/signup",validate(signupSchema), signupController);

export default router;