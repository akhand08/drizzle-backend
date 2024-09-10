import {Router} from 'express';
import { addItemToCart, deleteItemFromCart, getCart } from '../controllers/carts';
import { authMiddleware } from '../middlewares/auth';


const cartRoutes:Router = Router();

cartRoutes.post('/', authMiddleware, addItemToCart);
cartRoutes.get('/', authMiddleware, getCart);
cartRoutes.delete('/:id', authMiddleware, deleteItemFromCart);



export default cartRoutes;