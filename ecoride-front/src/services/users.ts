import axios from "axios";

export class User {
  static apiUrl = import.meta.env.VITE_API_URL;

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
}
