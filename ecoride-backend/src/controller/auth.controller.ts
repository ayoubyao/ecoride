import { Request, Response } from "express";
import { db } from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mon_secret_de_test";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
   res.status(400).json({ message: "Champs requis manquants" });
  }

  try {
    // Vérifie si l'utilisateur existe
    const [rows] = await db.query("SELECT * FROM utilisateur WHERE email = ?", [email]);
    const users = rows as any[];

    if (users.length === 0) {
       res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    const user = users[0];

    // Vérifie le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
       res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Génère un token JWT
    const token = jwt.sign(
      {
        utilisateurId: user.utilisateur_id,
        email: user.email,
        pseudo: user.pseudo,
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

     res.status(200).json({
      message: "Connexion réussie",
      token,
      utilisateur: {
        id: user.utilisateur_id,
        pseudo: user.pseudo,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erreur de connexion :", error);
     res.status(500).json({ message: "Erreur serveur", error });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { email, pseudo, password } = req.body;

  if (!email || !pseudo || !password) {
     res.status(400).json({ message: "Champs requis manquants" });
  }

  try {
    const [existing] = await db.query("SELECT * FROM utilisateur WHERE email = ?", [email]);
    if ((existing as any[]).length > 0) {
       res.status(409).json({ message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO utilisateur (email, pseudo, password, credit) VALUES (?, ?, ?, ?)",
      [email, pseudo, hashedPassword, 10]
    );

     res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    console.error("Erreur register:", error);
     res.status(500).json({ message: "Erreur serveur", error });
  }
};