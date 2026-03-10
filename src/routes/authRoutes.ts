import { Router } from "express";
import passport, { getMyDetails, handleRefreshToken, login, register } from "../controller/authController";
import { authenticate } from "../middleware/auth";

const router = Router()

router.post("/register" , register)
router.post("/login", login)
router.get("/get", authenticate, getMyDetails)
router.post("/refresh", handleRefreshToken)
