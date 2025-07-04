import express from "express";
import { createEmploye, suspendUser, getDashboard } from "../controller/admin.controller";

const router = express.Router();

router.get("/dashboard", getDashboard);
router.post("/createemploye", createEmploye);
router.put("/suspend/:id", suspendUser);

export default router;
