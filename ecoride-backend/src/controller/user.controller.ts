import { Request, Response } from "express";
import { db } from "../config/db";
import bcrypt from 'bcrypt';

export const getProfilUtilisateur = async (req: Request, res: Response) => {
  const utilisateurId = req.params.id;

  try {
    const [user] = await db.query(
      `SELECT utilisateur_id, nom, prenom, email, pseudo,  credit, photo, note, libelle as role FROM utilisateur, role WHERE utilisateur.role_id = role.role_id and utilisateur_id = ?`,
      [utilisateurId]
    );

    const [pref] = await db.query(
      `SELECT fumeur, animaux, preference_custom FROM preference WHERE utilisateur_id = ?`,
      [utilisateurId]
    );

    const [vehicules] = await db.query(
      `SELECT voiture_id, immatriculation, modele, couleur, energie, date_premiere_immatriculation, marque_id FROM voiture WHERE utilisateur_id = ?`,
      [utilisateurId]
    );

    res.status(200).json({
      utilisateur: user,
      preferences: pref || null,
      vehicules: vehicules || [],
    });
  } catch (error) {
    console.error("Erreur getProfilUtilisateur :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


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

export const definirProfilUtilisateur = async (req: Request, res: Response) => {
  const { utilisateurId, role, vehicules, prefs } = req.body;

  if (!utilisateurId || !role) {
     res.status(400).json({ message: "Champs requis manquants." });
  }

  try {
    // MAJ rôle utilisateur
    await db.query("UPDATE utilisateur SET role = ? WHERE utilisateur_id = ?", [role, utilisateurId]);

    // Supprimer anciens véhicules (optionnel)
    await db.query("DELETE FROM voiture WHERE utilisateur_id = ?", [utilisateurId]);

    // Insertion véhicules si chauffeur
    if (role !== "passager" && Array.isArray(vehicules)) {
      for (const v of vehicules) {
        await db.query(`
          INSERT INTO voiture (immatriculation, date_premiere_immatriculation, modele, couleur, marque_id, utilisateur_id)
          VALUES (?, ?, ?, ?, ?, ?)`, [
          v.immatriculation,
          v.date,
          v.modele,
          v.couleur,
          v.marque_id,
          utilisateurId
        ]);
      }
    }

    // Préférences
    await db.query("DELETE FROM preference WHERE utilisateur_id = ?", [utilisateurId]);
    await db.query(`
      INSERT INTO preference (utilisateur_id, fumeur, animaux, preference_custom)
      VALUES (?, ?, ?, ?)`, [
      utilisateurId,
      prefs.fumeur ? 1 : 0,
      prefs.animaux ? 1 : 0,
      prefs.preference_custom || null,
    ]);

    res.status(200).json({ message: "Profil mis à jour" });
  } catch (error) {
    console.error("Erreur profil :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
