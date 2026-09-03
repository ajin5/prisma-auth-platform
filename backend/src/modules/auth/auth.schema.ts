import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),

  email: z.string().trim().email("Please provide a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type SignupInput = z.infer<typeof signupSchema>;