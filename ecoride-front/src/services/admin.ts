import axios from "axios";
import { config } from "./config";

const apiUrl = config.API_URL;

export class Admin  {
  public static async getDashboard() {
    const res = await axios.get(`${apiUrl}/api/admin/dashboard`);
    return res.data;
  }

  public static async createEmploye(data: { email: string, password: string, nom: string, prenom: string}) {
    try {
       const res = await axios.post(`${apiUrl}/api/admin/createEmploye`, data);
    return res.data;
    } catch (error) {
       console.error("error dans la creation du employer : " + error)
    }
   
  }

  public static  async suspendUser(id: number) {
    try {
       const res = await axios(`${apiUrl}/api/admin/suspendUser/${id}`, {
      method: "PATCH",
    });
    return res.data;
    } catch (error) {
      console.error("error dans la suspend du user : " + error)
    }
   
  }
};
