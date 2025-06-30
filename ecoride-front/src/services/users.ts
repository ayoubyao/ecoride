import axios from "axios";

export class User {
  static apiUrl = import.meta.env.VITE_API_URL;
  static token = localStorage.getItem("token");

  public static async getAllUsers() {
    try {
      const res = await axios.get(`${this.apiUrl}/users`);
      return res.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      throw error;
    }
  }

  public static async register(myUser: User) {
    try {
      const res = await axios.post(`${this.apiUrl}/users/register`, myUser, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      throw error;
    }
  }

  static async saveProfile(data: any) {

    try {
      const res = await axios.post(`${this.apiUrl}/users/profil`, data, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`
        }
      });

      return res.data;
    } catch (error) {
      console.error("error de sauvegarde profil" + error)
    }

  }

  public static async login(email: string, password: string) {
    try {
      const res = await axios.post(`${this.apiUrl}/auth/login`, { email, password }
      );

      return res.data;
    } catch (error) {
      console.error("error de sauvegarde profil" + error)
    }

  }

  public static async getUserProfile(utilisateurId: number) {
    try {
      const res = await axios.get(`${this.apiUrl}/users/${utilisateurId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`

        }
      });
      return res.data;
    } catch (error) {
      console.error("error dans la recuperation du profil" + error)
    }
  }

}


