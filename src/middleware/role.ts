import { NextFunction, Response } from "express"
import { Role } from "../model/user"
import { AuthRequest } from "./auth"

export const requireRole = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      })
    }

    const userRoles = req.user.role; // <-- FIXED

    const hasRole = userRoles?.some((r: Role) => roles.includes(r));
    if (!hasRole) {
      return res.status(403).json({
        message: `Require ${roles} role`
      })
    }
    next()
  }
}
