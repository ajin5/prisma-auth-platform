import type { Request, Response } from "express";

import {
  loginService,
  signupService,
} from "./auth.service.js";

import type {
  LoginInput,
  SignupInput,
} from "./auth.schema.js";

export const signupController = async (req: Request, res: Response) => {
  try {
    const user = await signupService(req.body as SignupInput);

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Email already exists") {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const user = await loginService(req.body as LoginInput);

    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Invalid email or password"
    ) {
      return res.status(401).json({
        message: error.message,
      });
    }

    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



// import type { Request, Response } from "express";

// import { signupService } from "./auth.service.js";
// import type { SignupInput } from "./auth.schema.js";

// export const signupController = async (req: Request, res: Response) => {
//   try {
//     const user = await signupService(req.body as SignupInput);

//     return res.status(201).json({
//       message: "User created successfully",
//       user,
//     });
//   } catch (error) {
//     if (error instanceof Error && error.message === "Email already exists") {
//       return res.status(409).json({
//         message: error.message,
//       });
//     }

//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };



// import type { Request, Response } from "express";

// import { signupService } from "./auth.service.js";
// import { signupSchema } from "./auth.schema.js";

// export const signupController = async (req: Request, res: Response) => {
//   const result = signupSchema.safeParse(req.body);

//   if (!result.success) {
//     return res.status(400).json({
//       message: "Validation failed",
//       errors: result.error.flatten(),
//     });
//   }

//   try {
//     const user = await signupService(result.data);

//     return res.status(201).json({
//       message: "User created successfully",
//       user,
//     });
//   } catch (error) {
//     if (error instanceof Error && error.message === "Email already exists") {
//       return res.status(409).json({
//         message: error.message,
//       });
//     }

//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };