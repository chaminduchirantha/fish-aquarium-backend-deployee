import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { Role } from "../model/user";
import { getAllPayment, getPaymentByUser, savePayment } from "../controller/paymentController";
import { generatePaymentSlip } from "../controller/pdfPaymentSlip";

const router = Router()

router.post("/create",  authenticate , requireRole([Role.USER]) , savePayment)
router.get("/allPayment" , authenticate ,requireRole([Role.ADMIN]), getAllPayment)
router.get("/my-payments/:email", getPaymentByUser);
router.get("/payment-slip/:email", generatePaymentSlip);


    
export default router