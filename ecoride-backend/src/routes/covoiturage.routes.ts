import express from "express";
import {  getCovoiturageById, participerCovoiturage, searchItineraire } from "../controller/covoiturage.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/:id/participer", verifyToken, participerCovoiturage);
router.post('/search', searchItineraire);
router.get('/getbyid/:id', getCovoiturageById )

export default router;
