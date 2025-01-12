import { AsyncRequestHandler } from "../types/express";
import prisma from "../config/prismaClient";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

interface AddBookBody {
  title: string;
  isbn: string;
  copies: number;
  authors: number[];
  categories: number[];
}

export const addBook: AsyncRequestHandler<{}, any, AddBookBody> = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: number; role: string };
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { title, isbn, copies, authors, categories } = req.body;

    const book = await prisma.book.create({
      data: {
        title,
        isbn,
        copies,
        authors: { connect: authors.map((id) => ({ id })) },
        categories: { connect: categories.map((id) => ({ id })) },
      },
    });

    return res.status(201).json({ message: "Book added successfully", book });
  } catch (error) {
    return res.status(500).json({ message: "Error adding book", error });
  }
};

interface AddAuthorBody {
  name: string;
}

export const addAuthor: AsyncRequestHandler<{}, any, AddAuthorBody> = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: number; role: string };
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { name } = req.body;
    const author = await prisma.author.create({
      data: { name },
    });

    return res.status(201).json({ message: "Author added successfully", author });
  } catch (error) {
    return res.status(500).json({ message: "Error adding author", error });
  }
};

interface AddCategoryBody {
  name: string;
}

export const addCategory: AsyncRequestHandler<{}, any, AddCategoryBody> = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: number; role: string };
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { name } = req.body;
    const category = await prisma.category.create({
      data: { name },
    });

    return res.status(201).json({ message: "Category added successfully", category });
  } catch (error) {
    return res.status(500).json({ message: "Error adding category", error });
  }
};

// Add other book management logic here (editBook, deleteBook, searchBooks)
