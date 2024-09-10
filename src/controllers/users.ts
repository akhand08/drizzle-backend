import { NextFunction, Request, Response } from "express";
import { eq } from 'drizzle-orm/expressions';
import db from '../db/index'; 
import { addressTable } from '../db/schema'; 

export const addAddress = async (req: Request, res: Response, next: NextFunction) => {
  const address = await db.insert(addressTable).values({
    ...req.body,
    userId: req.user?.id,
  }).returning();

  res.json(address);
};

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await db.delete(addressTable).where(eq(addressTable.id, +req.params.id));

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


