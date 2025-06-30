import express from "express";
import { getAllUsers, getProfilUtilisateur, RegisterUser } from "../controller/user.controller"; 
import { definirRoleEtInfos } from "../controller/user.controller"; 
import { definirProfilUtilisateur } from "../controller/user.controller";


const router = express.Router();


router.post("/register", RegisterUser);

router.get("/", getAllUsers);

router.post("/role", definirRoleEtInfos);

router.post("/profil", definirProfilUtilisateur);

router.get("/:id", getProfilUtilisateur);



export default router;
