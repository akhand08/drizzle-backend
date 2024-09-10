import { NextFunction, Request, Response } from "express";
import { eq, and } from 'drizzle-orm/expressions';
import  db  from '../db/index'; // Assuming you've set up your Drizzle connection
import { productTable, cartItemsTable } from '../db/schema'; // Import your schema

export const addItemToCart = async (req: Request, res: Response, next: NextFunction) => {
  const product = await db.select().from(productTable)
    .where(eq(productTable.id, req.body.productId))
    .limit(1);

  if (!product.length) {
    return res.status(404).send("Product not found");
  }

  const cart = await db.insert(cartItemsTable).values({
    userId: req.user?.id,
    productId: req.body.productId,
    quantity: req.body.quantity,
  }).returning();

  res.json(cart);
};

export const deleteItemFromCart = async (req: Request, res: Response, next: NextFunction) => {
  const cartItem = await db.select().from(cartItemsTable)
    .where(eq(cartItemsTable.id, +req.params.id))
    .limit(1);

  if (!cartItem.length || cartItem[0].userId !== req.user?.id) {
    return res.status(404).send("Cart item not found");
  }

  await db.delete(cartItemsTable).where(eq(cartItemsTable.id, +req.params.id));

  res.json({ success: true });
};

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const cartItems = await db.select({
    cartItem: cartItemsTable,
    product: productTable
  })
  .from(cartItemsTable)
  .leftJoin(productTable, eq(cartItemsTable.productId, productTable.id))
  .where(eq(cartItemsTable.userId, req.user?.id));

  res.json(cartItems);
};