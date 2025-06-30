import express from "express";
import {  annulerCovoiturage, demarrerCovoiturage, getCovoiturageById, getCovoiturageDetail, getHistoriqueCovoiturages, participerCovoiturage,searchItineraire, terminerCovoiturage } from "../controller/covoiturage.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { rechercherCovoiturages } from "../controller/covoiturage.controller";

const router = express.Router();

router.post("/:id/participer", verifyToken, participerCovoiturage);
router.post('/search', searchItineraire);
router.get('/getbyid/:id', getCovoiturageById );
router.post("/rechercher", rechercherCovoiturages);
router.get("/:id", getCovoiturageDetail);
router.post("/:id/annuler", annulerCovoiturage);
router.get("/:id/searchcovoiturage", getHistoriqueCovoiturages);
router.put("/:id/demarrer", demarrerCovoiturage);
router.put("/:id/terminer", terminerCovoiturage);


export default router;
