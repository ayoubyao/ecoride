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

  static async searchItineraire(depart: string, arrivee: string, date: string, prix_max:number = 0,duree_max:number = 0,note_min:number = 0,ecologique:boolean = false) {
    let eco = 'essence';
    if(ecologique==true){
        eco = "electrique"
    }
    try {
      const res = await axios.post(`${this.apiUrl}/covoiturage/rechercher`, {
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
      const res = await axios.get(`${this.apiUrl}/covoiturage/${id}`, {
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

}

