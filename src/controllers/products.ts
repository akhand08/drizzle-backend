import { NextFunction, Request, Response } from "express";
import db from "../db/index";
import { productTable } from "../db/schema"; 
import { eq,  count } from 'drizzle-orm';


export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const product = await db.insert(productTable).values({
    ...req.body
  }).returning();

  if (!product) {
    return res.status(422).send("Unprocessable Entity"); 
  }

  res.json(product[0]);
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = req.body;
    

    const updatedProduct = await db.update(productTable)
      .set(product)
      .where(eq(productTable.id, +req.params.id))
      .returning();

    res.json(updatedProduct[0]);
  } catch (error) {
    return res.status(404).send("Product Not Found");
  }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = +req.params.id;
    await db.delete(productTable).where(eq(productTable.id, productId));
  } catch {
    return res.status(404).send("Product not found");
  }

  res.send("Product has been deleted");
}



export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  const countResult = await db.select({ count: count() }).from(productTable);
  const totalCount = Number(countResult[0].count);

  const skip = typeof(req.query.skip) === 'string' ? parseInt(req.query.skip, 10) : 0;
  const limit = 5;

  const products = await db
    .select()
    .from(productTable)
    .limit(limit)
    .offset(skip)
    .orderBy(productTable.id); 

  res.json({
    count: totalCount,
    data: products
  });
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await db.select().from(productTable).where(eq(productTable.id, +req.params.id));

    if (product.length === 0) {
      return res.status(404).send("Product not found");
    }

    res.json(product[0]);
  } catch (error) {
    return res.status(404).send("Product not found");
  }
}