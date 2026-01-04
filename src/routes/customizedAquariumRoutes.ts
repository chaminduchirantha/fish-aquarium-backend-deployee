import { Router } from "express";
import { create, getDetails } from "../controller/customizedAquariumController";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { Role } from "../model/user";
import { upload } from "../middleware/upload";

const router = Router()

router.post('/create' ,authenticate, requireRole([Role.USER]), upload.single("image"), create)

router.get('/get'  ,authenticate , requireRole([Role.ADMIN]) ,  getDetails)

export default router