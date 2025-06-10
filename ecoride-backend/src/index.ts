import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import { connectDB } from "./config/db";
import avisRoutes from "./routes/avis.routes";
import { connectMongo } from "./config/mongo";
import covoiturage from "./routes/covoiturage.routes";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3010;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/covoiturage", covoiturage)

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/avis", avisRoutes);
// connectMongo(); // en plus de connectDB()