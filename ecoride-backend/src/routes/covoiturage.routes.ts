import express from "express";
import {  getCovoiturageById, getCovoiturageDetail, participerCovoiturage,searchItineraire } from "../controller/covoiturage.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { rechercherCovoiturages } from "../controller/covoiturage.controller";

const router = express.Router();

router.post("/:id/participer", verifyToken, participerCovoiturage);
router.post('/search', searchItineraire);
router.get('/getbyid/:id', getCovoiturageById );
router.post("/rechercher", rechercherCovoiturages);
router.get("/:id", getCovoiturageDetail);


export default router;
