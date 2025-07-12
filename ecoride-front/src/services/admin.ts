import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "https://nodejsclusters-198212-0.cloudclusters.net/api";

export class Admin  {
  public static async getDashboard() {
    const res = await axios.get(`${apiUrl}/admin/dashboard`);
    return res.data;
  }

  public static async createEmploye(data: { email: string, password: string, nom: string, prenom: string}) {
    try {
       const res = await axios.post(`${apiUrl}/admin/createEmploye`, data);
    return res.data;
    } catch (error) {
       console.error("error dans la creation du employer : " + error)
    }
   
  }

  public static  async suspendUser(id: number) {
    try {
       const res = await axios(`${apiUrl}/admin/suspendUser/${id}`, {
      method: "PATCH",
    });
    return res.data;
    } catch (error) {
      console.error("error dans la suspend du user : " + error)
    }
   
  }
};
