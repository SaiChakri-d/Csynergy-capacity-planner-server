import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const app = express();
import userRoutes from "./routes/UserRoutes.js";
import employee from "./routes/employeeRoutes.js";
import project from "./routes/project.js";
import taskManage from "./routes/taskManage.js";
import calculation from "./routes/calculation.js";

// MiddleWare
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Welcome! Csynergy API by Sai Chakri" });
});

app.use("/projects", project);
app.use("/users", userRoutes);
app.use("/team", employee);
app.use("/task", taskManage);
app.use("/calc", calculation);

app.listen(process.env.PORT || 3001, () => {
  console.log(`Welcome to Csynergy API by saichakri! Server runs at port ${process.env.PORT || 3001}`);
});
