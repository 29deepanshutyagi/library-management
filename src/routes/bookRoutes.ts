import express from "express";
import { addBook } from "../controllers/bookController";

const router = express.Router();

router.post("/", addBook); // Admin only

export default router;
