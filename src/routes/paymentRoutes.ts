import express from "express";
import { payFine, getInvoice } from "../controllers/paymentController";

const router = express.Router();

router.post("/fine", payFine);
router.get("/invoices", getInvoice);

export default router; 