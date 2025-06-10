import express from "express";
import { ajouterAvis } from "../controller/avis.controller";

const router = express.Router();

router.post("/", ajouterAvis);

export default router;
