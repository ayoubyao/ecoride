import axios from "axios";

export class Covoiturage {

  static apiUrl = import.meta.env.VITE_API_URL;
  static token = localStorage.getItem("token");


  public static async participerCovoiturage(id: number, utilisateurId: number) {

    try {
      const res = await axios.post(`${this.apiUrl}/covoiturage/${id}/participer`, { utilisateurId: utilisateurId }, {
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

  static async searchItineraire(lieu_depart: string, lieu_arrivee: string, date: string) {
    try {
      const res = await axios.post(`${this.apiUrl}/covoiturage/search`, {
        lieu_depart,
        lieu_arrivee,
        date
      });
      return res.data;
    } catch (err) {
      console.error("Erreur lors de la recherche d'itinéraire :", err);
      throw err;
    }
  }

  public static async getById(id: number) {
    try {
      const res = await axios.get(`${this.apiUrl}/covoiturage/getbyid/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`
        },
      });
      return res.data;
    } catch (err) {
    }

  }

}


