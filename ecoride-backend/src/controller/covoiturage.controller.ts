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
    const { lieu_depart, lieu_arrivee, date } = req.body;

    const sql = `
      SELECT * FROM covoiturage 
      WHERE lieu_depart LIKE ? AND lieu_arrivee LIKE ? AND date_depart = ?
    `;

     const [rows] = await db.query(sql, [`%${lieu_depart}%`, `%${lieu_arrivee}%`, date]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erreur recherche itinéraire :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const creerVoyage = async (req: Request, res: Response)=> {
  //TODO Rajouter les champs manquant
  const {
    utilisateurId,voiture_id,date_depart,heure_depart,lieu_depart,date_arrivee,heure_arrivee,lieu_arrivee,nb_place,prix_personne
  } = req.body;

  if (!utilisateurId || !voiture_id || !date_depart || !heure_depart || !lieu_depart ||
    !date_arrivee || !heure_arrivee || !lieu_arrivee ||
    !nb_place || !prix_personne) {
     res.status(400).json({ message: "Champs requis manquants" });
  }

  try {
    // Vérifier que l'utilisateur est chauffeur
    const [users] = await db.query("SELECT credit, role FROM utilisateur WHERE utilisateur_id = ?", [utilisateurId]);
    const user = (users as any[])[0];

    if (!user || !user.role.includes("chauffeur")) {
       res.status(403).json({ message: "Seuls les chauffeurs peuvent créer un voyage." });
    }

    if (user.credit < 2) {
       res.status(403).json({ message: "Crédits insuffisants (minimum 2)." });
    }

    // Créer le covoiturage
    await db.query(
      `INSERT INTO covoiturage (
        date_depart,heure_depart,lieu_depart,date_arrivee,heure_arrivee,lieu_arrivee,nb_place,prix_personne,voiture_id,utilisateur_id,
        statut
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'en_attente')`,
      [date_depart,heure_depart,lieu_depart,date_arrivee,heure_arrivee,lieu_arrivee,nb_place,prix_personne,voiture_id,utilisateurId]
    );

    // Déduire 2 crédits
    await db.query("UPDATE utilisateur SET credit = credit - 2 WHERE utilisateur_id = ?", [utilisateurId]);

     res.status(201).json({ message: "Voyage créé avec succès." });
  } catch (error) {
    console.error("Erreur création voyage :", error);
     res.status(500).json({ message: "Erreur serveur", error });
  }
};

export const getCovoiturageById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const [rows] = await db.query(`
      SELECT 
        c.*, 
        u.pseudo, u.photo, u.note,
        v.energie AS voiture_type,
        v.modele
      FROM covoiturage c
      JOIN utilisateur u ON c.utilisateur_id = u.utilisateur_id
      JOIN voiture v ON c.voiture_id = v.voiture_id
      WHERE covoiturage_id = ?
      ORDER BY c.date_depart ASC
    `, [id]);

    const trajets = (rows as any[]).map((row) => ({
      covoiturage_id: row.covoiturage_id,
      nb_place: row.nb_place,
      prix_personne: row.prix_personne,
      date_depart: row.date_depart,
      heure_depart: row.heure_depart,
      date_arrivee: row.date_arrivee,
      heure_arrivee: row.heure_arrivee,
      modele:row.modele,
      ecologique: row.voiture_type?.toLowerCase() === "électrique",
      chauffeur: {
        pseudo: row.pseudo,
        photo: row.photo || "https://via.placeholder.com/48",
        note: row.note || "—",
      }
    }));

    if ((rows as any[]).length === 0) {
      res.status(404).json({ message: 'Covoiturage non trouvé' });
    }

    // Optionnel : récupérer voiture, conducteur, etc. en join
    // const [voiture] = await db.query('SELECT * FROM voiture WHERE voiture_id = ?', [covoiturage.voiture_id]);

    res.json(trajets);
  } catch (error) {
    console.error('Erreur getById:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }};

export const rechercherCovoiturages = async (req: Request, res: Response) => {
  const {
    depart, arrivee, date,
    prix_max, duree_max, note_min, ecologique   
  } = req.body;

  if (!depart || !arrivee || !date) {
     res.status(400).json({ message: "Champs requis manquants" });
  }

  try {
    // Construction dynamique des conditions SQL
    let conditions = `
      c.lieu_depart = ? 
      AND c.lieu_arrivee = ? 
      AND c.date_depart = ? 
      AND c.nb_place > 0
    `;
    const params: any[] = [depart, arrivee, date];

    if (prix_max) {
      conditions += " AND c.prix_personne <= ?";
      params.push(prix_max);
    }

    if (note_min) {
      conditions += " AND u.note >= ?";
      params.push(note_min);
    }

    if (ecologique) {
      conditions += " AND v.energie = 'électrique'";
    }

    if (duree_max) {
      conditions += ` AND TIMESTAMPDIFF(MINUTE, 
        CONCAT(c.date_depart, ' ', c.heure_depart), 
        CONCAT(c.date_arrivee, ' ', c.heure_arrivee)) <= ?`;
      params.push(duree_max);
    }

    const [rows] = await db.query(`
      SELECT 
        c.*, 
        u.pseudo, u.photo, u.note,
        v.energie AS voiture_type,
        v.modele
      FROM covoiturage c
      JOIN utilisateur u ON c.utilisateur_id = u.utilisateur_id
      JOIN voiture v ON c.voiture_id = v.voiture_id
      WHERE ${conditions}
      ORDER BY c.date_depart ASC
    `, params);

    const trajets = (rows as any[]).map((row) => ({
      covoiturage_id: row.covoiturage_id,
      nb_place: row.nb_place,
      prix_personne: row.prix_personne,
      date_depart: row.date_depart,
      heure_depart: row.heure_depart,
      date_arrivee: row.date_arrivee,
      heure_arrivee: row.heure_arrivee,
      modele: row.modele,
      ecologique: row.voiture_type?.toLowerCase() === "électrique",
      chauffeur: {
        pseudo: row.pseudo,
        photo: row.photo || "https://via.placeholder.com/48",
        note: row.note || "—",
      }
    }));

    if (trajets.length > 0) {
       res.status(200).json(trajets);
    }

    // Aucun résultat → chercher le plus proche
    const [prochainRows] = await db.query(`
      SELECT 
        c.*, u.pseudo, u.photo, u.note,
        v.energie AS voiture_type, v.modele
      FROM covoiturage c
      JOIN utilisateur u ON c.utilisateur_id = u.utilisateur_id
      JOIN voiture v ON c.voiture_id = v.voiture_id
      WHERE c.lieu_depart = ? 
        AND c.lieu_arrivee = ? 
        AND c.date_depart > ?
        AND c.nb_place > 0
      ORDER BY c.date_depart ASC
      LIMIT 1
    `, [depart, arrivee, date]);

    const prochain = (prochainRows as any[]).map((row) => ({
      covoiturage_id: row.covoiturage_id,
      nb_place: row.nb_place,
      prix_personne: row.prix_personne,
      date_depart: row.date_depart,
      heure_depart: row.heure_depart,
      date_arrivee: row.date_arrivee,
      heure_arrivee: row.heure_arrivee,
      modele: row.modele,
      ecologique: row.voiture_type?.toLowerCase() === "électrique",
      chauffeur: {
        pseudo: row.pseudo,
        photo: row.photo || "https://via.placeholder.com/48",
        note: row.note || "—",
      }
    }));

     res.status(200).json({ prochain });
  } catch (error) {
    console.error("Erreur recherche covoiturages :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const getCovoiturageDetail = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT 
        c.*, 
        u.pseudo, u.photo, u.note,
        v.modele, m.libelle, v.energie,
        p.fumeur, p.animaux, p.preference_custom
      FROM covoiturage c
      JOIN utilisateur u ON c.utilisateur_id = u.utilisateur_id
      JOIN voiture v ON c.voiture_id = v.voiture_id
      JOIN marque m on m.marque_id = v.marque_id
      LEFT JOIN preference p ON u.utilisateur_id = p.utilisateur_id
      WHERE c.covoiturage_id = ?
    `, [id]);

    if ((rows as any[]).length === 0) {
       res.status(404).json({ message: "Covoiturage introuvable" });
    }

    const covoiturage = (rows as any[])[0];

    const [avisRows] = await db.query(`
      SELECT note, commentaire FROM avis
      WHERE utilisateur_id = ?
    `, [covoiturage.utilisateur_id]);

    res.status(200).json({
      covoiturage: {
        ...covoiturage,
        ecologique: covoiturage.energie?.toLowerCase() === "électrique",
        chauffeur: {
          pseudo: covoiturage.pseudo,
          photo: covoiturage.photo,
          note: covoiturage.note,
          preferences: {
            fumeur: covoiturage.fumeur,
            animal: covoiturage.animaux,
            autres: covoiturage.preference_custom,
          },
        },
        vehicule: {
          modele: covoiturage.modele,
          marque: covoiturage.libelle,
          energie: covoiturage.energie,
        },
        avis: avisRows,
      },
    });
  } catch (error) {
    console.error("Erreur détail covoiturage :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

export const ajouterAvis = async (req: Request, res: Response) => {
  const { utilisateur_id, note, commentaire } = req.body;
  await db.query(
    `INSERT INTO avis (utilisateur_id, note, commentaire) VALUES (?, ?, ?)`,
    [utilisateur_id, note, commentaire]
  );
  res.status(201).json({ message: "Avis ajouté." });
};

export const getHistoriqueCovoiturages = async (req: Request, res: Response) => {
  const utilisateurId = req.params.id;

  try {
    const [trajets] = await db.query(`
      SELECT c.*, u.pseudo AS chauffeur_pseudo
      FROM covoiturage c
      LEFT JOIN utilisateur_covoiturage uc ON c.covoiturage_id = uc.covoiturage_id
      LEFT JOIN utilisateur u ON c.utilisateur_id = u.utilisateur_id
      WHERE c.utilisateur_id = ? OR uc.utilisateur_id = ?
      ORDER BY c.date_depart DESC
    `, [utilisateurId, utilisateurId]);

    res.status(200).json(trajets);
  } catch (error) {
    console.error("Erreur historique :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

export const annulerCovoiturage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const utilisateurId = req.body.utilisateurId; // à sécuriser via JWT idéalement

  try {
    // Récupérer le covoiturage
    const [covoiturage] = await db.query(
      "SELECT * FROM covoiturage WHERE covoiturage_id = ?",
      [id]
    );

    if (!covoiturage) res.status(404).json({ message: "Covoiturage introuvable" });

    const result = (covoiturage as any[])[0];
    const isChauffeur = result.utilisateur_id === +utilisateurId;

    if (isChauffeur) {
      // Supprimer et rembourser tous les participants
      const [participants]: any[] = await db.query(
        "SELECT utilisateur_id FROM utilisateur_covoiturage WHERE covoiturage_id = ?",
        [id]
      );

      for (const p of participants) {
        await db.query("UPDATE utilisateur SET credit = credit + 1 WHERE utilisateur_id = ?", [p.utilisateur_id]);
        // Envoi email ici si SMTP configuré
      }

      await db.query("DELETE FROM utilisateur_covoiturage WHERE covoiturage_id = ?", [id]);
      await db.query("UPDATE utilisateur SET credit = credit + 2 WHERE utilisateur_id = ?", [utilisateurId]);
      await db.query("DELETE FROM covoiturage WHERE covoiturage_id = ?", [id]);

      res.status(200).json({ message: "Trajet annulé. Participants remboursés." });
    } else {
      // Participant annule => supprime et rembourse 1 crédit
      await db.query("DELETE FROM utilisateur_covoiturage WHERE covoiturage_id = ? AND utilisateur_id = ?", [id, utilisateurId]);
      await db.query("UPDATE utilisateur SET credit = credit + 1 WHERE utilisateur_id = ?", [utilisateurId]);
      await db.query("UPDATE covoiturage SET nb_place = nb_place + 1 WHERE covoiturage_id = ?", [id]);

      res.status(200).json({ message: "Participation annulée" });
    }

  } catch (error) {
    console.error("Erreur annulation :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
  
};

export const demarrerCovoiturage = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.query("UPDATE covoiturage SET statut = 'en_cours' WHERE covoiturage_id = ?", [id]);
    // Simule l'envoi d'un mail
    console.log(`📧 Covoiturage ${id} démarré – notification envoyée.`);
    res.status(200).json({ message: "Covoiturage démarré" });
  } catch (error) {
    console.error("Erreur démarrage :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const terminerCovoiturage = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // 1. Marquer terminé
    await db.query("UPDATE covoiturage SET statut = 'termine' WHERE covoiturage_id = ?", [id]);

    // 2. Récupérer les participants
    const [participants] = await db.query(
      "SELECT utilisateur_id FROM utilisateur_covoiturage WHERE covoiturage_id = ?", [id]);

    // 3. Notification (console ici)
    console.log("📧 Participants notifiés :", participants);

    // 4. À ce stade, on attend la validation utilisateur et l'ajout d'un avis côté frontend

    res.status(200).json({ message: "Covoiturage terminé. Participants notifiés." });
  } catch (error) {
    console.error("Erreur fin covoiturage :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

