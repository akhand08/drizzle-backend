import { Router } from "express";
import { errorHandler } from "../error_handler";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "../controllers/products";
import { authMiddleware } from '../middlewares/auth';




const productRoutes: Router = Router();


productRoutes.post('/', authMiddleware, createProduct);
productRoutes.delete('/:id',authMiddleware,   deleteProduct);
productRoutes.get('/', authMiddleware,listProducts);
productRoutes.get('/:id', authMiddleware,  getProductById);



export default productRoutes;
