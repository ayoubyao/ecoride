import { Router } from "express";
import { validerAvis, getAvisEnAttente, getCovoituragesProblemes } from "../controller/employe.controller";

const router = Router();

router.get("/avis", getAvisEnAttente);
router.post("/avis/valider", validerAvis);
router.get("/problemes", getCovoituragesProblemes);

export default router;
