import { AsyncRequestHandler } from "../types/express";
import prisma from "../config/prismaClient";

interface BorrowBookBody {
  bookId: number;
  userId: number;
  dueDate: string;
}

export const borrowBook: AsyncRequestHandler<{}, any, BorrowBookBody> = async (
  req,
  res,
) => {
  try {
    const { bookId, userId, dueDate } = req.body;

    const borrowedBook = await prisma.borrowedBook.create({
      data: {
        bookId,
        userId,
        dueDate: new Date(dueDate),
      },
    });

    return res
      .status(201)
      .json({ message: "Book borrowed successfully", borrowedBook });
  } catch (error) {
    return res.status(500).json({ message: "Error borrowing book", error });
  }
};

// Add other book management logic here (editBook, deleteBook, searchBooks)
