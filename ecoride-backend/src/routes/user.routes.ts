import express from "express";
import { getAllUsers, RegisterUser } from "../controller/user.controller"; 
import { definirRoleEtInfos } from "../controller/user.controller"; 



const router = express.Router();


router.post("/register", RegisterUser);

router.get("/", getAllUsers);

router.post("/role", definirRoleEtInfos);


export default router;
