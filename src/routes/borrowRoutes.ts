import express from "express";
import { borrowBook } from "../controllers/borrowController";

const router = express.Router();

router.post("/borrow", borrowBook);

export default router;
