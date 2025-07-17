import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { config } from './config.js';

dotenv.config();

export const db = mysql.createPool({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  port: config.DB_PORT
});

export const connectDB = async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Connected to MySQL");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};
