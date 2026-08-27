import express from "express";

const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});