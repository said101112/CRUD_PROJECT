import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import projectRoutes from "./routes/projectRoutes.js";

dotenv.config();

const app = express(); // ✅ IMPORTANT : AVANT TOUT

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/projects", projectRoutes);

// Swagger config
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ENSAT Project API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // ⚠️ IMPORTANT
};

const specs = swaggerJsdoc(options);

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is working 🚀" });
});

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
