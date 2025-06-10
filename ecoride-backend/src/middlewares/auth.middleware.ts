import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mon_secret_de_test";

export interface JwtPayload {
  utilisateurId: number;
  email: string;
  pseudo: string;
}

/** Middleware 100 % typé : retourne toujours void */
export const verifyToken: RequestHandler = (req, res, next) => {
  const bearer = req.headers.authorization;        // « Bearer <token> »
  const token = bearer?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token manquant" });
    return;                                        // <-- assure le type void
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    // on injecte l’ID utilisateur dans la requête pour la suite
    (req as any).utilisateurId = decoded.utilisateurId;
    next();                                        // passe au middleware suivant
  } catch (error) {
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};
