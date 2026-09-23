import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

export const generateAccessToken = (userId: number) => {
  return jwt.sign(
    {
      userId,
    },
    jwtSecret,
    {
      expiresIn: "15m",
    }
  );
};