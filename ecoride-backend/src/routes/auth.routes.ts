import express from "express";
import { loginUser } from "../controller/auth.controller"; 

const router = express.Router();

router.post("/login", loginUser); // ✅ POST /api/auth/login

export default router;
