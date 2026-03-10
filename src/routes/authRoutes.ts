import { Router } from "express";
import passport, { getMyDetails, handleRefreshToken, login, register } from "../controller/authController";
import { authenticate } from "../middleware/auth";

const router = Router()

router.post("/register" , register)
router.post("/login", login)
router.get("/get", authenticate, getMyDetails)
router.post("/refresh", handleRefreshToken)
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: any, res) => {
    const { accessToken, refreshToken } = req.user;

    const frontendUrl = process.env.FRONTEND_URL; 
    res.redirect(`${frontendUrl}/auth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  }
);


export default router