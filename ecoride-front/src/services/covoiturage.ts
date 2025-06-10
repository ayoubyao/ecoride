import axios from "axios";

export class Covoiturage {

  static apiUrl = import.meta.env.VITE_API_URL;
  token = localStorage.getItem("token");


  public async participerCovoiturage(id: number) {
    await fetch(`http://localhost:3010/api/covoiturages/${id}/participer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.token}`
      },
      body: JSON.stringify({ utilisateurId: 1 }) // ou issu du token connecté
    });

  }

  static async searchItineraire(lieu_depart: string, lieu_arrivee: string) {
    try {
      const res = await axios.post(`${this.apiUrl}/covoiturage/search`, {
        lieu_depart,
        lieu_arrivee,
      });
      return res.data;
    } catch (err) {
      console.error("Erreur lors de la recherche d'itinéraire :", err);
      throw err;
    }
  }

}


