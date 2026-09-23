import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authorization header",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (
      typeof decoded === "string" ||
      typeof decoded.userId !== "number"
    ) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};


// import type { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";

// const jwtSecret = process.env.JWT_SECRET;

// if (!jwtSecret) {
//   throw new Error("JWT_SECRET is not defined");
// }

// export const requireAuth = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({
//       message: "Authentication required",
//     });
//   }

//   const [scheme, token] = authHeader.split(" ");

//   if (scheme !== "Bearer" || !token) {
//     return res.status(401).json({
//       message: "Invalid authorization header",
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, jwtSecret);


//     next();
//   } catch {
//     return res.status(401).json({
//       message: "Invalid or expired token",
//     });
//   }
// };