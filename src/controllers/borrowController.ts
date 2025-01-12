import { AsyncRequestHandler } from "../types/express";
import prisma from "../config/prismaClient";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

interface BorrowBookBody {
  bookId: number;
  dueDate: string;
}

export const borrowBook: AsyncRequestHandler<{}, any, BorrowBookBody> = async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: number };
    const userId = decoded.userId;

    const { bookId, dueDate } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if book exists and has available copies
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.copies <= 0) {
      return res.status(400).json({ message: "No copies available" });
    }

    // Create borrowed book record and decrease available copies
    const borrowedBook = await prisma.$transaction(async (prisma) => {
      const borrowed = await prisma.borrowedBook.create({
        data: {
          userId,
          bookId,
          dueDate: new Date(dueDate),
        },
      });

      await prisma.book.update({
        where: { id: bookId },
        data: { copies: { decrement: 1 } },
      });

      return borrowed;
    });

    return res.status(201).json({ message: "Book borrowed successfully", borrowedBook });
  } catch (error) {
    return res.status(500).json({ message: "Error borrowing book", error });
  }
};

export const returnBook: AsyncRequestHandler<{}, any, { borrowedBookId: number }> = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: number };
    const userId = decoded.userId;

    const { borrowedBookId } = req.body;

    // Find the borrowed book record
    const borrowedBook = await prisma.borrowedBook.findFirst({
      where: {
        id: borrowedBookId,
        userId,
        returnedAt: null
      },
      include: {
        book: true
      }
    });

    if (!borrowedBook) {
      return res.status(404).json({ message: "Borrowed book not found" });
    }

    // Calculate fine if returned late
    const today = new Date();
    const dueDate = new Date(borrowedBook.dueDate);
    let fine = 0;

    if (today > dueDate) {
      const daysLate = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      fine = daysLate * 10; // $10 per day late
    }

    // Update borrowed book record, increment book copies, and create transaction if fine exists
    const [returnedBook, transaction] = await prisma.$transaction(async (prisma) => {
      const returned = await prisma.borrowedBook.update({
        where: { id: borrowedBookId },
        data: {
          returnedAt: today,
          fine: fine
        }
      });

      await prisma.book.update({
        where: { id: borrowedBook.bookId },
        data: {
          copies: { increment: 1 }
        }
      });

      let fineTransaction = null;
      if (fine > 0) {
        fineTransaction = await prisma.transaction.create({
          data: {
            userId,
            amount: fine,
          }
        });
      }

      return [returned, fineTransaction];
    });

    const response = {
      message: "Book returned successfully",
      returnedBook,
      fine: fine > 0 ? {
        amount: fine,
        transaction,
        message: "Late return fine has been recorded"
      } : null
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Error returning book", error });
  }
};

// Add other book management logic here (editBook, deleteBook, searchBooks)
