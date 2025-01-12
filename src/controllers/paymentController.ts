import { AsyncRequestHandler } from "../types/express";
import prisma from "../config/prismaClient";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

interface PayFineBody {
  borrowedBookId: number;
  amount: number;
}

interface PaymentResponse {
  message: string;
  payment?: {
    id: number;
    userId: number;
    amount: number;
    createdAt: Date;
    borrowedBook?: {
      id: number;
      dueDate: Date;
      returnedAt: Date | null;
    };
  };
  transactions?: any[];
  error?: any;
}

export const payFine: AsyncRequestHandler<{}, PaymentResponse, PayFineBody> = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: number };
    const userId = decoded.userId;

    const { borrowedBookId, amount } = req.body;

    // Check if borrowed book exists and belongs to user
    const borrowedBook = await prisma.borrowedBook.findFirst({
      where: {
        id: borrowedBookId,
        userId,
        fine: { gt: 0 },
        returnedAt: null
      }
    });

    if (!borrowedBook) {
      return res.status(404).json({ message: "No pending fine found for this book" });
    }

    // Create payment record and update fine
    const payment = await prisma.$transaction(async (prisma) => {
      const transaction = await prisma.transaction.create({
        data: {
          userId,
          amount,
        },
        include: {
          user: true
        }
      });

      await prisma.borrowedBook.update({
        where: { id: borrowedBookId },
        data: { fine: { decrement: amount } }
      });

      return transaction;
    });

    return res.status(201).json({ 
      message: "Fine paid successfully", 
      payment 
    });
  } catch (error) {
    return res.status(500).json({ message: "Error processing payment", error });
  }
};

export const getInvoice: AsyncRequestHandler<{}, PaymentResponse> = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: number };
    const userId = decoded.userId;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({
      message: "Invoices retrieved successfully",
      transactions
    });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving invoices", error });
  }
};
