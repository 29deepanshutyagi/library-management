import express from "express";
import { addBook, addAuthor, addCategory } from "../controllers/bookController";

const router = express.Router();

router.post("/", addBook);
router.post("/authors", addAuthor);
router.post("/categories", addCategory);

export default router;
