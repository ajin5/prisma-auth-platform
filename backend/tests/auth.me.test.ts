import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import bcrypt from "bcrypt";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { generateAccessToken } from "../src/utils/token.js";

describe("GET /api/auth/me", () => {
  beforeEach(async () => {
    if (!process.env.DATABASE_URL?.includes("prisma_auth_test")) {
      throw new Error("Tests must run against prisma_auth_test");
    }

    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return the authenticated user", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);

    const user = await prisma.user.create({
      data: {
        name: "Me Test User",
        email: "me-test@example.com",
        password: hashedPassword,
      },
    });

    const accessToken = generateAccessToken(user.id);

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.user.id).toBe(user.id);
    expect(response.body.user.name).toBe("Me Test User");
    expect(response.body.user.email).toBe("me-test@example.com");

    expect(response.body.user.password).toBeUndefined();
  });

  it("should return 401 when authorization header is missing", async () => {
    const response = await request(app)
      .get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication required");
  });

  it("should return 401 for an invalid token", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
  });

  it("should return 401 for an invalid authorization scheme", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Basic something");

    expect(response.status).toBe(401);
  });
});

// import request from "supertest";
// import { describe, expect, it } from "vitest";

// import app from "../src/app.js";
// import { generateAccessToken } from "../src/utils/token.js";

// describe("GET /api/auth/me", () => {
//   it("should allow access with a valid token", async () => {
//     const accessToken = generateAccessToken(1);

//     const response = await request(app)
//       .get("/api/auth/me")
//       .set("Authorization", `Bearer ${accessToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe("Protected route accessed");
//   });

//   it("should return 401 when authorization header is missing", async () => {
//     const response = await request(app)
//       .get("/api/auth/me");

//     expect(response.status).toBe(401);
//     expect(response.body.message).toBe("Authentication required");
//   });

//   it("should return 401 for an invalid token", async () => {
//     const response = await request(app)
//       .get("/api/auth/me")
//       .set("Authorization", "Bearer invalid-token");

//     expect(response.status).toBe(401);
//     expect(response.body.message).toBe("Invalid or expired token");
//   });

//   it("should return 401 for an invalid authorization header", async () => {
//     const response = await request(app)
//       .get("/api/auth/me")
//       .set("Authorization", "InvalidScheme some-token");

//     expect(response.status).toBe(401);
//     expect(response.body.message).toBe("Invalid authorization header");
//   });
// });