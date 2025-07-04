import { Request, Response } from "express";
import { db } from "../config/db";

// Valider ou refuser un avis
export const validerAvis = async (req: Request, res: Response) => {
  const { avis_id, statut } = req.body;
  if (!avis_id || !["valide", "refuse"].includes(statut)) {
     res.status(400).json({ message: "Paramètres invalides." });
  }

  try {
    await db.query("UPDATE avis SET statut = ? WHERE avis_id = ?", [statut, avis_id]);
    res.status(200).json({ message: "Avis mis à jour." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Liste des avis en attente
export const getAvisEnAttente = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT a.avis_id, a.commentaire, a.note, u.pseudo AS auteur, u.photo
      FROM avis a
      JOIN utilisateur u ON u.utilisateur_id = a.utilisateur_id
      WHERE a.statut IS NULL OR a.statut = ''
    `);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Covoiturages à problème
export const getCovoituragesProblemes = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.covoiturage_id, 
        c.date_depart, c.date_arrivee, 
        c.lieu_depart, c.lieu_arrivee,
        u1.pseudo AS chauffeur_pseudo, u1.email AS chauffeur_email,
        u2.pseudo AS passager_pseudo, u2.email AS passager_email,
        a.commentaire
      FROM avis a
      JOIN utilisateur u1 ON u1.utilisateur_id = (
        SELECT c.utilisateur_id FROM covoiturage c WHERE c.covoiturage_id = a.covoiturage_id
      )
      JOIN utilisateur_covoiturage uc ON uc.covoiturage_id = a.covoiturage_id
      JOIN utilisateur u2 ON u2.utilisateur_id = uc.utilisateur_id
      JOIN covoiturage c ON c.covoiturage_id = a.covoiturage_id
      WHERE a.note <= 2
    `);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
