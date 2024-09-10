import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm/expressions';
import  db  from '../db/index'; // Assuming you've set up your Drizzle connection
import { userTable } from '../db/schema'; // Import your schema


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const payload = jwt.verify(token, "0987654321") as any;
    const users = await db.select().from(userTable).where(eq(userTable.id, payload.userId)).limit(1);

    if (users.length === 0) {
      return res.status(401).send("Unauthorized");
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
};