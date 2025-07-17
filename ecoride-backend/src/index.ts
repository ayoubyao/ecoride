import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import users from "./routes/user.routes";
import { connectDB } from "./config/db";
import avisRoutes from "./routes/avis.routes";
import { connectMongo } from "./config/mongo";
import covoiturage from "./routes/covoiturage.routes";
import covoiturageRoutes from "./routes/covoiturage.routes";
import authRoutes from "./routes/auth.routes";
import employeRoutes from "./routes/employe.routes";
import adminRoutes from "./routes/admin.routes";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3010;

app.use(cors());
app.use(express.json());

app.get('/hello', (req, res) => {
    res.json({ message: 'Hello from backend!' });
});

app.use("/users", users);
app.use("/covoiturage", covoiturage);
app.use("/auth", authRoutes);
app.use("/employe", employeRoutes);
app.use("/admin", adminRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/avis", avisRoutes);
// connectMongo(); // en plus de connectDB()
