import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:3010";

export class Covoiturage {

  static apiUrl = import.meta.env.VITE_API_URL;
  static token = localStorage.getItem("token");


  public static async participerCovoiturage(id: number, utilisateurId: number) {

    try {
      const res = await axios.post(`${this.apiUrl}/api/covoiturage/${id}/participer`, { utilisateurId: utilisateurId }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`
        }
      },
      )
    } catch (err) {
      console.error("Erreur lors de la participation de covoiturage :", err);
      throw err;
    }

  }

  static async searchItineraire(depart: string, arrivee: string, date: string, prix_max: number = 0, duree_max: number = 0, note_min: number = 0, ecologique: boolean = false) {
    let eco = 'essence';
    if (ecologique == true) {
      eco = "electrique"
    }
    try {
      const res = await axios.post(`${this.apiUrl}/api/covoiturage/rechercher`, {
        depart,
        arrivee,
        date,
        prix_max,
        duree_max,
        note_min,
        eco
      });
      return res.data;
    } catch (err) {
      console.error("Erreur lors de la recherche d'itinéraire :", err);
      throw err;
    }
  }

  public static async getById(id: number) {
    try {
      const res = await axios.get(`${this.apiUrl}/api/covoiturage/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`
        },
      });
      return res.data;
    } catch (err) {
      console.error("une erreur s'est produite : " + err)
    }

  }

  public static async getHistoriqueCovoiturages(utilisateurId: number) {

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/covoiturage/${utilisateurId}/searchcovoiturage`);
      return res.data;
    } catch (error) {
      console.error("error dans la recuperation des historique de covoiturage: " + error)
    }

  }

  public static async annulerCovoiturage(utilisateurId: number, covoiturageId: number) {

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/covoiturage/${covoiturageId}/annuler`, { utilisateurId });
      return res.data;
    } catch (error) {
      console.error("error dans l'annulation du covoiturage: " + error)
    }

  }

  public static async actionCovoiturage(id: number, action: string) {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/covoiturage/${id}/${action}`)
      return res.data;
    } catch (error) {
      console.error("error dans les actions du covoiturage : " + error);
    }
  }

}

