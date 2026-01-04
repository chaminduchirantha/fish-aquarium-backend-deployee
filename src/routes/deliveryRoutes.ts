import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { Role } from "../model/user";
import { getAllDelivery, saveDelivery } from "../controller/deliveryController";

const router = Router()

router.post("/create",  authenticate , requireRole([Role.USER]) ,saveDelivery)
router.get("/allDelivery" , authenticate ,requireRole([Role.ADMIN]), getAllDelivery)

export default router

