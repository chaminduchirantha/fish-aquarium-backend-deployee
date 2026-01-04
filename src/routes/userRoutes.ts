import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { Role } from "../model/user";
import { getUserAll } from "../controller/userController";

const router = Router()

router.get("/allUser" , authenticate ,requireRole([Role.ADMIN]),getUserAll)

export default router


