import { Router } from "express";
import { authMiddleware } from '../middlewares/auth';
import { addAddress, deleteAddress } from "../controllers/users";


const userRoutes : Router = Router();

userRoutes.post("/address/", addAddress);
userRoutes.delete("/address/:id",deleteAddress); 



export default userRoutes;