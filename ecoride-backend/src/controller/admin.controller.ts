import { Request, Response } from "express";
import { db } from "../config/db";
import bcrypt from "bcrypt";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const [covoituragesParJour] = await db.query(`
      SELECT DATE(date_depart) as date, COUNT(*) as total
      FROM covoiturage
      GROUP BY DATE(date_depart)
    `);

    const [creditsParJour] = await db.query(`
      SELECT DATE(date_depart) as date, COUNT(*) * 2 as total
      FROM covoiturage
      GROUP BY DATE(date_depart)
    `);

    const [creditsTotal] = await db.query(`
      SELECT COUNT(*) * 2 as total FROM covoiturage
    `);

    const [utilisateurs] = await db.query(`
      SELECT utilisateur_id, nom, email, role FROM utilisateur
    `);

    res.json({
      covoituragesParJour,
      creditsParJour,
      creditsTotal: (creditsTotal as any[])[0].total,
      utilisateurs,
    });
  } catch (error) {
    console.error("Erreur getDashboard:", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

export const suspendUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.query(`UPDATE utilisateur SET role = 'suspendu' WHERE utilisateur_id = ?`, [id]);
    res.status(200).json({ message: "Compte suspendu" });
  } catch (error) {
    console.error("Erreur suspension :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const createEmploye = async (req: Request, res: Response) => {
  const { nom, prenom, email, password } = req.body;

  if (!nom || !prenom || !email || !password) {
     res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO utilisateur (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, 'employe')`,
      [nom, prenom, email, hashedPassword]
    );

    res.status(201).json({ message: "Employé créé avec succès" });
  } catch (error) {
    console.error("Erreur création employé:", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
