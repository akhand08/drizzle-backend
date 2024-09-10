import { NextFunction, Request, Response } from "express";
import db from "../db/index";
import { userTable } from "../db/schema";
import { eq } from "drizzle-orm";
import * as jwt from "jsonwebtoken"

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await db.select().from(userTable).where(eq(userTable.email , username));

    if (!existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = await db
      .insert(userTable)
      .values({
        username,
        email,
        password,
      })
      .returning();

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};




export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const users = await db
      .select({
        id: userTable.id,
        email: userTable.email,
        password: userTable.password,
        role: userTable.role
      })
      .from(userTable)
      .where(eq(userTable.email, email));

      if (users.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const user = users[0];
  

  const token = jwt.sign(
    {
      userId: user.id,
    },
    "0987654321"
    
  );

  res.json({ user, token });
};
// export const me = async (req: Request, res: Response, next: NextFunction) => {
//   res.json(req.user);
// };
