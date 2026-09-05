import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import bcrypt from "bcrypt";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    if (!process.env.DATABASE_URL?.includes("prisma_auth_test")) {
      throw new Error("Tests must run against prisma_auth_test");
    }

    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash("password123", 10);

    await prisma.user.create({
      data: {
        name: "Login Test User",
        email: "login-test@example.com",
        password: hashedPassword,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should login successfully with correct credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login-test@example.com",
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.user.email).toBe("login-test@example.com");
    expect(response.body.user.password).toBeUndefined();
  });

  it("should return 401 for incorrect password", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login-test@example.com",
        password: "wrongpassword",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password");
  });

  it("should return 401 when user does not exist", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "missing@example.com",
        password: "password123",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password");
  });

  it("should return 400 for invalid email", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "not-an-email",
        password: "password123",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });

  it("should return 400 for short password", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login-test@example.com",
        password: "123",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });
});