import express from "express";
import {  participerCovoiturage, searchItineraire } from "../controller/covoiturage.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/:id/participer", verifyToken, participerCovoiturage);
router.post('/search', searchItineraire);

export default router;
