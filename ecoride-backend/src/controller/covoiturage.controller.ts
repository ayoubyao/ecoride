import { Request, Response } from "express";
import { db } from "../config/db";

/**
 * Participer à un covoiturage si :
 * - l'utilisateur est connecté
 * - il reste des places
 * - il a assez de crédits
 */
export const participerCovoiturage = async (req: Request, res: Response) => {
  const covoiturageId = parseInt(req.params.id);
  const utilisateurId = req.body.utilisateurId; // À sécuriser avec JWT plus tard
  const creditRequis = 1;

  if (!utilisateurId || !covoiturageId) {
    res.status(400).json({ message: "Utilisateur ou trajet manquant" });
  }

  try {
    // 1. Vérifier que le covoiturage existe et a des places
    const [trajets] = await db.query("SELECT nb_place FROM covoiturage WHERE covoiturage_id = ?", [covoiturageId]);
    if (!Array.isArray(trajets) || trajets.length === 0) {
      res.status(404).json({ message: "Covoiturage introuvable" });
    } else {
      const { nb_place } = trajets[0] as any;
      if (nb_place <= 0) {
        res.status(400).json({ message: "Aucune place disponible" });
      }
    }
    // 2. Vérifier que l'utilisateur a assez de crédits
    const [users] = await db.query("SELECT credit FROM utilisateur WHERE utilisateur_id = ?", [utilisateurId]);
    if (!Array.isArray(users) || users.length === 0) {
      res.status(404).json({ message: "Utilisateur introuvable" });
    } else {
      const { credit } = users[0] as any;
      if (credit < creditRequis) {
       res.status(400).json({ message: "Crédits insuffisants" });
      }

    }


    // 3. Vérifier que l'utilisateur n'est pas déjà inscrit à ce trajet
    const [existe] = await db.query(
      "SELECT * FROM utilisateur_covoiturage WHERE utilisateur_id = ? AND covoiturage_id = ?",
      [utilisateurId, covoiturageId]
    );
    if ((existe as any[]).length > 0) {
      res.status(409).json({ message: "Déjà inscrit à ce covoiturage" });
    }

    // 4. Enregistrer la participation
    await db.query(
      "INSERT INTO utilisateur_covoiturage (utilisateur_id, covoiturage_id) VALUES (?, ?)",
      [utilisateurId, covoiturageId]
    );

    // 5. Mettre à jour le nombre de crédits et de places
    await db.query("UPDATE utilisateur SET credit = credit - ? WHERE utilisateur_id = ?", [
      creditRequis,
      utilisateurId,
    ]);
    await db.query("UPDATE covoiturage SET nb_place = nb_place - 1 WHERE covoiturage_id = ?", [covoiturageId]);

    res.status(200).json({ message: "Participation confirmée !" });
  } catch (error) {
    console.error("Erreur de participation :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

export const searchItineraire = async (req: Request, res: Response) => {
  try {
    const { lieu_depart, lieu_arrivee } = req.body;

    const sql = `
      SELECT * FROM covoiturage 
      WHERE lieu_depart LIKE ? AND lieu_arrivee LIKE ?
    `;

    const [rows] = await db.query(sql, [`%${lieu_depart}%`, `%${lieu_arrivee}%`]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erreur recherche itinéraire :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};