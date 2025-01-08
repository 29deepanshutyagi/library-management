import { Request, Response } from "express";
import prisma from "../config/prismaClient";

export const payFine = async (req: Request, res: Response) => {
  try {
    const { userId, amount } = req.body;

    const transaction = await prisma.transaction.create({
      data: { userId, amount },
    });

    res.status(201).json({ message: "Fine paid successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Error processing payment", error });
  }
};
