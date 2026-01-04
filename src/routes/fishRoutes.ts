import { Router } from "express";
import { createFish, deleteFish, getAll, searchFish, updateFish } from "../controller/fishController";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { Role } from "../model/user";
import { upload } from "../middleware/upload";

const router = Router();

router.post("/createfish",  authenticate , requireRole([Role.ADMIN]) , upload.single("image"),createFish)
router.get("/all" , upload.single("image") , getAll)
router.put("/updateFish/:id", authenticate , requireRole([Role.ADMIN]) , upload.single("image"), updateFish)
router.delete("/deleteFish/:id", authenticate , requireRole([Role.ADMIN]),deleteFish)
router.get("/search", searchFish);

export default router