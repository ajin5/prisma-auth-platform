import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import bcrypt from "bcrypt";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

describe("POST /api/auth/signup", () => {
  beforeEach(async () => {
    if (!process.env.DATABASE_URL?.includes("prisma_auth_test")) {
      throw new Error("Tests must run against prisma_auth_test");
    }

    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new user and return 201", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: "signup-test@example.com",
        password: "password123",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
    expect(response.body.user.email).toBe("signup-test@example.com");
  });

  it("should return 400 for invalid email", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: "not-an-email",
        password: "password123",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });

  it("should return 400 for short password", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: "short-password@example.com",
        password: "123",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });

  it("should return 409 when email already exists", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({
        name: "First User",
        email: "duplicate@example.com",
        password: "password123",
      });

    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Second User",
        email: "duplicate@example.com",
        password: "password123",
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Email already exists");
  });

  it("should store the password as a hash", async () => {
    const plainPassword = "password123";

    await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Hash Test User",
        email: "hash-test@example.com",
        password: plainPassword,
      });

    const user = await prisma.user.findUnique({
      where: {
        email: "hash-test@example.com",
      },
    });

    expect(user).not.toBeNull();
    expect(user?.password).not.toBe(plainPassword);

    const passwordMatches = await bcrypt.compare(
      plainPassword,
      user!.password
    );

    expect(passwordMatches).toBe(true);
  });
});