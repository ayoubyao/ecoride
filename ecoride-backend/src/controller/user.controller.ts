import { Request, Response } from "express";
import { db } from "../config/db";
import bcrypt from 'bcrypt';



export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM utilisateur");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

export const RegisterUser = async (req: Request, res: Response) => {
  const { email, pseudo, password } = req.body;

  if (!email || !pseudo || !password) {
    res.status(400).json({ message: "Champs requis manquants" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO utilisateur (email, pseudo, password) VALUES (?, ?, ?)",
      [email, pseudo, hashedPassword]
    );
    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    console.error("Erreur d'inscription :", error);
    res.status(500).json({ message: "Erreur lors de la création", error });
  }
};


export const definirRoleEtInfos = async (req: Request, res: Response) => {
  const { utilisateurId, role, vehicules, preferences } = req.body;

  if (!role || !utilisateurId) {
   res.status(400).json({ message: "Utilisateur ou rôle manquant" });
  }

  try {
    // 1. Met à jour le rôle
    await db.query("UPDATE utilisateur SET role = ? WHERE utilisateur_id = ?", [role, utilisateurId]);

    if (role.includes("chauffeur")) {
      // 2. Enregistre les véhicules
      for (const v of vehicules) {
        await db.query(
          `INSERT INTO vehicule (utilisateur_id, marque, modele, couleur, plaque, date_immatriculation, nb_places)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [utilisateurId, v.marque, v.modele, v.couleur, v.plaque, v.date_immatriculation, v.nb_places]
        );
      }

      // 3. Enregistre les préférences
      await db.query(
        `INSERT INTO preference (utilisateur_id, fumeur, animaux, preference_custom)
         VALUES (?, ?, ?, ?)`,
        [utilisateurId, preferences.fumeur, preferences.animaux, preferences.preference_custom || null]
      );
    }

   res.status(200).json({ message: "Rôle et informations enregistrés" });
  } catch (error) {
    console.error("Erreur :", error);
   res.status(500).json({ message: "Erreur serveur", error });
  }
};

