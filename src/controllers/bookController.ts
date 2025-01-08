import { Request, Response } from "express";
import prisma from "../config/prismaClient";

export const addBook = async (req: Request, res: Response) => {
  try {
    const { title, isbn, copies, authors, categories } = req.body;

    const book = await prisma.book.create({
      data: {
        title,
        isbn,
        copies,
        authors: { connect: authors.map((id: number) => ({ id })) },
        categories: { connect: categories.map((id: number) => ({ id })) },
      },
    });

    res.status(201).json({ message: "Book added successfully", book });
  } catch (error) {
    res.status(500).json({ message: "Error adding book", error });
  }
};

// Add other book management logic here (editBook, deleteBook, searchBooks)
