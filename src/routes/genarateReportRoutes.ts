import { Router } from "express";
import { generateOrderReport } from "../controller/pdfOrderFishReportController";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { Role } from "../model/user";
import { generateAccessoriesOrderReport } from "../controller/pdfOrdersAccessoriesReport";

const router = Router()

router.get("/pdf", generateOrderReport);
router.get("/acce/pdf", generateAccessoriesOrderReport);

export default router