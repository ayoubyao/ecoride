import { Request, Response } from "express";
import Avis from "../models/avis.model";

export const ajouterAvis = async (req: Request, res: Response) => {
  try {
    const avis = new Avis(req.body);
    await avis.save();
    res.status(201).json(avis);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'enregistrement", error });
  }
};
