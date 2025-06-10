import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

export const connectMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connecté à MongoDB");
  } catch (error) {
    console.error("❌ Erreur connexion MongoDB :", error);
  }
};
